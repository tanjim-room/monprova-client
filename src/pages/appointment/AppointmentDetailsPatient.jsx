import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import { IoMdDownload } from "react-icons/io";
import usePrescription from "../../hooks/usePrescription";
import { FaSpinner } from "react-icons/fa"; // Make sure to import the FaSpinner icon
import pdfService from "../../pdfService";
import Swal from "sweetalert2";
import { useState } from "react";

const AppointmentDetailsPatient = () => {
    const { appointmentId } = useParams();

    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const [prescriptions] = usePrescription();

    const prescription = prescriptions?.find(
        p => p.appointmentID === appointmentId
    );

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    if (!appointments || !doctors) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    const appointment = appointments.find(a => a._id === appointmentId);
    const doctor = doctors.find(d => d._id === appointment?.doctorID);

    if (!appointment || !doctor) {
        return (
            <div className="text-center text-xl text-red-500 mt-20">
                Appointment or Doctor not found
            </div>
        );
    }

    // ================= FILE HANDLERS =================
    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!pdfFile) {
            Swal.fire({
                icon: "warning",
                title: "ফাইল নির্বাচন করুন",
                text: "অনুগ্রহ করে একটি PDF ফাইল নির্বাচন করুন",
            });
            return;
        }

        const formData = new FormData();
        formData.append("pdf", pdfFile);
        formData.append("appointmentId", appointmentId);

        try {
            setUploading(true);

            Swal.fire({
                title: "PDF আপলোড হচ্ছে...",
                text: "অনুগ্রহ করে অপেক্ষা করুন",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await fetch(`http://localhost:8000/api/upload-prescription/${appointmentId}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setPdfUrl(data.url);

            Swal.fire({
                icon: "success",
                title: "আপলোড সফল",
                text: "PDF সফলভাবে আপলোড হয়েছে",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "আপলোড ব্যর্থ",
                text: "PDF আপলোড করা যায়নি",
            });
        } finally {
            setUploading(false);
        }
    };

    // ================= DOWNLOAD PRESCRIPTION =================
    const downloadPdfFile = async () => {
        try {
            Swal.fire({
                title: "প্রেসক্রিপশন ডাউনলোড হচ্ছে...",
                text: "অনুগ্রহ করে অপেক্ষা করুন",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await pdfService.downloadPDF(appointmentId);
            const blob = new Blob([response.data], { type: "application/pdf" });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "prescription.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "ডাউনলোড সম্পন্ন",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "ডাউনলোড ব্যর্থ",
                text: "প্রেসক্রিপশন ডাউনলোড করা যায়নি",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    {/* Section 1: Appointment Information */}
                    <div className="bg-blue-100 p-6 mb-8 card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">অ্যাপয়েন্টমেন্ট সম্পর্কিত তথ্যসমূহঃ</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>মাধ্যমঃ</strong> <span className='bg-secondary-color text-white px-2 py-1 rounded-md text-sm'>{appointment.mode === 'online' ? "অনলাইন" : appointment.mode === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</span></p>
                            <p><strong>তারিখঃ</strong> {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString("en-BD", { day: "2-digit", month: "long", year: "numeric" }) : "Not available"}</p>
                            <p><strong>সময়ঃ</strong> {appointment.slot || "Not available"}</p>
                            <p><strong>ফিঃ</strong> {doctor.consultationFee} টাকা</p>
                            <p><strong>স্ট্যাটাসঃ</strong> <span className={`font-semibold ${appointment.state === "completed" ? "text-green-600" : "text-yellow-600"}`}>{appointment.state || "upcoming"}</span></p>

                            {/* Prescription Download Button */}
                            {prescription && (
                                <div className="mt-8">
                                    <button
                                        onClick={downloadPdfFile}
                                        className="w-full flex justify-center items-center bg-red-500 text-white py-3 rounded-md shadow-md hover:bg-red-600 transition-all duration-200"
                                    >
                                        <IoMdDownload className="text-xl mr-3" />
                                        <span className="text-lg font-semibold">প্রেসক্রিপশন ডাউনলোড করুন</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sections: Patient and Doctor Information in a Row */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Patient Information */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-md border border-green-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-1 h-8 bg-green-600 rounded"></span>
                                রোগীর তথ্যসমূহ
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                <div className="bg-white p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">রোগীর নাম</p>
                                    <p className="font-semibold text-lg">{appointment.patientName}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">মোবাইল</p>
                                    <p className="font-semibold">{appointment.phone}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">ইমেইল</p>
                                    <p className="font-semibold text-sm">{appointment.patientEmail}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">বয়স</p>
                                        <p className="font-semibold">{appointment.age} বছর</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">জেন্ডার</p>
                                        <p className="font-semibold">{appointment.gender === "male" ? "পুরুষ" : appointment.gender === "female" ? "মহিলা" : "অন্যান্য"}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">ব্লাড গ্রুপ</p>
                                        <p className="font-semibold">{appointment.bloodGroup}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">পেশা</p>
                                    <p className="font-semibold">{appointment.profession}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-2">সমস্যা/রোগের বিবরণ</p>
                                    <p className="text-gray-800">{appointment.problem}</p>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Information */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md border border-purple-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-1 h-8 bg-purple-600 rounded"></span>
                                ডাক্তার এর তথ্যসমূহ
                            </h2>
                            <div className="flex items-center gap-6 mb-6 bg-white p-4 rounded-lg">
                                <img
                                    src={doctor?.image || "https://i.ibb.co/ym2wsZXY/avater-Grey-User-Circles-Set.png"}
                                    alt="Doctor"
                                    className="w-28 h-28 object-cover rounded-full shadow-lg border-4 border-purple-200"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                                    <p className="text-md text-gray-600 font-semibold">{doctor.designation}</p>
                                    <p className="text-sm text-gray-600">{doctor.institute}</p>
                                    <p className="text-sm text-blue-600 mt-1">{doctor.degrees}</p>
                                    <p className="text-xs text-gray-500 mt-1">BMDC Reg No: {doctor.regNo}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500 mb-1">অভিজ্ঞতা</h3>
                                    <p className="font-semibold text-lg">{doctor.yearsOfExperience} বছর</p>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500 mb-1">দক্ষতাসমূহ</h3>
                                    <p className="font-semibold">{doctor.expertise}</p>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500 mb-1">সংক্ষিপ্ত পরিচয়</h3>
                                    <p className="text-sm text-gray-700">{doctor.shortBio}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-lg">
                                        <h3 className="text-sm text-gray-500 mb-2">রোগী দেখার মাধ্যম</h3>
                                        <span className='inline-block bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold'>{doctor.medium === 'online' ? "অনলাইন" : doctor.medium === 'offline' ? "অফলাইন" : "অনলাইন/অফলাইন"}</span>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg">
                                        <h3 className="text-sm text-gray-500 mb-2">পরামর্শ ফি</h3>
                                        <p className="font-semibold text-green-600 text-lg">৳ {doctor.consultationFee}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className=" mx-auto mt-10 bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-bold text-center mb-4">
                 প্রেসক্রিপশন আপলোড
                </h2>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full mb-4"
                />

                <button
                    onClick={handleUpload}
                    disabled={uploading || !pdfFile}
                    className={`w-full py-3 rounded-md text-white font-semibold
                            ${uploading || !pdfFile
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
                </button>

              
            </div>

        </div>
    );
}

export default AppointmentDetailsPatient;
