import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
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
  const { doctorId } = useParams();
  const axiosPublic = useAxiosPublic();
  const doctor = doctors?.find(doctor => doctor?._id === doctorId);
  const patient = patients?.find(patient => patient.email === user?.email);
  const doctorID = doctor?._id;
  const patientID = patient?._id;
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState(""); // State for gender
  const [bloodGroup, setBloodGroup] = useState("");
  const [medium, setMedium] = useState(""); // State for bloodGroup


  useEffect(() => {
    if (patient) {
      setGender(patient.gender || "");  // Set gender from the patientInfo, default to empty string if undefined
      setBloodGroup(patient.bloodGroup || ""); // Set bloodGroup from the patientInfo, default to empty string if undefined
    }
    if(doctor){
      setMedium(doctor.medium || "");
    }

  }, [patient, doctor]);

  const handlePayment = async (appointmentId) => {
    // Simulate payment processing
    const payment = {
      appointmentID: appointmentId,
      email: user?.email,
      doctorID: doctor?._id,
      patientID: patient?._id,
      amount: doctor?.consultationFee || 0,
      transactionId: "",
      date: new Date(),
      status: "pending",
    }

    const response =  await axiosPublic.post('/api/sslpayment', payment);
    console.log(response)
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;

  // Get form field values
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

  // Validation
  const newErrors = {};
  if (!patientName) newErrors.patientName = "নাম আবশ্যক";
  if (!phone) newErrors.phone = "মোবাইল আবশ্যক";
  if (!patientEmail) newErrors.patientEmail = "ইমেইল আবশ্যক";
  if (!age) newErrors.age = "বয়স আবশ্যক";
  if (!gender) newErrors.gender = "জেন্ডার আবশ্যক";
  if (!bloodGroup) newErrors.bloodGroup = "রক্তের গ্রুপ আবশ্যক";
  if (!profession) newErrors.profession = "পেশা আবশ্যক";
  if (!emergencyContact) newErrors.emergencyContact = "জরুরি যোগাযোগ আবশ্যক";
  if (!problem) newErrors.problem = "সমস্যা/রোগের বিবরণ আবশ্যক";
  if (!mode) newErrors.mode = "মাধ্যম আবশ্যক";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  // Appointment data
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
    paymentStatus: "unpaid", // future payment purpose
    sessionLink: ""
  };

  try {
    const response = await axiosPublic.post(
      "/api/appointment",
      appointmentInfo
    );

    console.log("Appointment booked:", response.data);

    Swal.fire({
      title: "অ্যাপয়েন্টমেন্ট সফল!",
      text: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে।",
      icon: "success",
      confirmButtonText: "ঠিক আছে",
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
    <div className="min-h-[850px] p-16 bg-[#E1ECFF] rounded-lg mt-16">
      <h2 className="text-2xl font-bold pb-6">{doctor?.name || ''} এর অ্যাপয়েন্টমেন্ট বুক করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">নাম</label>
            <input
              name="patientName"
              defaultValue={patient?.name || ''}
              className="w-full p-2 border rounded"
              placeholder="নাম লিখুন"
            />
            {errors.patientName && <span className="text-red-500">{errors.patientName}</span>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">মোবাইল</label>
            <input
              name="phone"
              defaultValue={patient?.phone || ''}
              className="w-full p-2 border rounded"
              placeholder="মোবাইল নাম্বার"
            />
            {errors.phone && <span className="text-red-500">{errors.phone}</span>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">ইমেইল</label>
            <input
              name="patientEmail"
              defaultValue={patient?.email || ''}
              className="w-full p-2 border rounded"
              placeholder="ইমেইল লিখুন"
            />
            {errors.patientEmail && <span className="text-red-500">{errors.patientEmail}</span>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">বয়স</label>
            <input
              type="number"
              name="age"
              defaultValue={patient?.age || ''}
              className="w-full p-2 border rounded"
              placeholder="বয়স লিখুন"
            />
            {errors.age && <span className="text-red-500">{errors.age}</span>}
          </div>

          <div>
            <label className="label">জেন্ডার</label>
            <select
              name="gender"
              value={gender} // Bind gender state to the select value
              onChange={(e) => setGender(e.target.value)} // Update gender state on change
              className="select select-bordered w-full border-2 p-2"
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">নারী</option>
              <option value="other">অন্যান্য</option>
            </select>
            {errors.gender && <span className="text-red-500">{errors.gender}</span>}
          </div>




          <div>
            <label className="label">রক্তের গ্রুপ</label>
            <select
              name="bloodGroup"
              value={bloodGroup} // Bind bloodGroup state to the select value
              onChange={(e) => setBloodGroup(e.target.value)} // Update bloodGroup state on change

              className="select select-bordered w-full border-2 p-2"
            >
              <option value="">নির্বাচন করুন</option>
              {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <span className="text-red-500">{errors.bloodGroup}</span>}
          </div>


          <div>
            <label className="block mb-1 font-semibold">পেশা</label>
            <input
              name="profession"
              defaultValue={patient?.profession || ''}
              className="w-full p-2 border rounded"
              placeholder="পেশা লিখুন"
            />
            {errors.profession && <span className="text-red-500">{errors.profession}</span>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">জরুরি যোগাযোগ</label>
            <input
              name="emergencyContact"
              defaultValue={patient?.emergencyContact || ''}
              className="w-full p-2 border rounded"
              placeholder="জরুরি যোগাযোগ নম্বর লিখুন"
            />
            {errors.emergencyContact && <span className="text-red-500">{errors.emergencyContact}</span>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">সমস্যা/রোগের বিবরণ</label>
            <textarea
              name="problem"
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="আপনার সমস্যা লিখুন"
            />
            {errors.problem && <span className="text-red-500">{errors.problem}</span>}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-4">
          <label className="mr-4 font-semibold">মাধ্যম:</label>
          <select name="mode" className="p-2 border rounded">
            <option value="">নির্বাচন করুন</option>
           
              {
                doctor?.medium === "online"
                  ? <option value="online">অনলাইন</option> // Show only the online option
                  : doctor?.medium === "offline"
                    ? <option value="offline">অফলাইন</option> // Show only the offline option
                    : (
                      <>
                        <option value="online">অনলাইন</option> // Show both options
                        <option value="offline">অফলাইন</option>
                      </>
                    )
              }
           


          </select>
          {errors.mode && <span className="text-red-500 ml-2">{errors.mode}</span>}
        </div>

        <input
          type="submit"
          className="btn bg-primary-color text-white w-full px-8"
          value="অ্যাপয়েন্টমেন্ট বুক করুন"
        />
      </form>
    </div>
  );
};

export default AppointmentForm;
