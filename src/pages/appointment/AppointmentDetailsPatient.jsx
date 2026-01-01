import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import { IoMdDownload } from "react-icons/io";

const AppointmentDetailsPatient = () => {
    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const { appointmentId } = useParams();

    // Check if the data is loading
    if (!appointments || !doctors) {
        return <div>Loading...</div>;
    }

    // Find the relevant appointment and doctor based on the appointmentId
    const appointment = appointments.find(appointment => appointment._id === appointmentId);
    const doctor = doctors.find(doctor => doctor._id === appointment?.doctorID);

    // If no appointment or doctor is found, handle it
    if (!appointment || !doctor) {
        return <div>Appointment or doctor not found</div>;
    }
    const handleDownload = () => {
    const fileContent = `
      ডাক্তারঃ ${pres.doctorName || 'N/A'}
      রোগীঃ ${pres.patientName || 'N/A'}
      তারিখঃ ${pres.date}
      প্রেসক্রিপশনঃ
      ${pres.prescription || 'No prescription available'}
    `;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Prescription_${pres.patientName || 'Unknown'}_${pres.date}.txt`;
    link.click();
  };
    return (
        <div>
            <div className="min-h-[850px] p-16 bg-[#E1ECFF] rounded-lg mt-16">
                <div className="flex justify-between">
                    <div className="text-left w-full">
                        <h2 className="text-2xl text-gray-800 font-bold">অ্যাপয়েন্টমেন্ট সম্পর্কিত তথ্যসমূহঃ</h2>
                        <div className="mt-4">
                            <p>মাধ্যমঃ {appointment.mode}</p>
                            <p>তারিখঃ {appointment.date || "Not available"}</p>
                            <p>সময়ঃ {appointment.slot || "Not available"}</p>
                            <p>ফিঃ {doctor.consultationFee} টাকা</p>
                        </div>

                        <div className="mt-4 text-left">
                            <h2 className="text-2xl text-gray-800 mb-4 font-bold">রোগীর তথ্যসমূহঃ</h2>
                            <p>রোগীর নামঃ {appointment.patientName}</p>
                            <p>মোবাইলঃ {appointment.phone}</p>
                            <p>ইমেইলঃ {appointment.patientEmail}</p>
                            <p>বয়সঃ {appointment.age} বছর</p>
                            <p>জেন্ডারঃ {appointment.gender}</p>
                            <p>ব্লাড গ্রুপঃ {appointment.bloodGroup}</p>
                            <p>পেশাঃ {appointment.profession}</p>
                            <p>সমস্যা/রোগের বিবরণঃ {appointment.problem}</p>
                        </div>
                    </div>
                    <div className="w-full text-left">
                        <h2 className="text-2xl text-gray-800 mb-4 font-bold">ডাক্তার এর তথ্যসমূহঃ</h2>
                        <div>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <img src={doctor?.imageUrl || "https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"} alt="" className="w-36 h-36 object-cover rounded-full" />
                                </div>
                                <div>
                                    <h2 className="card-title text-2xl">{doctor.name}</h2>
                                    <p className="text-xl mt-0 mb-0 font-bold text-start text-gray-700">{doctor.designation}</p>
                                    <p className="text-start text-sm mt-0 text-gray-700">BMDC Registration No: {doctor.regNo}</p>
                                    <p>{doctor.degrees}</p>
                                </div>
                            </div>
                            <div className="card-body ml-0 pl-0">
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">কর্মক্ষেত্র</p>
                                <span>{doctor.designation}</span>
                                <p className="font-semibold">{doctor.institute}</p>
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">অভিজ্ঞতা</p>
                                <span>{doctor.yearsOfExperience} বছর</span>
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">দক্ষতাসমূহ</p>
                                <p>{doctor.expertise}</p>
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">সংক্ষিপ্ত পরিচয়</p>
                                <span className="text-sm">{doctor.shortBio}</span>
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">রোগী দেখার মাধ্যম</p>
                                <span className="text-sm">{doctor.medium}</span>
                                <p className="text-start text-xl mt-4 text-gray-700 font-bold">পরামর্শ ফি</p>
                                <span>{doctor.consultationFee} টাকা</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="mt-4">
                        <button onClick={handleDownload} className="w-full border-2 rounded-md flex justify-center items-center bg-primary-color text-white">
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

export default AppointmentDetailsPatient;