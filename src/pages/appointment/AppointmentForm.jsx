import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import useDoctor from '../../hooks/useDoctor';
import usePatient from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAppointment from "../../hooks/useAppointment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSchedule from "../../hooks/useSchedule";
import { app } from "../../firebase/firebase.config";

const AppointmentForm = () => {
  const [doctors] = useDoctor();
  const [patients] = usePatient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const axiosPublic = useAxiosPublic();
  const doctor = doctors?.find(doctor => doctor?._id === doctorId);
  const patient = patients?.find(patient => patient.email === user?.email);
  const doctorID = doctor?._id;
  const patientID = patient?._id;
  const [schedules] = useSchedule(); // Custom hook to get existing schedules
  const schedule = schedules.find(sch => sch.doctorID === doctorID); // Find the existing schedule for the doctor
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medium, setMedium] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // Selected date state
  const [availableSlots, setAvailableSlots] = useState([]); // State for available slots
  const [selectedSlot, setSelectedSlot] = useState(null); // State for selected slot
  const [mode, setMode] = useState(""); // Mode (online/offline)

  useEffect(() => {
    if (patient) {
      setGender(patient.gender || "");
      setBloodGroup(patient.bloodGroup || "");
    }
    if (doctor) {
      setMedium(doctor.medium || "");
    }
  }, [patient, doctor]);

  useEffect(() => {
    if (doctor && selectedDate && mode) {
      // Fetch available slots based on the selected date and mode
      const slots = getAvailableSlotsForDateAndMode(selectedDate, mode);
      setAvailableSlots(slots);
      console.log("Available slots:", slots);
    }
  }, [selectedDate, mode, doctor]);

  const getAvailableSlotsForDateAndMode = (date, mode) => {
    // Example mock logic for available slots based on date and mode
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = schedule?.availability?.[dayOfWeek] || []; // Access the day schedule dynamically

    // Filter slots based on mode (online/offline)
    const filteredSlots = daySchedule
      .filter(slot => slot.type === mode && slot.status === "available") // Filter by mode (online/offline)
      .map(slot => slot.time); // Map to the time
    return filteredSlots;
  };

  const handlePayment = async (appointmentId) => {
    const payment = {
      appointmentID: appointmentId,
      email: user?.email,
      doctorID: doctor?._id,
      patientID: patient?._id,
      amount: doctor?.consultationFee || 0,
      transactionId: "",
      date: new Date(),
      status: "pending",
    };

    const response = await axiosPublic.post('/api/sslpayment', payment);
    console.log(response);
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const patientName = form.patientName.value;
  const phone = form.phone.value;
  const patientEmail = form.patientEmail.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const bloodGroup = form.bloodGroup.value;
  const profession = form.profession.value;
  const emergencyContact = form.emergencyContact.value;
  const problem = form.problem.value;

  const newErrors = {};
  if (!patientName) newErrors.patientName = "** নাম আবশ্যক **";
  if (!phone) newErrors.phone = "** মোবাইল আবশ্যক **";
  if (!patientEmail) newErrors.patientEmail = "** ইমেইল আবশ্যক **";
  if (!age) newErrors.age = "** বয়স আবশ্যক **";
  if (!gender) newErrors.gender = "** জেন্ডার আবশ্যক **";
  if (!bloodGroup) newErrors.bloodGroup = "** রক্তের গ্রুপ আবশ্যক **";
  if (!profession) newErrors.profession = "** পেশা আবশ্যক **";
  if (!emergencyContact) newErrors.emergencyContact = "** জরুরি যোগাযোগ আবশ্যক **";
  if (!problem) newErrors.problem = "** সমস্যা/রোগের বিবরণ আবশ্যক **";
  if (!selectedSlot) newErrors.selectedSlot = "** সময় নির্বাচন করুন **"; // Ensure slot is selected

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  const appointmentInfo = {
    doctorID,
    patientID,
    patientName,
    age,
    gender,
    phone,
    patientEmail,
    bloodGroup,
    emergencyContact,
    profession,
    problem,
    mode,
    appointmentDate: selectedDate,
    slot: selectedSlot,
    state: "upcoming",
    paymentStatus: "unpaid",
    sessionLink: "",
  };

  try {
    // First, book the appointment
    const response = await axiosPublic.post("/api/appointment", appointmentInfo);
    console.log("Appointment booked:", response.data);

    // After successfully booking the appointment, update the schedule status
    const day = new Date(selectedDate).toLocaleString("en-us", { weekday: "long" }).toLowerCase(); // Get the day name, e.g., "sunday"
    const time = selectedSlot; // Selected time slot like "09:00 AM - 09:30 AM"
    const status = "booked"; // Set status to "booked"

    // Update the schedule for the doctor on the selected date and slot
    const updateResponse = await axiosPublic.patch(`/api/schedule/${schedule._id}`, {
      day,
      time,
      status,
    });

    if (updateResponse.status === 200) {
      Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        text: "আপনি কি এই অ্যাপয়েন্টমেন্ট বুক করতে চান?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "হ্যাঁ, বুক করুন",
        cancelButtonText: "না",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "অ্যাপয়েন্টমেন্ট সফল!",
            text: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে।",
            icon: "success",
            confirmButtonText: "ঠিক আছে",
          }).then(() => {
            navigate("/dashboardPatient/bookings");
          });
        }
      });
    }

    // Reset form after success
    form.reset();
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "ত্রুটি!",
      text: "অ্যাপয়েন্টমেন্ট বুক করা যায়নি। আবার চেষ্টা করুন।",
      icon: "error",
      confirmButtonText: "ঠিক আছে",
    });
  }
};


  // Date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Slot selection handler
  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot); // Update selected slot
  };

  return (
    <div className="min-h-[850px] p-8 bg-[#E1ECFF] rounded-lg mt-2 border">
      <h2 className="text-xl font-bold pb-6 text-center">{doctor?.name || ''} এর অ্যাপয়েন্টমেন্ট বুক করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">নাম</label>
            <input
              name="patientName"
              defaultValue={patient?.name || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="নাম লিখুন"
            />
            {errors.patientName && <span className="text-red-500 text-sm">{errors.patientName}</span>}
          </div>

          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">ইমেইল</label>
            <input
              name="patientEmail"
              defaultValue={patient?.email || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ইমেইল লিখুন"
            />
            {errors.patientEmail && <span className="text-red-500 text-sm">{errors.patientEmail}</span>}
          </div>
        </div>

        {/* Gender, Blood Group, and Age */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender */}
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">জেন্ডার</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">নারী</option>
              <option value="other">অন্যান্য</option>
            </select>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">রক্তের গ্রুপ</label>
            <select
              name="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">নির্বাচন করুন</option>
              {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            {errors.bloodGroup && <span className="text-red-500 text-sm">{errors.bloodGroup}</span>}
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">বয়স</label>
            <input
              type="number"
              name="age"
              defaultValue={patient?.age || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="বয়স লিখুন"
            />
            {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
          </div>
        </div>
        {/* Mobile & Emergency Contact in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">জরুরি যোগাযোগ</label>
            <input
              name="emergencyContact"
              defaultValue={patient?.emergencyContact || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="জরুরি যোগাযোগ নম্বর লিখুন"
            />
            {errors.emergencyContact && <span className="text-red-500 text-sm">{errors.emergencyContact}</span>}
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">মোবাইল</label>
            <input
              name="phone"
              defaultValue={patient?.phone || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="মোবাইল নাম্বার"
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-gray-700">পেশা</label>
            <input
              name="profession"
              defaultValue={patient?.profession || ''}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="পেশা লিখুন"
            />
            {errors.profession && <span className="text-red-500 text-sm">{errors.profession}</span>}
          </div>

          <div className="md:col-span-3">
            <label className="block mb-2 text-md font-medium text-gray-700">সমস্যা/রোগের বিবরণ</label>
            <textarea
              name="problem"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="আপনার সমস্যা লিখুন"
            />
            {errors.problem && <span className="text-red-500 text-sm">{errors.problem}</span>}
          </div>
        </div>

        {/* Select Mode */}
        <div className="mb-6">
          <label className="mr-4 font-medium text-md">মাধ্যম:</label>
          <select
            name="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">নির্বাচন করুন</option>
            {
              doctor?.medium === "online"
                ? <option value="online">অনলাইন</option>
                : doctor?.medium === "offline"
                  ? <option value="offline">অফলাইন</option>
                  : (
                    <>
                      <option value="online">অনলাইন</option>
                      <option value="offline">অফলাইন</option>
                    </>
                  )
            }
          </select>
          {errors.mode && <span className="text-red-500 text-sm">{errors.mode}</span>}
        </div>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block mb-2 text-md font-medium text-gray-700">অ্যাপয়েন্টমেন্টের তারিখ</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={new Date().setDate(new Date().getDate() + 7)} // Allow only the next 7 days
            placeholderText="তারিখ নির্বাচন করুন"
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Available Slots */}
        {availableSlots.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">অ্যাপয়েন্টমেন্টের সময়</h3>

            <ul className="flex flex-wrap gap-2">
              {availableSlots.map((slot, index) => {
                const isSelected = selectedSlot === slot;

                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSlotSelection(slot)}
                      className={`
                px-4 py-2 mt-2 rounded text-white font-medium transition
                ${isSelected ? "bg-red-500" : "bg-green-500"}
                hover:opacity-90
              `}
                    >
                      {slot}
                    </button>
                  </li>
                );
              })}
            </ul>

            {errors.selectedSlot && (
              <span className="text-red-500 text-sm">{errors.selectedSlot}</span>
            )}
          </div>
        ) : (
          selectedDate && mode && (
            <p className="text-red-500">নির্বাচিত তারিখ এবং মাধ্যমে কোন স্লট নেই।</p>
          )
        )
        }


        {/* Submit Button */}
        <input
          type="submit"
          className="w-full p-3 text-white bg-primary-color hover:bg-secondary-color rounded-md shadow-sm focus:outline-none"
          value="অ্যাপয়েন্টমেন্ট বুক করুন"
        />
      </form>
    </div>
  );
};

export default AppointmentForm;
