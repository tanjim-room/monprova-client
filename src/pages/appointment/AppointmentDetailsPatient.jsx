import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import { IoMdDownload } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // for loading spinner

const AppointmentDetailsPatient = () => {
    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const { appointmentId } = useParams();

    // Check if the data is loading
    if (!appointments || !doctors) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    // Find the relevant appointment and doctor based on the appointmentId
    const appointment = appointments.find((appointment) => appointment._id === appointmentId);
    const doctor = doctors.find((doctor) => doctor._id === appointment?.doctorID);

    // If no appointment or doctor is found, handle it
    if (!appointment || !doctor) {
        return (
            <div className="text-center text-xl text-red-500 mt-20">
                <p>Appointment or doctor not found</p>
            </div>
        );
    }

    const handleDownload = () => {
        const fileContent = `
            ডাক্তারঃ ${appointment.doctorName || 'N/A'}
            রোগীঃ ${appointment.patientName || 'N/A'}
            তারিখঃ ${appointment.date}
            প্রেসক্রিপশনঃ
            ${appointment.prescription || 'No prescription available'}
        `;

        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Prescription_${appointment.patientName || 'Unknown'}_${appointment.date}.txt`;
        link.click();
    };

    return (
        <div className="bg-[#E1ECFF] min-h-screen py-16 px-8">
            <div className="max-w-screen-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
                {/* Section 1: Appointment Information */}
                <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">অ্যাপয়েন্টমেন্ট সম্পর্কিত তথ্যসমূহঃ</h2>
                    <div className="space-y-4 text-gray-700">
                        <p><strong>মাধ্যমঃ</strong> {appointment.mode}</p>
                        <p><strong>তারিখঃ</strong> {appointment.date || "Not available"}</p>
                        <p><strong>সময়ঃ</strong> {appointment.slot || "Not available"}</p>
                        <p><strong>ফিঃ</strong> {doctor.consultationFee} টাকা</p>
                    </div>
                </div>

                {/* Section 2: Patient Information */}
                <div className="bg-green-100 p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">রোগীর তথ্যসমূহঃ</h2>
                    <div className="space-y-4 text-gray-700">
                        <p><strong>রোগীর নামঃ</strong> {appointment.patientName}</p>
                        <p><strong>মোবাইলঃ</strong> {appointment.phone}</p>
                        <p><strong>ইমেইলঃ</strong> {appointment.patientEmail}</p>
                        <p><strong>বয়সঃ</strong> {appointment.age} বছর</p>
                        <p><strong>জেন্ডারঃ</strong> {appointment.gender}</p>
                        <p><strong>ব্লাড গ্রুপঃ</strong> {appointment.bloodGroup}</p>
                        <p><strong>পেশাঃ</strong> {appointment.profession}</p>
                        <p><strong>সমস্যা/রোগের বিবরণঃ</strong> {appointment.problem}</p>
                    </div>
                </div>

                {/* Section 3: Doctor Information */}
                <div className="bg-purple-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">ডাক্তার এর তথ্যসমূহঃ</h2>
                    <div className="flex items-center gap-6 mb-8">
                        <img
                            src={doctor?.imageUrl || "https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"}
                            alt="Doctor"
                            className="w-36 h-36 object-cover rounded-full shadow-md"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                            <p className="text-md text-gray-600">{doctor.designation}</p>
                            <p className="text-sm text-gray-500">BMDC Reg No: {doctor.regNo}</p>
                            <p className="mt-2">{doctor.degrees}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">কর্মক্ষেত্র</h3>
                        <p>{doctor.institute}</p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4">অভিজ্ঞতা</h3>
                        <p>{doctor.yearsOfExperience} বছর</p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4">দক্ষতাসমূহ</h3>
                        <p>{doctor.expertise}</p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4">সংক্ষিপ্ত পরিচয়</h3>
                        <p>{doctor.shortBio}</p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4">রোগী দেখার মাধ্যম</h3>
                        <p>{doctor.medium}</p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4">পরামর্শ ফি</h3>
                        <p>{doctor.consultationFee} টাকা</p>
                    </div>
                </div>

                {/* Download Button */}
                {appointment.sessionLink && (
                    <div className="mt-8">
                        <button
                            onClick={handleDownload}
                            className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
                        >
                            <IoMdDownload className="text-xl mr-3" />
                            <span className="text-lg font-semibold">প্রেসক্রিপশন ডাউনলোড করুন</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailsPatient;
