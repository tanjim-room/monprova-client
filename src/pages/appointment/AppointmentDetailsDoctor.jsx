import React from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import Button from "../../components/Button";
import useAxiosPublic from "../../hooks/useAxiosPublic";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const AppointmentDetailsDoctor = () => {
    const axiosPublic = useAxiosPublic();
    const [appointments] = useAppointment(); // Hook to fetch appointments
    const [doctors] = useDoctor(); // Hook to fetch doctors
    const { appointmentId } = useParams(); // Get appointment ID from URL


    // Safe loading check
    const loading = !Array.isArray(appointments) || !Array.isArray(doctors) || appointments.length === 0 || doctors.length === 0;
    if (loading) return <div>Loading...</div>;

    // Find the specific appointment using appointmentId
    const appointment = appointments.find((a) => a._id === appointmentId);
    if (!appointment) return <div>Appointment not found</div>;
    const gender = appointment?.gender === "male" ? "পুরুষ" : appointment?.gender === "female" ? "নারী" : "অন্যান্য";

    // Find the corresponding doctor for the appointment
    const doctor = doctors.find((d) => d._id === appointment.doctorID);
    if (!doctor) return <div>Doctor not found</div>;

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
            // Send PATCH request to mark the appointment as completed
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
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "❌ ত্রুটি!", // Error message
                text: "অ্যাপয়েন্টমেন্ট সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।", // Try again message
            });
        }
    };

    return (
        <div>
            <div className="min-h-[850px] p-16 bg-[#E1ECFF] rounded-lg mt-16">
                <div className="flex justify-between">
                    <div className="text-left w-full">
                        <h2 className="text-2xl text-gray-800 font-bold">
                            অ্যাপয়েন্টমেন্ট এর তথ্যসমূহ
                        </h2>
                        <div className="mt-4">
                            <p>মাধ্যমঃ {appointment.mode}</p>
                            <p>তারিখঃ {appointment.date}</p>
                            <p>সময়ঃ {appointment.slot}</p>
                            <p>ফিঃ {doctor.consultationFee} টাকা</p>
                            <p>স্ট্যাটাসঃ <span className="font-semibold">{appointment.state || "Pending"}</span></p>
                        </div>

                        <div className="mt-4 text-left">
                            <h2 className="text-2xl text-gray-800 mb-4 font-bold">
                                রোগীর তথ্যসমূহ
                            </h2>
                            <p>রোগীর নামঃ {appointment.patientName}</p>
                            <p>মোবাইলঃ {appointment.phone}</p>
                            <p>ইমেইলঃ {appointment.patientEmail}</p>
                            <p>বয়সঃ {appointment.age} বছর</p>
                            <p>জেন্ডারঃ {gender}</p>
                            <p>ব্লাড গ্রুপঃ {appointment.bloodGroup}</p>
                            <p>পেশাঃ {appointment.profession}</p>
                            <p>সমস্যা/রোগের বিবরণঃ {appointment.problem}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-8 mt-8">
                    <div className="w-full">
                        <Link to={`/dashboardDoctor/createPrescription/${appointment._id}`}>
                            <Button btnName="প্রেস্ক্রিপশন লিখুন" bgColor="bg-primary-color" />
                        </Link>
                    </div>

                    <div className="w-full" onClick={appointment.state !== "completed" ? handleFinishAppointment : null}>
                        <Button
                            btnName={appointment?.state === "completed" ? "অ্যাপয়েন্টমেন্ট সম্পন্ন" : "শেষ করুন"}
                            bgColor="bg-secondary-color"
                            disabled={appointment.state === "completed"}
                        />
                    </div>

                </div>
                <div className="mt-8">
                    <Link to={`/dashboardDoctor/prescriptionDetails/${appointmentId}`}>
                        <Button btnName="প্রেস্ক্রিপশন দেখুন" bgColor="bg-primary-color" className="w-full" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsDoctor;
