import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import { IoMdDownload } from "react-icons/io";
import usePrescription from "../../hooks/usePrescription";

const AppointmentDetailsPatient = () => {
    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const { appointmentId } = useParams();
    const [prescriptions] = usePrescription();
    const prescription = prescriptions?.find(prescription => prescription.appointmentID === appointmentId);

    if (!appointments || !doctors) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    const appointment = appointments.find((appointment) => appointment._id === appointmentId);
    const doctor = doctors.find((doctor) => doctor._id === appointment?.doctorID);

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
        <div className="min-h-screen py-0 px-0">
            <div className="bg-white p-0 rounded-lg">
                {/* Section 1: Appointment Information */}
                <div className="bg-blue-100 p-6 mb-8 card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">অ্যাপয়েন্টমেন্ট সম্পর্কিত তথ্যসমূহঃ</h2>
                    <div className="space-y-4 text-gray-700">
                        <p><strong>মাধ্যমঃ</strong> <span className='bg-secondary-color text-white px-2 py-1 rounded-md text-sm'>{appointment.mode === 'online' ? "অনলাইন" : appointment.mode === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</span></p>
                        <p>
                            <strong>তারিখঃ</strong>{" "}
                            {appointment.appointmentDate
                                ? new Date(appointment.appointmentDate).toLocaleDateString("en-BD", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })
                                : "Not available"}
                        </p>
                        <p><strong>সময়ঃ</strong> {appointment.slot || "Not available"}</p>
                        <p><strong>ফিঃ</strong> {doctor.consultationFee} টাকা</p>
                        <p><strong>স্ট্যাটাসঃ</strong> <span className={`font-semibold ${appointment.state === "completed" ? "text-green-600" : "text-yellow-600"}`}>{appointment.state || "upcoming"}</span></p>
                        {prescription && (
                            <div className="mt-8">
                                <button
                                    onClick={() =>
                                        window.open(
                                            `http://localhost:8000/api/prescription/${prescription?.appointmentID}/pdf`,
                                            "_blank"
                                        )
                                    } className="w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md shadow-md hover:bg-red-600 transition-all duration-200"
                                >
                                    <IoMdDownload className="text-xl mr-3" />
                                    <span className="text-lg font-semibold">প্রেসক্রিপশন ডাউনলোড করুন</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sections: Patient and Doctor Information in a Row */}
                <div className="flex gap-12">
                    {/* Patient Information */}
                    <div className="bg-green-100 p-6 rounded-lg shadow-md w-1/2 overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">রোগীর তথ্যসমূহঃ</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>রোগীর নামঃ</strong> {appointment.patientName}</p>
                            <p><strong>মোবাইলঃ</strong> {appointment.phone}</p>
                            <p><strong>ইমেইলঃ</strong> {appointment.patientEmail}</p>
                            <p><strong>বয়সঃ</strong> {appointment.age} বছর</p>
                            <p><strong>জেন্ডারঃ</strong> {appointment.gender === "male" ? "পুরুষ" : appointment.gender === "female" ? "মহিলা" : "অন্যান্য"}</p>
                            <p><strong>ব্লাড গ্রুপঃ</strong> {appointment.bloodGroup}</p>
                            <p><strong>পেশাঃ</strong> {appointment.profession}</p>
                            <p><strong>সমস্যা/রোগের বিবরণঃ</strong> </p>
                            <p>{appointment.problem}</p>
                        </div>
                    </div>

                    {/* Doctor Information */}
                    <div className="bg-purple-100 p-6 rounded-lg shadow-md w-1/2 overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">ডাক্তার এর তথ্যসমূহঃ</h2>
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={doctor?.image || "https://i.ibb.co.com/ym2wsZXY/avater-Grey-User-Circles-Set.png"}
                                alt="Doctor"
                                className="w-36 h-36 object-cover rounded-full shadow-md"
                            />
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                                <p className="text-md text-gray-600">{doctor.designation}</p>
                                <p>{doctor.institute}</p>
                                <p className="mt-0">{doctor.degrees}</p>
                                <p className="text-sm text-gray-500">BMDC Reg No: {doctor.regNo}</p>
                            </div>
                        </div>

                        <div>



                            <h3 className="text-md font-semibold text-gray-700 mt-2">অভিজ্ঞতা</h3>
                            <p>{doctor.yearsOfExperience} বছর</p>

                            <h3 className="text-md font-semibold text-gray-700 mt-2">দক্ষতাসমূহ</h3>
                            <p>{doctor.expertise}</p>

                            <h3 className="text-md font-semibold text-gray-700 mt-2 text-justify">সংক্ষিপ্ত পরিচয়</h3>
                            <p>{doctor.shortBio}</p>

                            <h3 className="text-md font-semibold text-gray-700 mt-2">রোগী দেখার মাধ্যম</h3>
                            <p><span className='bg-secondary-color text-white px-2 py-1 rounded-md text-sm'>{doctor.medium === 'online' ? "অনলাইন" : doctor.medium === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</span></p>

                            <h3 className="text-md font-semibold text-gray-700 mt-2">পরামর্শ ফি</h3>
                            <p>{doctor.consultationFee} টাকা</p>
                        </div>
                    </div>
                </div>

                {/* Download Button */}

            </div>
        </div>
    );
};


export default AppointmentDetailsPatient;
