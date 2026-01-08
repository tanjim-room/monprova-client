import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useDoctor from '../../hooks/useDoctor';
import useAuth from '../../hooks/useAuth';
import useSchedule from '../../hooks/useSchedule';
import SectionHeader from '../shared/SectionHeader';

const DoctorSchedule = () => {
  const axiosPublic = useAxiosPublic();
  const [doctors] = useDoctor();
  const { user } = useAuth();
  const doctor = doctors.find(doc => doc.email === user?.email);
  const doctorID = doctor?._id;
  const [schedules] = useSchedule();
  const schedule = schedules.find(sch => sch.doctorID === doctorID);

  const [availability, setAvailability] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  useEffect(() => {
    if (schedule) {
      setAvailability(schedule.availability);
    }
  }, [schedule]);

  const [selectedDay, setSelectedDay] = useState(null);
  const [onlineOffline, setOnlineOffline] = useState('online');

  // --- অটো-সিলেক্ট কারেন্ট ডে (Auto-select current day) ---
  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    setSelectedDay(days[today]);
  }, []);
  // ------------------------------------------------------

  // বাংলায় দিনের নামের ম্যাপিং (Bangla Day Names)
  const dayNamesInBangla = {
    sunday: 'রবিবার',
    monday: 'সোমবার',
    tuesday: 'মঙ্গলবার',
    wednesday: 'বুধবার',
    thursday: 'বৃহস্পতিবার',
    friday: 'শুক্রবার',
    saturday: 'শনিবার',
  };

  const timeSlots = [
    '09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM', '12:00 PM - 12:30 PM', '12:30 PM - 01:00 PM',
    '01:00 PM - 01:30 PM', '01:30 PM - 02:00 PM', '02:00 PM - 02:30 PM', '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM', '03:30 PM - 04:00 PM', '04:00 PM - 04:30 PM', '04:30 PM - 05:00 PM',
    '05:00 PM - 05:30 PM', '05:30 PM - 06:00 PM', '06:00 PM - 06:30 PM', '06:30 PM - 07:00 PM',
    '07:00 PM - 07:30 PM', '07:30 PM - 08:00 PM', '08:00 PM - 08:30 PM', '08:30 PM - 09:00 PM'
  ];

  const handleDaySelection = (day) => {
    setSelectedDay(day);
  };

  const handleSlotClick = (slot) => {
    if (!selectedDay) return;

    setAvailability((prev) => {
      const updatedDayAvailability = [...prev[selectedDay]];
      const existingSlotIndex = updatedDayAvailability.findIndex(item => item.time === slot);

      if (existingSlotIndex > -1) {
        const existingSlot = updatedDayAvailability[existingSlotIndex];

        // বুক করা স্লট এডিট করা যাবে না
        if (existingSlot.status === 'booked') {
          return prev;
        }

        if (existingSlot.type === onlineOffline) {
          updatedDayAvailability.splice(existingSlotIndex, 1);
        } else {
          updatedDayAvailability[existingSlotIndex] = { ...existingSlot, type: onlineOffline, status: "available" };
        }
      } else {
        updatedDayAvailability.push({ time: slot, type: onlineOffline, status: "available" });
      }

      return { ...prev, [selectedDay]: updatedDayAvailability };
    });
  };

  const handleSave = async () => {
    const scheduleData = {
      doctorID,
      availability,
    };

    try {
      const response = await axiosPublic.post('/api/saveSchedule', scheduleData);
      alert('সফলভাবে রুটিন সেভ করা হয়েছে!'); // 'Schedule saved successfully!' in Bangla
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('রুটিন সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'); // Error message in Bangla
    }
  };

  return (
    <div className="container mx-auto p-6">

      <div className='mb-8'>
        <SectionHeader heading="ডাক্তারের সাপ্তাহিক শিডিউল" subHeading={"আপনার শিডিউল সেট করুন"}></SectionHeader> {/* Set Your Schedule */}
      </div>

      {/* Day Selection */}
      <div className="flex gap-4 mb-6">
        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
          <button
            key={day}
            className={`px-4 py-2 rounded ${selectedDay === day ? 'bg-red-400 text-white' : 'bg-gray-200'}`}
            onClick={() => handleDaySelection(day)}
          >
            {dayNamesInBangla[day]} {/* Display Day Name in Bangla */}
          </button>
        ))}
      </div>

      {/* Slots and Mode Selection */}
      {selectedDay && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {dayNamesInBangla[selectedDay]} এর স্লটসমূহ {/* Available Slots for [Day] */}
          </h3>

          {/* Online / Offline Toggles */}
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${onlineOffline === 'online' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setOnlineOffline('online')}
            >
              অনলাইন {/* Online */}
            </button>
            <button
              className={`px-4 py-2 rounded ${onlineOffline === 'offline' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setOnlineOffline('offline')}
            >
              অফলাইন {/* Offline */}
            </button>

            <div className={`flex items-center`}>
              <div className={`w-4 h-4 rounded-full bg-blue-500`}></div>
              <span className="ml-2">অনলাইন</span> 
            </div>
             <div className={`flex items-center`}>
              <div className={`w-4 h-4 rounded-full bg-green-500`}></div>
              <span className="ml-2">অফলাইন</span> 
            </div>
             <div className={`flex items-center`}>
              <div className={`w-4 h-4 rounded-full bg-red-400`}></div>
              <span className="ml-2">বুকড</span> 
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-4 gap-4">
            {timeSlots.map((slot, index) => {
              const slotData = availability[selectedDay].find(item => item.time === slot);
              let buttonClass = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100';

              if (slotData) {
                // প্রাধান্য (Priority): বুকড (লাল) - Booked (Red)
                if (slotData.status === 'booked') {
                  buttonClass = 'bg-red-500 text-white border-red-500 cursor-not-allowed opacity-75';
                }
                // অনলাইন (নীল) - Online (Blue)
                else if (slotData.type === 'online') {
                  buttonClass = 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
                }
                // অফলাইন (সবুজ) - Offline (Green)
                else if (slotData.type === 'offline') {
                  buttonClass = 'bg-green-500 text-white border-green-500 hover:bg-green-600';
                }
              }

              return (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded ${buttonClass}`}
                  onClick={() => handleSlotClick(slot)}
                  disabled={slotData?.status === "booked"}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        onClick={handleSave}
      >
        শিডিউল সেভ করুন {/* Save Schedule */}
      </button>
    </div>
  );
};

export default DoctorSchedule;