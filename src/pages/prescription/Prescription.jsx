// Prescription.js
import React, { useEffect, useState } from "react";
 // Import the new PrescriptionCard component
import usePrescription from "../../hooks/usePrescription";
import usePatient from "../../hooks/usePatient";
import useAuth from "../../hooks/useAuth";
import PrescriptionCard from "../../components/cards/PrescriptionCard";

const Prescription = () => {
  const [prescriptions] = usePrescription();
  const [patients] = usePatient();
  const {user} = useAuth();
  const patient = patients?.find(patient => patient.email === user?.email);
  const prescription = prescriptions?.filter(prescription => prescription.patientID === patient?._id)
  console.log(prescription);

  

  return (
    <div>
      <div className="min-h-[850px] bg-[#E1ECFF] rounded-lg mt-16 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          আপনার সব প্রেসক্রিপশন
        </h2>

        {prescription.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            এখনো কোনো প্রেসক্রিপশন পাওয়া যায়নি।
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {prescription.map((prescription, index) => (
              <PrescriptionCard key={index} prescription={prescription} patient ={patient} /> // Use PrescriptionCard to render each item
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescription;
