import React from 'react';
import { IoMdDownload } from 'react-icons/io'; // Assuming you're using this for the download icon
import useDoctor from '../../hooks/useDoctor';
import usePatient from '../../hooks/usePatient';
import axios from 'axios';
import pdfService from '../../pdfService';
import Swal from 'sweetalert2';

const PrescriptionCard = ({ prescription }) => {

  // Function to handle download
  const [doctors] = useDoctor();
  const doctor = doctors.find((d) => d._id === prescription.doctorID);
  const [patients] = usePatient();
  const patient = patients.find((p) => p._id === prescription.patientID);
  const appointmentId = prescription.appointmentID;

const downloadPdfFile = async () => {
  try {
    // Show loading alert
    Swal.fire({
      title: 'প্রেসক্রিপশন ডাউনলোড হচ্ছে...',
      text: 'অনুগ্রহ করে অপেক্ষা করুন',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // API call
    const response = await pdfService.downloadPDF(appointmentId);

    // Create PDF blob
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Trigger download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'prescription.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close loading & show success
    Swal.fire({
      icon: 'success',
      title: 'ডাউনলোড সম্পন্ন',
      text: 'প্রেসক্রিপশন সফলভাবে ডাউনলোড হয়েছে',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error("Error downloading PDF:", error);

    // Show error alert
    Swal.fire({
      icon: 'error',
      title: 'ডাউনলোড ব্যর্থ',
      text: 'প্রেসক্রিপশন ডাউনলোড করা যায়নি'
    });
  }
};


  return (
    <div className="card shadow-md p-4 rounded-xl border-2 border-gray-200 hover:shadow-lg transition">
      <div className="card-body text-left">
        <div className='flex items-center gap-4 mb-4'>
          <img src={doctor?.image} alt="" className='w-12 h-12 object-cover rounded-full' />
          <div>
            <h2 className="text-lg font-semibold">
              {doctor?.name}
            </h2>
            <p className='text-black'>{doctor?.designation}</p>
          </div>
        </div>
        <p><strong>রোগীঃ</strong> {patient?.name || "N/A"}</p>
        <p><strong>তারিখঃ {new Date(prescription?.updatedAt || prescription?.createdAt).toLocaleString('default', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}</strong></p>

        <div className="mt-4">
          {/* Fix the event handler to prevent immediate invocation */}
          <button onClick={downloadPdfFile} className="w-full border-2 rounded-md flex justify-center items-center bg-secondary-color text-white">
            <div className="flex items-center gap-6 px-4 py-2 font-semibold text-xl rounded-md">
              <div className="flex gap-4 items-center bg-secondary-color">
                <span className="text-xl"><IoMdDownload /></span>
                <span className="text-center text-lg">প্রেসক্রিপশন ডাউনলোড করুন</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
