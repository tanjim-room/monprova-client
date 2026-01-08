import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import useDoctor from '../../hooks/useDoctor';

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors] = useDoctor();

  // Loading state
  if (loading) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Loading doctor details...
      </p>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        {error}
      </p>
    );
  }

  // Find doctor by ID
  const doctor = doctors.find(doctor => doctor._id === doctorId);

  if (!doctor) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Doctor not found.
      </p>
    );
  }

  // Destructure safely with defaults
  const { _id, name, designation, expertise, consultationFee, image, yearsOfExperience, degrees, regNo, institute, medium, shortBio } = doctor;

  return (
    <div className="p-0">
      <div className="min-h-[850px] p-0 bg-white rounded-md">
        <div className="w-full text-left border p-4 rounded-md">

          {/* Back Button */}
          <div className='px-6'>
            <BackButton destination="/dashboardPatient/doctors"></BackButton>
          </div>

          {/* Doctor Name */}

          {/* Doctor Info Card */}
          <div className="flex flex-col md:flex-row items-center justify-center border rounded-md p-4 mx-6 gap-6">
            <div className=''>
              <img src={image || "https://i.ibb.co.com/ym2wsZXY/avater-Grey-User-Circles-Set.png"} alt={name} className="w-48 h-48 object-cover rounded-full border mb-6 md:mb-0" />
            </div>
            <div className="space-y-1 md:text-left text-center">
              <h2 className="font-semibold text-xl">{name}</h2>
              <p className="text-lg font-semibold text-gray-700">{designation}</p>

              <div className="mt-0 text-center md:text-left">
                <p className="primary-color">{degrees}</p>
              </div>

              <div className="mt-2">
                <p className="text-base text-gray-700 font-semibold">
                  BMDC Reg. No: <span className="bg-secondary-color px-2 py-1 text-white rounded-md text-sm font-semibold">{regNo}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex gap-6 mt-6 mx-6 space-y- mb-8">

            <div className='w-1/2'>
              {/* Workplace */}
              <div className="text-start mb-4">
                <p className="text-xl font-bold primary-color py-1">কর্মক্ষেত্র</p>
                <div className="rounded-md px-0 py-2">
                  <span className='py-2'>{designation}</span>
                  <p className="font-semibold py-2">{institute}</p>
                </div>
              </div>

              {/* Specialities */}
              <div className="text-start mb-4">
                <p className="text-xl font-bold primary-color py-1">দক্ষতাসমূহ</p>
                <div className="rounded-md px-0 py-2">
                  <p className="py-2">{expertise}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">অভিজ্ঞতা</p>
                <div className="rounded-md px-0 py-2">
                  <span className="font-semibold py-2">{yearsOfExperience} বছর</span>
                </div>
              </div>
            </div>

            <div className='w-1/2 border-l-2 pl-4'>
              {/* Bio */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">সংক্ষিপ্ত পরিচয়</p>
                <div className=" px-0 p-2 ">
                  <p className="font-normal text-justify leading-loose py-2">{shortBio}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-row-reverse justify-center gap-4 p-4 border rounded-md mx-6'>
            {/* Consultation Type */}
            <div className="text-start flex gap-4">
              <p className="text-xl font-bold primary-color py-1">রোগী দেখার মাধ্যম:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-md text-white font-semibold">{medium === 'online' ? "অনলাইন" : medium === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</p>
              </div>
            </div>

            {/* Fee */}
            <div className="text-start flex  gap-4">
              <p className="text-xl font-bold primary-color py-1">পরামর্শ ফি:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-md text-white font-semibold">{consultationFee} টাকা</p>
              </div>
            </div>
          </div>
          {/* Appointment Button */}
          <div className="mt-8 mx-6">
            <Link to={`/dashboardPatient/appointmentForm/${doctorId}`}>
              <Button btnName="অ্যাপয়েন্টমেন্ট নিন" bgColor="bg-primary-color w-full" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
