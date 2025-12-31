import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Button from '../Button';

const MySwal = withReactContent(Swal);

const AppointmentCardDoctor = ({ appointment }) => {
 
  const [sessionLink, setSessionLink] = useState("");  // No localStorage logic

  // 🧾 Save session link
  const handleSetSessionLink = async () => {
    const { value: link } = await MySwal.fire({
      title: '🔗 সেশন লিঙ্ক দিন',
      input: 'url',
      inputPlaceholder: 'যেমনঃ https://meet.google.com/abc-defg-hij',
      inputValue: sessionLink || "",
      showCancelButton: true,
      cancelButtonText: 'বাতিল',
      confirmButtonText: 'সংরক্ষণ করুন',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return '⚠️ দয়া করে একটি লিঙ্ক দিন!';
        }
      },
    });

    if (link) {
      setSessionLink(link);  // Save link to state (not localStorage)

      await MySwal.fire({
        icon: 'success',
        title: '✅ লিঙ্ক সংরক্ষণ হয়েছে!',
        text: 'সেশন লিঙ্ক সফলভাবে সংরক্ষণ করা হয়েছে।',
        confirmButtonText: 'ঠিক আছে',
        confirmButtonColor: '#16a34a',
      });
    }
  };

  return (
    <div className="card card-side bg-base-100 shadow-sm gap-12">
      <div className="card-body">
        <div className="flex gap-8 items-center">
          <div>
            <h2 className="card-title text-xl">রোগীঃ {appointment?.patientName}</h2>
          </div>
        </div>
        <div className="text-start text-lg mt-4">
          <p>মাধ্যমঃ {appointment?.mode}</p>
          <p>তারিখঃ {'date'}</p>
          <p>সময়ঃ {'slot'}</p>

          <div className="mt-4 flex justify-between gap-8 items-center">
            {/* ✅ Start Session Button */}
            <div className="w-full">
              {appointment?.mode === 'online' && sessionLink && (
                <Link to={sessionLink} target="_blank" rel="noopener noreferrer">
                  <Button text="সেশন শুরু করুন" />
                </Link>
              )}
              {appointment?.mode === 'online' && !sessionLink && (
                <div disabled={true}>
                  <Button btnName={"সেশন শুরু করুন"}  bgColor={"bg-secondary-color"}></Button>
                </div>
              )}
            </div>

            {/* ✅ Set Session Link */}
            <div className="w-full">
              {appointment?.mode === 'online' && (
                <div onClick={handleSetSessionLink}>
                  <Button btnName={"সেশন লিঙ্ক দিন"}  bgColor={"bg-primary-color"}></Button>
                </div>
              )}
            </div>

            {/* ✅ Details Button */}
            <div className="w-full">
              <Link to={`/appointmentDetailsDoctor/`}>
                <Button btnName={"বিস্তারিত দেখুন"} bgColor={"bg-primary-color"}></Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCardDoctor;
