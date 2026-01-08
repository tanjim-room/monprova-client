import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDoctor from '../../hooks/useDoctor';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaCalendarAlt, FaUserInjured, FaFilePrescription, FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaCalendarCheck, FaUsers, FaChartLine, FaUserCog, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

const DoctorHome = () => {
    const [doctors] = useDoctor();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    
    const doctor = doctors?.find(d => d.email === user?.email);
    
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [nextAppointment, setNextAppointment] = useState(null);
    const [stats, setStats] = useState({
        todayCount: 0,
        totalPatients: 0,
        pendingPrescriptions: 0,
        monthlyEarnings: 0,
        completedSessions: 0,
        upcomingCount: 0
    });

    useEffect(() => {
        if (user?.email && doctor?._id) {
            fetchAllData();
        }
    }, [user?.email, doctor?._id]);

    const fetchAllData = async () => {
        try {
            const [appointmentsRes, prescriptionsRes] = await Promise.all([
                axiosSecure.get('/api/appointments'),
                axiosSecure.get('/api/prescriptions')
            ]);

            const allAppointments = appointmentsRes.data;
            const allPrescriptions = prescriptionsRes.data;

            // Filter doctor's appointments
            const myAppointments = allAppointments.filter(
                apt => apt.doctorID === doctor._id && apt.paymentStatus === 'paid'
            );
            
            console.log('All my appointments:', myAppointments.length);
            console.log('Appointment states:', myAppointments.map(apt => apt.state));
            console.log('Sample appointment:', myAppointments[0]);
            
            setAppointments(myAppointments);

            // Get today's date
            const today = new Date().toISOString().split('T')[0];

            // Filter today's appointments
            const todayApts = myAppointments.filter(apt => {
                const aptDate = new Date(apt.date).toISOString().split('T')[0];
                return aptDate === today;
            });
            setTodayAppointments(todayApts);

            // Find next upcoming appointment
            const upcomingAppointments = myAppointments
                .filter(apt => apt.state === 'upcoming')
                .sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA - dateB;
                });
            
            if (upcomingAppointments.length > 0) {
                setNextAppointment(upcomingAppointments[0]);
            }

            // Calculate statistics
            const completedAppointments = myAppointments.filter(apt => 
                apt.state === 'completed' || apt.state === 'Completed'
            );
            const completed = completedAppointments.length;
            const upcoming = myAppointments.filter(apt => apt.state === 'upcoming').length;
            
            console.log('Completed appointments count:', completed);
            console.log('Completed appointments:', completedAppointments);
            
            // Get unique patients
            const uniquePatients = new Set(myAppointments.map(apt => apt.patientEmail));
            
            // Get pending prescriptions (completed appointments without prescription)
            const completedAppointmentIds = completedAppointments.map(apt => apt._id);
            const prescribedAppointmentIds = allPrescriptions
                .filter(pres => completedAppointmentIds.includes(pres.appointmentId))
                .map(pres => pres.appointmentId);
            const pendingPrescriptions = completedAppointmentIds.filter(
                id => !prescribedAppointmentIds.includes(id)
            ).length;

            // Calculate monthly earnings (80% of total fees)
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const completedThisMonth = completedAppointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getMonth() === currentMonth && 
                       aptDate.getFullYear() === currentYear;
            });
            
            console.log('Completed appointments this month:', completedThisMonth);
            console.log('Fees from completed appointments:', completedThisMonth.map(apt => ({
                id: apt._id,
                fee: apt.fee,
                date: apt.date
            })));
            
            // Calculate 80% of fees (doctor's share after 20% platform fee)
            // Use appointment fee if available, otherwise use doctor's consultation fee
            const doctorFee = Number(doctor?.consultationFee) || 0;
            const monthlyEarnings = completedThisMonth.reduce((sum, apt) => {
                const fee = Number(apt.fee) || doctorFee;
                const doctorShare = fee * 0.8; // 80% to doctor
                console.log(`Appointment fee: ${apt.fee}, using: ${fee}, Doctor share (80%): ${doctorShare}`);
                return sum + doctorShare;
            }, 0);
            
            console.log('Total monthly earnings (80% of fees):', monthlyEarnings);

            setStats({
                todayCount: todayApts.length,
                totalPatients: uniquePatients.size,
                pendingPrescriptions: pendingPrescriptions,
                monthlyEarnings: monthlyEarnings,
                completedSessions: completed,
                upcomingCount: upcoming
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString;
    };

    const isAppointmentSoon = (appointment) => {
        if (!appointment) return false;
        const now = new Date();
        const aptDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const diffMinutes = (aptDateTime - now) / (1000 * 60);
        return diffMinutes > 0 && diffMinutes <= 30;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E6F0FF] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        স্বাগতম, ডাঃ {doctor?.name || 'ডাক্তার'}!
                    </h1>
                    <p className="text-lg text-gray-600">আপনার পেশাদার ড্যাশবোর্ড</p>
                </div>

                {/* Appointment Starting Soon Alert */}
                {nextAppointment && isAppointmentSoon(nextAppointment) && (
                    <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaExclamationTriangle className="text-3xl text-orange-600" />
                            <div>
                                <p className="font-semibold text-gray-800">অ্যাপয়েন্টমেন্ট শীঘ্রই শুরু হবে!</p>
                                <p className="text-gray-700">
                                    {nextAppointment.patientName} - {formatTime(nextAppointment.time)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboardDoctor/appointment')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                        >
                            দেখুন <FaArrowRight />
                        </button>
                    </div>
                )}

                {/* Pending Prescriptions Alert */}
                {stats.pendingPrescriptions > 0 && (
                    <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaFilePrescription className="text-3xl text-red-600" />
                            <div>
                                <p className="font-semibold text-gray-800">প্রেসক্রিপশন অপেক্ষমান</p>
                                <p className="text-gray-700">
                                    {stats.pendingPrescriptions}টি সম্পন্ন অ্যাপয়েন্টমেন্টের প্রেসক্রিপশন তৈরি করুন
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboardDoctor/appointment')}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                        >
                            দেখুন <FaArrowRight />
                        </button>
                    </div>
                )}

                {/* Next Appointment Card */}
                {nextAppointment && (
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-2xl p-6 mb-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCalendarAlt className="text-3xl" />
                            <h2 className="text-2xl font-bold">পরবর্তী অ্যাপয়েন্টমেন্ট</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                            <div>
                                <p className="text-sm opacity-90">রোগীর নাম</p>
                                <p className="text-xl font-bold">{nextAppointment.patientName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">তারিখ ও সময়</p>
                                <p className="text-xl font-bold">{formatDate(nextAppointment.date)}</p>
                                <p className="text-lg opacity-90">{formatTime(nextAppointment.time)}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">মাধ্যম</p>
                                <p className="text-lg font-semibold flex items-center gap-2">
                                    {nextAppointment.mode === 'online' ? (
                                        <><FaVideo /> অনলাইন</>
                                    ) : (
                                        <><FaMapMarkerAlt /> অফলাইন</>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboardDoctor/appointment')}
                            className="mt-4 bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition"
                        >
                            বিস্তারিত দেখুন
                        </button>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Today's Appointments */}
                    <div 
                        onClick={() => navigate('/dashboardDoctor/appointment')}
                        className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FaCalendarAlt className="text-4xl text-blue-500" />
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-800">{stats.todayCount}</p>
                                <p className="text-sm text-gray-600">আজকের অ্যাপয়েন্টমেন্ট</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Patients */}
                    <div 
                        onClick={() => navigate('/dashboardDoctor/appointment')}
                        className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FaUserInjured className="text-4xl text-green-500" />
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-800">{stats.totalPatients}</p>
                                <p className="text-sm text-gray-600">মোট রোগী</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Prescriptions */}
                    <div 
                        onClick={() => navigate('/dashboardDoctor/appointment')}
                        className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FaFilePrescription className="text-4xl text-red-500" />
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-800">{stats.pendingPrescriptions}</p>
                                <p className="text-sm text-gray-600">অপেক্ষমান প্রেসক্রিপশন</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Earnings */}
                    <div 
                        onClick={() => navigate('/dashboardDoctor/income')}
                        className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FaMoneyBillWave className="text-4xl text-purple-500" />
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gray-800">৳ {stats.monthlyEarnings}</p>
                                <p className="text-sm text-gray-600">এই মাসের আয়</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaCheckCircle className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats.completedSessions}</p>
                            <p className="text-sm text-gray-600">সম্পন্ন সেশন</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaClock className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats.upcomingCount}</p>
                            <p className="text-sm text-gray-600">আসন্ন অ্যাপয়েন্টমেন্ট</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaUsers className="text-2xl text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{doctor?.specialty || 'N/A'}</p>
                            <p className="text-sm text-gray-600">বিশেষত্ব</p>
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaClock className="text-teal-500" />
                        সাম্প্রতিক অ্যাপয়েন্টমেন্ট
                    </h2>
                    <div className="space-y-3">
                        {appointments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">কোনো অ্যাপয়েন্টমেন্ট নেই</p>
                        ) : (
                            appointments
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0, 5)
                                .map((appointment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                        onClick={() => navigate(`/dashboardDoctor/appointmentDetailsDoctor/${appointment._id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${
                                                appointment.state === 'completed' ? 'bg-green-100' :
                                                appointment.state === 'upcoming' ? 'bg-blue-100' :
                                                'bg-gray-100'
                                            }`}>
                                                <FaUserInjured className={
                                                    appointment.state === 'completed' ? 'text-green-600' :
                                                    appointment.state === 'upcoming' ? 'text-blue-600' :
                                                    'text-gray-600'
                                                } />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {appointment.patientName || 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(appointment.date)} - {formatTime(appointment.time)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            appointment.state === 'completed' ? 'bg-green-100 text-green-700' :
                                            appointment.state === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {appointment.state === 'completed' ? 'সম্পন্ন' : 
                                             appointment.state === 'upcoming' ? 'আসন্ন' : 
                                             appointment.state}
                                        </span>
                                    </div>
                                ))
                        )}
                    </div>
                    {appointments.length > 0 && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/dashboardDoctor/appointment')}
                                className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-2 mx-auto"
                            >
                                সব অ্যাপয়েন্টমেন্ট দেখুন <FaArrowRight />
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/dashboardDoctor/schedule')}
                        className="bg-teal-500 hover:bg-teal-600 text-white py-6 px-6 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                    >
                        <FaCalendarCheck className="text-2xl" />
                        <span>সময়সূচী দেখুন</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboardDoctor/appointment')}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-6 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                    >
                        <FaUsers className="text-2xl" />
                        <span>রোগী তালিকা</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboardDoctor/income')}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-6 px-6 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                    >
                        <FaChartLine className="text-2xl" />
                        <span>আয় দেখুন</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboardDoctor/doctorProfile')}
                        className="bg-green-500 hover:bg-green-600 text-white py-6 px-6 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-3"
                    >
                        <FaUserCog className="text-2xl" />
                        <span>প্রোফাইল সেটিংস</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorHome;
