import React from 'react';
import { Link } from 'react-router-dom';
import useDoctor from '../../hooks/useDoctor';
import Button from '../Button';
import Swal from 'sweetalert2'; // Ensure you import Swal properly

const AppointmentCard = ({ appointment }) => {
    const [doctors] = useDoctor();
    const doctor = doctors?.find(doctor => doctor?._id === appointment?.doctorID);
    
    const handleJoinSession = async () => {
        console.log("Appointment data:", appointment); // Log to check if appointment has sessionLink
        
        // Check if session link is provided
        if (!appointment?.sessionLink) {
            console.log("Session link is missing"); // Log to see if the sessionLink is missing
            // If no session link, show a SweetAlert prompt asking the user to provide a link
            await Swal.fire({
                icon: 'warning',
                title: '⚠️ সেশন লিঙ্ক প্রয়োজন!',
                text: 'ডাক্তার এখনো কোনো সেশন লিঙ্ক দেন নাই।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#16a34a',
            });
            return;
        }

        // If session link is available, start the session by redirecting to the session link
        console.log("Opening session link:", appointment.sessionLink); // Log the session link before opening
        window.open(appointment.sessionLink, '_blank');
    };

    return (
        <div>
            <div className="card card-side bg-base-100 shadow-sm gap-12">
                <div className="card-body">
                    <div className="flex gap-8 items-center">
                        <div>
                            <img src={doctor?.image || ""} alt="" className="w-24 h-24 object-cover rounded-full" />
                        </div>
                        <div>
                            <h2 className="card-title text-xl">ডাক্তারঃ {doctor?.name}</h2>
                            <p className="text-xl text-left text-gray-800">{"speciality"}</p>
                        </div>
                    </div>
                    <div className="text-start text-lg mt-4">
                        <p className="">মাধ্যমঃ {appointment?.mode}</p>
                        <p>তারিখঃ {"date"}</p>
                        <p>সময়ঃ {"slot"}</p>
                        <div className="mt-4 flex justify-between gap-8">
                            <div className="w-full">
                                {
                                    appointment?.mode === 'online' &&
                                    <div onClick={handleJoinSession}>
                                        <Button btnName={"ভিডিও সেশন এ জয়েন করুন"} bgColor={"bg-primary-color"} />
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <Link to={`/dashboardPatient/appointmentDetailsPatient/${appointment?._id}`}>
                                    <Button btnName={"বিস্তারিত দেখুন"} bgColor={"bg-primary-color"} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
