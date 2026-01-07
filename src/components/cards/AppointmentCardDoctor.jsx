import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Button from '../Button';
import axios from 'axios';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const MySwal = withReactContent(Swal);

const AppointmentCardDoctor = ({ appointment }) => {
    const link = appointment?.sessionLink;
    const [sessionLink, setSessionLink] = useState(link);
    
    // 🧾 Save session link
    const axiosPublic = useAxiosPublic();

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

        // Log the link received from SweetAlert
        console.log("Received session link from SweetAlert:", link);

        if (link) {
            setSessionLink(link);  // Save link to state

            try {
                // Send PATCH request to update the session link in the backend
                const response = await axiosPublic.patch(`/api/sessionlink/${appointment._id}`, { sessionLink: link });

                // Log API response
                console.log("API response:", response);

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

    // Log appointment details for debugging
    console.log("Appointment details:", appointment);

    return (
        <div className="card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
            <div className="card-body">
                <div className="flex gap-8 items-center">
                    <div>
                        <h2 className="card-title text-xl">রোগীর নামঃ {appointment?.patientName}</h2>
                    </div>
                </div>
                <div className="text-start text-lg mt-4">
                    <p>মাধ্যমঃ<span className='bg-secondary-color text-white px-2 py-1 rounded-md text-sm ml-2'>{appointment.mode === 'online' ? "অনলাইন" : appointment.mode === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</span></p>
                    <p>তারিখঃ {appointment.date}</p>
                    <p>সময়ঃ {appointment.slot}</p>

                    <div className="mt-4 flex justify-between gap-8 items-center">
                        {/* ✅ Start Session Button */}
                        <div className="w-full">
                            {appointment?.mode === 'online' && (
                                <div onClick={handleStartSession}>
                                    <Button btnName={"সেশন শুরু করুন"} bgColor={"bg-secondary-color"} />
                                </div>
                            )}
                        </div>

                        {/* ✅ Set Session Link */}
                        <div className="w-full">
                            {appointment?.mode === 'online' && (
                                <div onClick={handleSetSessionLink}>
                                    <Button btnName={"সেশন লিঙ্ক দিন"} bgColor={"bg-primary-color"}></Button>
                                </div>
                            )}
                        </div>

                        {/* ✅ Details Button */}
                        <div className="w-full">
                            <Link to={`/dashboardDoctor/appointmentDetailsDoctor/${appointment?._id}`}>
                                <Button btnName={"বিস্তারিত দেখুন"} bgColor={"bg-primary-color"}></Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCardDoctor;
