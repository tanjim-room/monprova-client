import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import useDoctor from '../../hooks/useDoctor';
import usePatient from '../../hooks/usePatient';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { app } from "../../firebase/firebase.config";
import useAppointment from "../../hooks/useAppointment";

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
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medium, setMedium] = useState("");

  useEffect(() => {
    if (patient) {
      setGender(patient.gender || "");
      setBloodGroup(patient.bloodGroup || "");
    }
    if (doctor) {
      setMedium(doctor.medium || "");
    }
  }, [patient, doctor]);

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
    const mode = form.mode.value;

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
    if (!mode) newErrors.mode = "** মাধ্যম আবশ্যক **";

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
      state: "upcoming",
      paymentStatus: "unpaid",
      sessionLink: ""
    };

    try {
      const response = await axiosPublic.post("/api/appointment", appointmentInfo);
      console.log("Appointment booked:", response.data);

      Swal.fire({
        title: "অ্যাপয়েন্টমেন্ট সফল!",
        text: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে।",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
      }).then(() => {
        navigate("/dashboardPatient/bookings");
      });


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

        {/* Group Age, Gender, Blood Group in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender Selection */}
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

          {/* Blood Group Selection */}
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

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="mr-4 font-medium text-md">মাধ্যম:</label>
          <select name="mode" className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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
