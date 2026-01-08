import React, { useState, useEffect } from "react";
import { format, setHours, setMinutes } from "date-fns";
import axios from "axios";
import Button from "../../components/Button";

const DoctorSchedule = () => {
  const weekDays = [
    { name: "রবিবার", value: "sunday" },
    { name: "সোমবার", value: "monday" },
    { name: "মঙ্গলবার", value: "tuesday" },
    { name: "বুধবার", value: "wednesday" },
    { name: "বৃহস্পতিবার", value: "thursday" },
    { name: "শুক্রবার", value: "friday" },
    { name: "শনিবার", value: "saturday" },
  ];

  // 🔸 Generate slots for Online (9AM–9PM)
  const generateOnlineSlots = () => {
    const slots = [];
    let start = setHours(setMinutes(new Date(), 0), 9);
    const end = setHours(setMinutes(new Date(), 0), 21);
    while (start < end) {
      const next = new Date(start.getTime() + 30 * 60000);
      const timeStr = `${format(start, "hh:mm a")} - ${format(next, "hh:mm a")}`;
      slots.push(timeStr);
      start = next;
    }
    return slots;
  };

  // 🔸 Generate slots for Offline (9AM–5PM)
  const generateOfflineSlots = () => {
    const slots = [];
    let start = setHours(setMinutes(new Date(), 0), 9); // 9 AM start time for offline mode
    const end = setHours(setMinutes(new Date(), 0), 17); // 5 PM end time for offline mode
    while (start < end) {
      const next = new Date(start.getTime() + 30 * 60000);
      const timeStr = `${format(start, "hh:mm a")} - ${format(next, "hh:mm a")}`;
      slots.push(timeStr);
      start = next;
    }
    return slots;
  };

  // Track selected mode (Online/Physical)
  const [mode, setMode] = useState("অনলাইন");

  // Selected slots for the entire week
  const [selectedSlots, setSelectedSlots] = useState({});

  // Booked slots (from backend or demo)
  const [bookedSlots, setBookedSlots] = useState({});

  // Load data from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("http://localhost:8000/schedule");
        const scheduleData = response.data;
        const schedule = {};
        scheduleData.forEach((s) => {
          schedule[`${s.mode}-${s.date}`] = s.slots;
        });
        setSelectedSlots(schedule);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        alert("❌ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    };

    // Fetch booked slots
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get("http://localhost:8000/booked-slots");
        setBookedSlots(response.data);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        alert("❌ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    };

    fetchSchedule();
    fetchBookedSlots();
  }, []);

  // Get time slots based on mode
  const getTimeSlots = () => {
    return mode === "অনলাইন" ? generateOnlineSlots() : generateOfflineSlots();
  };

  // Toggle slot for the week
  const toggleSlot = (day, slot) => {
    const dateStr = format(new Date(), "yyyy-MM-dd");

    // Prevent if booked
    if (bookedSlots[dateStr]?.includes(slot)) {
      alert("❌ এই সময়টি ইতিমধ্যে বুক করা হয়েছে!");
      return;
    }

    setSelectedSlots((prev) => {
      const daySlots = prev[`${mode}-${day}`] || [];
      if (daySlots.includes(slot)) {
        // remove
        return {
          ...prev,
          [`${mode}-${day}`]: daySlots.filter((s) => s !== slot),
        };
      } else {
        // add
        return {
          ...prev,
          [`${mode}-${day}`]: [...daySlots, slot],
        };
      }
    });
  };

  // Save schedule for the entire week
  const handleSave = async () => {
    try {
      const data = Object.keys(selectedSlots).map((key) => {
        const [mode, day] = key.split("-");
        return { day, mode, slots: selectedSlots[key] };
      });

      // Send data to backend
      await axios.post("http://localhost:8000/schedule", data);
      alert("✅ সময়সূচি সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!");
    } catch (err) {
      console.error("Error saving schedule:", err);
      alert("❌ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="bg-[#E1ECFF] min-h-screen">
      <div className="max-w-6xl mx-auto p-6 mt-16 bg-base-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">আপনার সাপ্তাহিক সময়সূচি</h2>

        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="form-control w-52">
            <div className="flex gap-4 justify-center items-center">
              <div>
                <label className="label">
                  <span className="font-semibold text-black">রোগী দেখার মাধ্যমঃ</span>
                </label>
              </div>
              <div>
                <select
                  className="select select-bordered p-2 mx-8 border-2 bd-primary-color"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option>অনলাইন</option>
                  <option>অফলাইন</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Days Static Schedule */}
        <div className="space-y-8">
          {weekDays.map((day) => {
            const timeSlots = getTimeSlots();
            const key = `${mode}-${day.value}`;

            return (
              <div key={day.value} className="border-2 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{day.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlots[key]?.includes(slot);
                    const isBooked = bookedSlots[day.value]?.includes(slot);

                    let btnClass = "btn text-xs ";
                    if (isBooked) {
                      btnClass += "btn-error text-white"; // Red color for booked slots
                    } else if (isSelected) {
                      btnClass += "btn-success text-white"; // Green color for selected slots
                    } else {
                      btnClass += "btn-outline text-gray-500"; // Gray for not selected slots
                    }

                    return (
                      <button
                        key={slot}
                        className={btnClass}
                        onClick={() => toggleSlot(day.value, slot)}
                        disabled={isBooked}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-10 text-center">
          <Button onClick={handleSave} btnName={"সময়সূচি সংরক্ষণ করুন"} bgColor={"bg-primary-color"} />
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
