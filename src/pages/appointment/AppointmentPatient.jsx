import React, { useState } from 'react';
import useAppointment from '../../hooks/useAppointment';
import useAuth from '../../hooks/useAuth';
import AppointmentCard from '../../components/cards/AppointmentCard';

const AppointmentPatient = () => {

    const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"
    const [appointments] = useAppointment();
    console.log(appointments.length)
    const {user} = useAuth();
    console.log(user)
    const appointment = appointments?.filter(appointment => appointment.patientEmail === user?.email);
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

            <div className="min-h-[850px] p-16 bg-[#E1ECFF] rounded-lg mt-16">
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "upcoming"
                            ? "bg-[#1998df] text-white"
                            : "bg-white text-[#1998df] border border-[#1998df]"
                            }`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        আসছে
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${activeTab === "completed"
                            ? "bg-[#76a4f1] text-white"
                            : "bg-white text-[#76a4f1] border border-[#76a4f1]"
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