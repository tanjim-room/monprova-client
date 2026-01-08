import React from 'react';
import Logo from '../../components/Logo';
import usePatient from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';

const PatientHome = () => {
    const [patiens] = usePatient();
    const {user} = useAuth();
    const patient = patiens?.find(patient => patient.email === user?.email)
  return (
   <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6 text-center">
      <Logo />

      <img
        src="https://i.ibb.co.com/Sw6zV5tX/cheerful-middle-aged-man-spreading-hands-park.jpg"
        alt="Vital Role of Sleep"
        className="max-w-4xl rounded-xl shadow-lg mt-8"
      />

      <h2 className="text-3xl font-semibold text-gray-800 mt-6">হ্যালো {patient?.name}</h2>

      <p className="text-xl text-gray-700 mt-4">
        অ্যাডমিন ড্যাশবোর্ডে স্বাগতম। আপনার সিস্টেমটি দক্ষতার সাথে এবং কার্যকরভাবে পরিচালনা করুন।
      </p>
    </div>
  );
};

export default PatientHome;
