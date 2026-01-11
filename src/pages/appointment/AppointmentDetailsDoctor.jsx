import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaSpinner } from "react-icons/fa"; // Spinner for loading state

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const AppointmentDetailsDoctor = () => {
    const axiosPublic = useAxiosPublic();
    const [appointments] = useAppointment(); // Hook to fetch appointments
    const [doctors] = useDoctor(); // Hook to fetch doctors
    const { appointmentId } = useParams(); // Get appointment ID from URL
    
    // 🧾 Safe loading check
    const loading = !Array.isArray(appointments) || !Array.isArray(doctors) || appointments.length === 0 || doctors.length === 0;
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
    );

    // Find the specific appointment using appointmentId
    const appointment = appointments.find((a) => a._id === appointmentId);
    const link = appointment?.sessionLink;
    const [sessionLink, setSessionLink] = useState(link);

    if (!appointment) return <div className="text-center text-red-600">Appointment not found</div>;

    const gender = appointment?.gender === "male" ? "পুরুষ" : appointment?.gender === "female" ? "নারী" : "অন্যান্য";

    // Find the corresponding doctor for the appointment
    const doctor = doctors.find((d) => d._id === appointment.doctorID);
    if (!doctor) return <div className="text-center text-red-600">Doctor not found</div>;

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
            title: "আপনি কি নিশ্চিত?", // Bengali message: "Are you sure?"
            text: "এই অ্যাপয়েন্টমেন্টটি সম্পন্ন হিসেবে চিহ্নিত হবে।", // Appointment completion warning message
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "হ্যাঁ, সম্পন্ন করুন", // "Yes, complete"
            cancelButtonText: "বাতিল", // "Cancel"
            confirmButtonColor: "#16a34a", // Green color
            cancelButtonColor: "#6b7280", // Gray color
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axiosPublic.patch(`/api/appointments/${appointmentId}`);

            // Show success message
            await MySwal.fire({
                icon: "success",
                title: "✅ সম্পন্ন!", // Appointment completed successfully
                text: "অ্যাপয়েন্টমেন্ট সফলভাবে সম্পন্ন হিসেবে সংরক্ষণ করা হয়েছে।", // Appointment saved as completed
                confirmButtonText: "ঠিক আছে", // "Okay"
                confirmButtonColor: "#16a34a", // Green color
            });

            // Reload the page to reflect changes
            window.location.reload();
        } catch (err) {
            console.error("Error in finishing appointment:", err);  // More specific error logging
            MySwal.fire({
                icon: "error",
                title: "❌ ত্রুটি!", // Error message
                text: "অ্যাপয়েন্টমেন্ট সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।", // Try again message
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <BackButton destination="/dashboardDoctor/appointment" />
                <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Appointment Information */}
                        <div className="bg-blue-100 p-6 mb-8 card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">অ্যাপয়েন্টমেন্ট এর তথ্যসমূহ</h2>
                            <div className="space-y-4">
                                <p><span className="font-bold">মাধ্যমঃ</span> {appointment.mode || "Not available"}</p>
                                <p><span className="font-bold">তারিখঃ</span> {appointment.date || "Not available"}</p>
                                <p><span className="font-bold">সময়ঃ</span> {appointment.slot || "Not available"}</p>
                                <p><span className="font-bold">ফিঃ</span> {doctor.consultationFee} টাকা</p>
                                <p><span className="font-bold">স্ট্যাটাসঃ</span> <span className={`font-semibold ${appointment.state === "completed" ? "text-green-600" : "text-yellow-600"}`}>{appointment.state || "Pending"}</span></p>
                            </div>
                        </div>

                        {/* Patient Information */}
                        <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-1 h-6 bg-green-500 mr-3 rounded"></span>
                                রোগীর তথ্যসমূহ
                            </h2>
                            <div className="space-y-2.5">
                                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                    <span className="font-semibold text-gray-700">রোগীর নামঃ</span>
                                    <span className="ml-2 text-gray-600">{appointment?.patientName || 'নাম নেই'}</span>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                    <span className="font-semibold text-gray-700">মোবাইলঃ</span>
                                    <span className="ml-2 text-gray-600">{appointment?.phone || 'ফোন নেই'}</span>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                    <span className="font-semibold text-gray-700">ইমেইলঃ</span>
                                    <span className="ml-2 text-gray-600">{appointment?.patientEmail || 'ইমেইল নেই'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                        <span className="font-semibold text-gray-700 block text-sm">বয়স</span>
                                        <span className="text-gray-600">{appointment?.age || 0} বছর</span>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                        <span className="font-semibold text-gray-700 block text-sm">জেন্ডার</span>
                                        <span className="text-gray-600">{gender}</span>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                        <span className="font-semibold text-gray-700 block text-sm">ব্লাড</span>
                                        <span className="text-gray-600">{appointment?.bloodGroup || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                    <span className="font-semibold text-gray-700">পেশাঃ</span>
                                    <span className="ml-2 text-gray-600">{appointment?.profession || 'পেশা নেই'}</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                    <span className="font-semibold text-gray-700 block mb-2">সমস্যা/রোগের বিবরণঃ</span>
                                    <p className="text-gray-600 leading-relaxed">{appointment?.problem || 'বিবরণ নেই'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mt-8">
                    <div className="w-full">
                        {appointment?.mode === 'online' && (
                            <div onClick={handleStartSession}>
                                <Button btnName={"সেশন শুরু করুন"} bgColor={"bg-secondary-color"} />
                            </div>
                        )}
                    </div>
                    <div className="w-full">
                        {appointment?.mode === 'online' && (
                            <div onClick={handleSetSessionLink}>
                                <Button btnName={"সেশন লিঙ্ক দিন"} bgColor={"bg-primary-color"}></Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full" >
                    <button
                        onClick={handleFinishAppointment}
                        className={`w-full rounded-md bg-secondary-color text-white py-3 transition ${appointment.state === "completed" ? "opacity-25 text-black cursor-not-allowed bg-gray-500 " : ""}`}
                        disabled={appointment.state === "completed"}
                    >
                        {appointment.state === "completed" ? "অ্যাপয়েন্টমেন্ট সম্পন্ন" : "শেষ করুন"}
                    </button>
                </div>

                <div className="flex gap-6 mt-8">
                    <div className="w-full">
                        <Link to={`/dashboardDoctor/createPrescription/${appointment._id}`}>
                            <Button btnName="প্রেস্ক্রিপশন লিখুন" bgColor="bg-tertiary-color" />
                        </Link>
                    </div>

                    <div className="w-full">
                        <Link to={`/dashboardDoctor/prescriptionDetails/${appointmentId}`}>
                            <Button btnName="প্রেস্ক্রিপশন দেখুন" bgColor="bg-primary-color" className="w-full" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsDoctor;