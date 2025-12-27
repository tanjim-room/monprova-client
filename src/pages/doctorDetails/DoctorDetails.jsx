import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors data
  useEffect(() => {
    fetch('/doctors.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch doctors data');
        }
        return res.json();
      })
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

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
  const doctor = doctors.find(d => String(d.id) === String(doctorId));

  if (!doctor) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Doctor not found.
      </p>
    );
  }

  // Destructure safely with defaults
  const {
    name,
    designation,
    specialities = [],
    fee,
    img,
    experience_years,
    degrees = [],
    bmdc_reg_no,
    current_working_institution,
    bio,
    consultation_type = 'Online / Offline', // optional field
  } = doctor;

  return (
    <div className="bg-[#EFF7FE] p-4">
      <div className="min-h-[850px] p-8 bg-white rounded-md">
        <div className="w-full text-left border p-8 rounded-md">

          {/* Back Button */}
          <BackButton destination="/patientDashboard/doctors"></BackButton>

          {/* Doctor Name */}
          <h2 className="text-xl px-4 py-2 text-gray-800 mb-6 font-bold text-center rounded-md bg-[#EFF7FE] border">
            {name} এর তথ্যসমূহ
          </h2>

          {/* Doctor Info Card */}
          <div className="flex flex-col items-center justify-center border rounded-md p-4 mx-6 gap-6">
            <div className=''>
              <img src={img} alt={name} className="w-72 h-72 object-cover rounded-full border" />
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold text-xl text-center">{name}</h2>
              <p className="text-lg font-semibold text-gray-700 text-center">{designation}</p>

              <div className="mt-0 text-start text-center">
                {degrees.map((degree, idx) => (
                  <span key={idx} className="primary-color text-center">{degree}, </span>
                ))}
              </div>

              <div className="mt-2">
                <p className="text-base text-gray-700 font-semibold text-center">
                  BMDC Reg. No: <span className="bg-secondary-color px-2 py-1 text-white rounded-md text-sm font-semibold">{bmdc_reg_no}</span>
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
                  <p className="font-semibold p-2">{current_working_institution}</p>
                </div>
              </div>

              {/* Specialities */}
              <div className="text-start mb-4">
                <p className="text-xl font-bold primary-color py-1">দক্ষতাসমূহ</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                 <p className='p-2'>
                   {specialities.map((sp, idx) => (
                    <span key={idx} className="text-sm font-semibold">{sp}, </span>
                  ))}
                 </p>
                </div>
              </div>

              {/* Experience */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">অভিজ্ঞতা</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                  <span className="font-semibold p-2">{experience_years} বছর</span>
                </div>
              </div>
            </div>

            <div className='w-1/2'>
              {/* Bio */}
              <div className="text-start">
                <p className="text-xl font-bold primary-color py-1">সংক্ষিপ্ত পরিচয়</p>
                <div className="bg-[#EFF7FE] rounded-md px-2 py-2 border">
                  <p className="font-normal text-justify leading-loose p-2">{bio}</p>
                </div>
              </div>


            </div>



          </div>

          <div className='flex justify-center gap-4'>
            {/* Consultation Type */}
            <div className="text-start flex gap-4">
              <p className="text-xl font-bold primary-color py-1">রোগী দেখার মাধ্যম:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-sm text-white font-semibold">{consultation_type}</p>
              </div>
            </div>

            {/* Fee */}
            <div className="text-start flex gap-4">
              <p className="text-xl font-bold primary-color py-1">পরামর্শ ফি:</p>
              <div className="bg-secondary-color inline-block rounded-md px-2 py-2 border">
                <p className="text-sm text-white font-semibold">{fee} টাকা</p>
              </div>
            </div>
          </div>
          {/* Appointment Button */}
          <div className="mt-8">
            <Link to={`/patientDashboard/appointmentForm/${doctorId}`}>
              <Button btnName="অ্যাপয়েন্টমেন্ট নিন" bgColor="bg-primary-color w-full" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
