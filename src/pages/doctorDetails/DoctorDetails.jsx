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
  const { _id, name, designation, expertise, consultationFee, img, yearsOfExperience, degrees, regNo, institute, medium, shortBio } = doctor;
 

  return (
    <div className="bg-[#EFF7FE] p-4">
      <div className="min-h-[850px] p-8 bg-white rounded-md">
        <div className="w-full text-left border p-8 rounded-md">

          {/* Back Button */}
          <BackButton destination="/dashboardPatient/doctors"></BackButton>

          {/* Doctor Name */}
          <h2 className="text-xl px-4 py-2 text-gray-800 mb-6 font-bold text-center rounded-md bg-[#EFF7FE] border">
            {name} এর তথ্যসমূহ
          </h2>

          {/* Doctor Info Card */}
          <div className="flex flex-col items-center justify-center border rounded-md p-4 mx-6 gap-6">
            <div className=''>
              <img src={img || "https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"} alt={name} className="w-72 h-72 object-cover rounded-full border" />
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold text-xl text-center">{name}</h2>
              <p className="text-lg font-semibold text-gray-700 text-center">{designation}</p>

              <div className="mt-0 text-start text-center">
                {/* {degrees.map((degree, idx) => (
                  <span key={idx} className="primary-color text-center">{degree}, </span>
                ))} */}
                <p className="primary-color text-center">{degrees}</p>
              </div>

              <div className="mt-2">
                <p className="text-base text-gray-700 font-semibold text-center">
                  BMDC Reg. No: <span className="bg-secondary-color px-2 py-1 text-white rounded-md text-sm font-semibold">{regNo}</span>
                </p>
              </div>
            </div>

          </div>


          {/* Doctor Details */}
          <div className="flex gap-6 mt-4 mx-6 space-y- mb-8">

            <div className='w-1/2'>
              {/* Workplace */}
              <div className="text-start mb-4">
                <p className="text-xl font-bold primary-color py-1">কর্মক্ষেত্র</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                  <span className='p-2'>{designation}</span>
                  <p className="font-semibold p-2">{institute}</p>
                </div>
              </div>

              {/* Specialities */}
              <div className="text-start mb-4">
                <p className="text-xl font-bold primary-color py-1">দক্ষতাসমূহ</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                 <p className='p-2 className="text-sm font-semibold'>
                   {/* {specialities.map((sp, idx) => (
                    <span key={idx} className="text-sm font-semibold">{sp}, </span>
                  ))} */}
                  {expertise}
                 </p>
                </div>
              </div>

              {/* Experience */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">অভিজ্ঞতা</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                  <span className="font-semibold p-2">{yearsOfExperience} বছর</span>
                </div>
              </div>
            </div>

            <div className='w-1/2'>
              {/* Bio */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">সংক্ষিপ্ত পরিচয়</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                  <p className="font-normal text-justify leading-loose p-2">{shortBio}</p>
                </div>
              </div>


            </div>



          </div>

          <div className='flex justify-center gap-4'>
            {/* Consultation Type */}
            <div className="text-start flex gap-4">
              <p className="text-xl font-bold primary-color py-1">রোগী দেখার মাধ্যম:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-sm text-white font-semibold">{medium == 'online'? "অনলাইন": medium == 'offline'? "অফলাইন" : "অনলাইন/অফলাইন"}</p>
              </div>
            </div>

            {/* Fee */}
            <div className="text-start flex gap-4">
              <p className="text-xl font-bold primary-color py-1">পরামর্শ ফি:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-sm text-white font-semibold">{consultationFee} টাকা</p>
              </div>
            </div>
          </div>
          {/* Appointment Button */}
          <div className="mt-8">
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
