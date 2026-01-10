import React, { useState } from 'react';
import useAppointment from '../../hooks/useAppointment';
import useAuth from '../../hooks/useAuth';
import AppointmentCardDoctor from '../../components/cards/AppointmentCardDoctor';
import useDoctor from '../../hooks/useDoctor';
import SectionHeader from '../shared/SectionHeader';

const AppointmentDoctor = () => {
    const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming", "completed", "upcomingOnline", "upcomingOffline", "completedOnline", "completedOffline"
    const [appointments] = useAppointment();
    const { user } = useAuth();
    const [doctors] = useDoctor();
    const doctor = doctors?.find(doctor => doctor.email === user?.email)
    const appointment = appointments?.filter(appointment => appointment.doctorID === doctor?._id && appointment.paymentStatus === "paid");
    console.log(appointment)
    // Filter based on status and mode
    const upcomingAppointment = appointment?.filter(appointment => appointment.state === "upcoming");
    const upcomingOnlineAppointment = upcomingAppointment?.filter(appointment => appointment.mode === "online");
    const upcomingOfflineAppointment = upcomingAppointment?.filter(appointment => appointment.mode === "offline");
    const completedAppointment = appointment?.filter(appointment => appointment.state === "completed");
    const completedOnlineAppointment = completedAppointment?.filter(appointment => appointment.mode === "online");
    const completedOfflineAppointment = completedAppointment?.filter(appointment => appointment.mode === "offline");

    const renderAppointments = () => {
        let appointmentList = [];
        
        if (activeTab === "upcoming") {
            appointmentList = upcomingAppointment;
        } else if (activeTab === "completed") {
            appointmentList = completedAppointment;
        } else if (activeTab === "upcomingOnline") {
            appointmentList = upcomingOnlineAppointment;
        } else if (activeTab === "upcomingOffline") {
            appointmentList = upcomingOfflineAppointment;
        } else if (activeTab === "completedOnline") {
            appointmentList = completedOnlineAppointment;
        } else if (activeTab === "completedOffline") {
            appointmentList = completedOfflineAppointment;
        }

        if (appointmentList.length === 0) {
            return <p className="text-gray-500">কোনো অ্যাপয়েন্টমেন্ট নেই</p>;
        }
        console.log(appointmentList)
        return appointmentList.map((appointment, idx) => (
            <AppointmentCardDoctor key={idx} appointment={appointment}></AppointmentCardDoctor>
        ));
    };

    return (
        <div>
            <div className="min-h-[850px] p-0  rounded-lg mt-0">
                <div className='pb-8'>
                <SectionHeader heading={"আপনার অ্যাপয়েন্টমেন্টসমুহ"} subHeading={"আপনার অ্যাপয়েন্টমেন্ট গুলো এখানে দেখুন"}></SectionHeader>
            </div>
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {/* Upcoming Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "upcoming"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("upcoming")}
                    >
                        আপকামিং
                    </button>

                    

                    {/* Upcoming Online Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "upcomingOnline"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("upcomingOnline")}
                    >
                        আপকামিং (অনলাইন)
                    </button>

                    {/* Upcoming Offline Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "upcomingOffline"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("upcomingOffline")}
                    >
                        আপকামিং (অফলাইন)
                    </button>

                    {/* Completed Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "completed"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("completed")}
                    >
                        সম্পন্ন
                    </button>

                    {/* Completed Online Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "completedOnline"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("completedOnline")}
                    >
                        সম্পন্ন (অনলাইন)
                    </button>

                    {/* Completed Offline Button */}
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "completedOffline"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"}`
                        }
                        onClick={() => setActiveTab("completedOffline")}
                    >
                        সম্পন্ন (অফলাইন)
                    </button>
                </div>

                {/* Appointment List */}
                <div className="space-y-4">{renderAppointments()}</div>
            </div>
        </div>
    );
};

export default AppointmentDoctor;
