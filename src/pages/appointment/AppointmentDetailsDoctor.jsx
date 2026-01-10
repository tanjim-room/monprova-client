import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaSpinner } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const AppointmentDetailsDoctor = () => {
    const axiosPublic = useAxiosPublic();
    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const { appointmentId } = useParams();

    const loading =
        !Array.isArray(appointments) ||
        !Array.isArray(doctors) ||
        appointments.length === 0 ||
        doctors.length === 0;

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
        );

    const appointment = appointments.find((a) => a._id === appointmentId);
    const link = appointment?.sessionLink;
    const [sessionLink, setSessionLink] = useState(link);

    if (!appointment) return <div className="text-center text-red-600">Appointment not found</div>;

    const gender = appointment?.gender === "male" ? "পুরুষ" : appointment?.gender === "female" ? "নারী" : "অন্যান্য";

    const doctor = doctors.find((d) => d._id === appointment.doctorID);
    if (!doctor)
        return <div className="text-center text-red-600">Doctor not found</div>;

    const gender =
        appointment?.gender === "male"
            ? "পুরুষ"
            : appointment?.gender === "female"
            ? "নারী"
            : "অন্যান্য";

    const handleStartSession = async () => {
        // Check if session link is provided
        if (!sessionLink) {
            // If no session link, show a SweetAlert prompt asking the user to provide a link
            await MySwal.fire({
                icon: 'warning',
                title: '⚠️ সেশন লিঙ্ক প্রয়োজন!',
                text: 'দয়া করে সেশন লিঙ্ক দিন যেন আপনি সেশন শুরু করতে পারেন।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#16a34a',
            });
            return;
        }

        // If session link is available, start the session by redirecting to the session link
        window.open(sessionLink, '_blank');
    };

    const handleSetSessionLink = async () => {
        // If sessionLink is not provided, show SweetAlert to ask for a link
        const { value: link } = await MySwal.fire({
            title: '🔗 সেশন লিঙ্ক দিন',
            subTitle: "Google Meet Link দিন",
            input: 'url',
            inputPlaceholder: 'যেমনঃ https://meet.google.com/abc-defg-hij',
            inputValue: sessionLink || "",
            showCancelButton: true,
            cancelButtonText: 'বাতিল',
            confirmButtonText: 'সংরক্ষণ করুন',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                if (!value) {
                    return '⚠️ দয়া করে একটি লিঙ্ক দিন!';
                }
            },
        });

        if (link) {
            setSessionLink(link);  // Save link to state

            try {
                // Send PATCH request to update the session link in the backend
                const response = await axiosPublic.patch(`/api/sessionlink/${appointment._id}`, { sessionLink: link });

                await MySwal.fire({
                    icon: 'success',
                    title: '✅ লিঙ্ক সংরক্ষণ হয়েছে!',
                    text: 'সেশন লিঙ্ক সফলভাবে সংরক্ষণ করা হয়েছে।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#16a34a',
                });
            } catch (error) {
                console.error('Error updating session link:', error);
                MySwal.fire({
                    icon: 'error',
                    title: '❌ ত্রুটি!',
                    text: 'সেশন লিঙ্ক সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।',
                });
            }
        }
    };

    // Handle finishing the appointment
    const handleFinishAppointment = async (event) => {
        event.preventDefault();
        const result = await MySwal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই অ্যাপয়েন্টমেন্টটি সম্পন্ন হিসেবে চিহ্নিত হবে।",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "হ্যাঁ, সম্পন্ন করুন",
            cancelButtonText: "বাতিল",
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axiosPublic.patch(`/api/appointments/${appointmentId}`);

            // Show success message
            await MySwal.fire({
                icon: "success",
                title: "✅ সম্পন্ন!",
                text: "অ্যাপয়েন্টমেন্ট সফলভাবে সংরক্ষিত হয়েছে।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#16a34a",
            });
            window.location.reload();
        } catch (err) {
            console.error("Error in finishing appointment:", err);
            MySwal.fire({
                icon: "error",
                title: "❌ ত্রুটি!",
                text: "অ্যাপয়েন্টমেন্ট সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl mt-0 max-w-6xl mx-auto space-y-8">
            {/* Appointment & Patient Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        অ্যাপয়েন্টমেন্ট এর তথ্যসমূহ
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p>
                            <span className="font-bold">মাধ্যমঃ</span> {appointment.mode || "Not available"}
                        </p>
                        <p>
                            <span className="font-bold">তারিখঃ</span> {appointment.date || "Not available"}
                        </p>
                        <p>
                            <span className="font-bold">সময়ঃ</span> {appointment.slot || "Not available"}
                        </p>
                        <p>
                            <span className="font-bold">ফিঃ</span> {doctor.consultationFee} টাকা
                        </p>
                        <p>
                            <span className="font-bold">স্ট্যাটাসঃ</span>{" "}
                            <span className={`font-semibold ${
                                appointment.state === "completed" ? "text-green-600" : "text-yellow-600"
                            }`}>
                                {appointment.state || "Pending"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-green-100 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">রোগীর তথ্যসমূহ</h2>
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-bold">রোগীর নামঃ</span> {appointment.patientName}</p>
                        <p><span className="font-bold">মোবাইলঃ</span> {appointment.phone}</p>
                        <p><span className="font-bold">ইমেইলঃ</span> {appointment.patientEmail}</p>
                        <p><span className="font-bold">বয়সঃ</span> {appointment.age} বছর</p>
                        <p><span className="font-bold">জেন্ডারঃ</span> {gender}</p>
                        <p><span className="font-bold">ব্লাড গ্রুপঃ</span> {appointment.bloodGroup}</p>
                        <p><span className="font-bold">পেশাঃ</span> {appointment.profession}</p>
                        <p><span className="font-bold">সমস্যা/রোগের বিবরণঃ</span> {appointment.problem}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
                {/* 1. Prescription লিখুন */}
                <Link to={`/dashboardDoctor/createPrescription/${appointment._id}`} className="flex-1">
                    <Button btnName="প্রেস্ক্রিপশন লিখুন" bgColor="bg-primary-color" />
                </Link>

                {/* 2. Finish Appointment */}
                <button
                    onClick={handleFinishAppointment}
                    className={`flex-1 w-full rounded-md bg-secondary-color text-white py-3 transition ${
                        appointment.state === "completed" ? "opacity-25 text-black cursor-not-allowed bg-gray-500" : ""
                    }`}
                    disabled={appointment.state === "completed"}
                >
                    {appointment.state === "completed" ? "অ্যাপয়েন্টমেন্ট সম্পন্ন" : "শেষ করুন"}
                </button>
            </div>

            {/* Prescription View Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. আগের Prescription দেখুন (patient uploaded) */}
                <Link to={`/dashboardDoctor/prescriptionDetails/${appointment._id}`} className="flex-1">
                    <button className="w-full bg-cyan-500 text-white py-3 rounded-md hover:bg-cyan-600 transition">
                        পূর্বের প্রেস্ক্রিপশন দেখুন
                    </button>
                </Link>

                {/* 2. Prescription দেখুন (general) */}
                <Link to={`/dashboardDoctor/prescriptionDetails/${appointment._id}`} className="flex-1">
                   <button className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition">
    বর্তমান প্রেস্ক্রিপশন দেখুন
</button>

                </Link>
            </div>
        </div>
    );
};

export default AppointmentDetailsDoctor;
