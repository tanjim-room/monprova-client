import React, { useState } from 'react';
import useAppointment from '../../hooks/useAppointment';
import useAuth from '../../hooks/useAuth';
import AppointmentCard from '../../components/cards/AppointmentCard';
import SectionHeader from '../shared/SectionHeader';

const AppointmentPatient = () => {

    const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"
    const [appointments] = useAppointment();
    console.log(appointments.length)
    const {user} = useAuth();
    console.log(user)
    const appointment = appointments?.filter(appointment => appointment.patientEmail === user?.email && appointment.paymentStatus === "paid");
    console.log(appointment)

    // Filter based on status instead of date
    const upcomingAppointment = appointment?.filter(appointment => appointment.state === "upcoming");
    const completedAppointment = appointment?.filter(appointment => appointment.state === "completed");

    const renderAppointments = () => {
        const appointmentList = activeTab === "upcoming" ? upcomingAppointment : completedAppointment;
        if (appointmentList.length === 0) {
            return <p className="text-gray-500">কোনো অ্যাপয়েন্টমেন্ট নেই</p>;
        }
        return appointmentList.map((appointment, idx) => (
            <AppointmentCard key={idx} appointment={appointment}></AppointmentCard>
        ));
    };
    return (
        <div>

            <div className="min-h-[850px] p-4  rounded-lg mt-0">
                {/* Tabs */}
                <div className='mb-6'>
                    <SectionHeader heading={"আপনার অ্যাপয়েন্টমেন্টসমুহ"} subHeading={"আপনার অ্যাপয়েন্টমেন্ট গুলো এখানে দেখুন"}></SectionHeader>
                </div>
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "upcoming"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"
                            }`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        আপকামিং
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "completed"
                            ? "bg-secondary-color text-white"
                            : "bg-white text-secondary-color border border-secondary-color"
                            }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        সম্পন্ন
                    </button>
                </div>

                {/* Appointment List */}
                <div className="space-y-4">{renderAppointments()}</div>
            </div>
        </div>
    );
};

export default AppointmentPatient;