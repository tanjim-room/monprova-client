import React from "react";
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

    // Safe loading check
    const loading = !Array.isArray(appointments) || !Array.isArray(doctors) || appointments.length === 0 || doctors.length === 0;
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
    );

    // Find the specific appointment using appointmentId
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (!appointment) return <div className="text-center text-red-600">Appointment not found</div>;

    const gender = appointment?.gender === "male" ? "পুরুষ" : appointment?.gender === "female" ? "নারী" : "অন্যান্য";

    // Find the corresponding doctor for the appointment
    const doctor = doctors.find((d) => d._id === appointment.doctorID);
    if (!doctor) return <div className="text-center text-red-600">Doctor not found</div>;

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
            console.log("Finishing appointment with ID:", appointmentId);  // Log the appointmentId
            const response = await axiosPublic.patch(`/api/appointments/${appointmentId}`);

            console.log("API Response:", response); // Log the API response

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Link to={`/dashboardDoctor/createPrescription/${appointment?._id}`}>
                    <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-all duration-200">
                        প্রেস্ক্রিপশন লিখুন
                    </button>
                </Link>

                <button
                    onClick={handleFinishAppointment}
                    className={`w-full rounded-lg font-semibold py-3 px-4 shadow-md transition-all duration-200 ${
                        appointment?.state === "completed"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    disabled={appointment?.state === "completed"}
                >
                    {appointment?.state === "completed" ? "অ্যাপয়েন্টমেন্ট সম্পন্ন" : "শেষ করুন"}
                </button>
            </div>

            <Link to={`/dashboardDoctor/prescriptionDetails/${appointmentId}`}>
                <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:bg-purple-600 transition-all duration-200">
                    প্রেস্ক্রিপশন দেখুন
                </button>
            </Link>
            </div>
        </div>
    );
};

export default AppointmentDetailsDoctor;
