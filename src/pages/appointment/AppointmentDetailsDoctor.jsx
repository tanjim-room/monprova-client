import React from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import Button from "../../components/Button";
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
        <div className="p-4 bg-white rounded-xl mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="bg-green-100 p-6 mb-8 card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">রোগীর তথ্যসমূহ</h2>
                    <div className="space-y-4">
                        <p><span className="font-bold">রোগীর নামঃ</span> {appointment.patientName}</p>
                        <p><span className="font-bold">মোবাইলঃ</span> {appointment.phone}</p>
                        <p><span className="font-bold">ইমেইলঃ</span> {appointment.patientEmail}</p>
                        <p><span className="font-bold">বয়সঃ</span> {appointment.age} বছর</p>
                        <p><span className="font-bold">জেন্ডারঃ</span> {gender}</p>
                        <p><span className="font-bold">ব্লাড গ্রুপঃ</span> {appointment.bloodGroup}</p>
                        <p><span className="font-bold">পেশাঃ</span> {appointment.profession}</p>
                        <p><span className="font-bold">সমস্যা/রোগের বিবরণঃ</span> </p>
                        <p>{appointment.problem}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 mt-8">
                <div className="w-full">
                    <Link to={`/dashboardDoctor/createPrescription/${appointment._id}`}>
                        <Button btnName="প্রেস্ক্রিপশন লিখুন" bgColor="bg-primary-color" />
                    </Link>
                </div>

                <div className="w-full" >


                    <button
                        onClick={handleFinishAppointment}
                        className={`w-full rounded-md bg-secondary-color text-white py-3 transition ${appointment.state === "completed" ? "opacity-25 text-black cursor-not-allowed bg-gray-500 " : ""
                            }`}
                        disabled={appointment.state === "completed"}
                    >
                        {appointment.state === "completed" ? "অ্যাপয়েন্টমেন্ট সম্পন্ন" : "শেষ করুন"}
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <Link to={`/dashboardDoctor/prescriptionDetails/${appointmentId}`}>
                    <Button btnName="প্রেস্ক্রিপশন দেখুন" bgColor="bg-primary-color" className="w-full" />
                </Link>
            </div>
        </div>
    );
};

export default AppointmentDetailsDoctor;
