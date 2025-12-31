import React from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import useDoctor from '../../hooks/useDoctor';
import Button from '../Button';

const AppointmentCard = ({ appointment }) => {
    const [doctors] = useDoctor();
    const doctor = doctors?.find(doctor => doctor?._id === appointment?.doctorID);
    return (
        <div className=''>
            <div className="card card-side bg-base-100 shadow-sm gap-12">
                <div className="card-body">
                    <div className='flex gap-8 items-center'>
                        <div>
                            <img src={"https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"} alt="" className='w-24 h-24 object-cover rounded-full' />
                        </div>
                        <div>
                            <h2 className="card-title text-xl ">ডাক্তারঃ {doctor?.name}</h2>
                            <p className='text-xl text-left text-gray-800'>{"speciality"}</p>
                        </div>
                    </div>
                    <div className='text-start text-lg mt-4'>
                        <p className=''>মাধ্যমঃ {appointment?.mode}</p>
                        <p>তারিখঃ {"date"}</p>
                        <p>সময়ঃ {"slot"}</p>
                        <div className='mt-4 flex justify-between gap-8'>
                            <div className=' w-full'>
                                {
                                    appointment?.mode == 'online' && 
                                    <Button btnName={"ভিডিও সেশন এ জয়েন করুন"} bgColor={"bg-primary-color"}></Button>
                                }
                            </div>
                            <div className='w-full'>
                                <Link to={`/dashboardPatient/appointmentDetailsPatient/${appointment?._id}`}>
                                    <Button btnName={"বিস্তারিত দেখুন"} bgColor={"bg-primary-color"}></Button>
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

{/* <Button text="ভিডিও সেশন এ জয়েন করুন"></Button> */}
{/* <Button text="বিস্তারিত দেখুন"></Button> */}