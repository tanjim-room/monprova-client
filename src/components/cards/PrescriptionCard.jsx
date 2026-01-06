import React from 'react';
import { IoMdDownload } from 'react-icons/io'; // Assuming you're using this for the download icon

const PrescriptionCard = ({ prescription }) => {

  // Function to handle download


  return (
    <div className="card bg-white shadow-md p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
      <div className="card-body text-left">
        <h3 className="card-title text-xl font-semibold text-gray-800 mb-2">
          ডাক্তারঃ {prescription?.doctorName || "N/A"}
        </h3>
        <p><strong>রোগীঃ</strong> {prescription?.patientName || "N/A"}</p>
        <p><strong>তারিখঃ {new Date(prescription?.updatedAt || prescription?.createdAt).toLocaleString('default', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        }</strong></p>

        <div className="mt-4">
          <button onClick={() =>
            window.open(
              `http://localhost:8000/api/prescription/${prescription?.appointmentID}/pdf`,
              "_blank"
            )
          } className="w-full border-2 rounded-md flex justify-center items-center bg-primary-color text-white">
            <div className="flex items-center gap-6 px-4 py-2 font-semibold text-xl rounded-md">
              <div className="flex gap-4 items-center bg-primary-color">
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
