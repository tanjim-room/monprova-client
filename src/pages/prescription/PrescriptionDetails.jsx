import React from 'react';
import useDoctor from '../../hooks/useDoctor';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import usePrescription from '../../hooks/usePrescription';
import useAppointment from '../../hooks/useAppointment';

const PrescriptionDetails = () => {
  const { appointmentId } = useParams()
  const [doctors] = useDoctor();
  const { user } = useAuth();
  const [appointments] = useAppointment();
  const [prescriptions] = usePrescription();
  const prescription = prescriptions?.find(prescription => prescription.appointmentID === appointmentId)
  const appointment = appointments?.find(appointment => appointment._id === appointmentId)
  // Default to empty object if undefined
  const doctor = doctors?.find(doctor => doctor.email === user?.email) || {};
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b-2 pb-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold">{doctor?.name}</h1>
          <p className="text-lg">{doctor?.degrees}</p>
          <p className="text-lg">{doctor?.institute}</p>
          <p className="text-lg">BMDC NO: {doctor?.regNo}</p>
        </div>
        <div className="text-center">

        </div>
      </div>

      {/* Details Section */}
      <div className="flex space-x-10">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          <p><strong>Date:</strong> {new Date(prescription?.updatedAt || prescription?.createdAt).toLocaleString('default', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          }</p>
          <p><strong>Name:</strong> {appointment?.patientName}</p>
          <p><strong>Age:</strong> {appointment?.age}</p>
          <p><strong>Gender:</strong> {appointment?.gender}</p>
          <p><strong>Advice:</strong> {prescription?.advice}</p>
        </div>

        {/* Right Section (Prescription textarea) */}
        <div className="flex-1 space-y-4 ">
          <h3 className="text-4xl font-bold">Rx</h3>
          <div
            className="w-full p-4 border-2 border-gray-300 rounded-md pb-8 bg-white"
          >
            <p className='mb-8'>{prescription?.diagnosis}</p>

            {
              prescription?.medicines?.map((medicine, idx) => <div className='flex justify-evenly items-center'>
                <p>{idx + 1}. {medicine.name}</p>
                <p>{medicine.dose}</p>
                <p>{medicine.duration} days</p>
              </div>)
            }
          </div>
        </div>
      </div>

      {/* Footer Section */}

    </div>
  );
};

export default PrescriptionDetails;
