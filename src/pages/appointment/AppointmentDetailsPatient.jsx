import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import usePrescription from "../../hooks/usePrescription";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { IoMdDownload } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
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

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [shareWithDoctor, setShareWithDoctor] = useState(false);

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
                                        onClick={handleUpload}
                                        className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "আপলোড করুন"}
                                    </button>
                                </div>
                                {uploadMessage && (
                                    <p className="mt-2 text-sm text-green-700">{uploadMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="bg-purple-50 p-6 rounded-lg shadow flex-1 hover:shadow-lg transition-all duration-200">
                        <h2 className="text-xl font-semibold text-purple-700 mb-4">
                            ডাক্তার এর তথ্য
                        </h2>
                        <div className="flex items-center gap-6 mb-6">
                            <img
                                src={
                                    doctor?.image ||
                                    "https://i.ibb.co/ym2wsZXY/avater-Grey-User-Circles-Set.png"
                                }
                                alt="Doctor"
                                className="w-32 h-32 object-cover rounded-full shadow-md"
                            />
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">{doctor.name}</h3>
                                <p>{doctor.designation}</p>
                                <p>{doctor.institute}</p>
                                <p>{doctor.degrees}</p>
                                <p className="text-sm text-gray-500">BMDC Reg No: {doctor.regNo}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>অভিজ্ঞতা:</strong> {doctor.yearsOfExperience} বছর
                            </p>
                            <p>
                                <strong>দক্ষতাসমূহ:</strong> {doctor.expertise}
                            </p>
                            <p>
                                <strong>সংক্ষিপ্ত পরিচয়:</strong> {doctor.shortBio}
                            </p>
                            <p>
                                <strong>রোগী দেখার মাধ্যম:</strong>{" "}
                                <span className="bg-purple-500 text-white px-2 py-1 rounded">
                                    {doctor.medium === "online"
                                        ? "অনলাইন"
                                        : doctor.medium === "offline"
                                        ? "অফলাইন"
                                        : "অনলাইন/অফলাইন"}
                                </span>
                            </p>
                            <p>
                                <strong>পরামর্শ ফি:</strong> {doctor.consultationFee} টাকা
                            </p>
                        </div>
                    </div>

                {/* Prescriptions List */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">আপনার আগের প্রেসক্রিপশনসমূহ</h3>
                    {patientPrescriptions.length === 0 ? (
                        <p className="text-gray-600">কোনো প্রেসক্রিপশন পাওয়া যায়নি।</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {patientPrescriptions.map((p) => (
                                <div
                                    key={p._id}
                                    className="p-4 border rounded-md bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div>
                                        <p className="font-semibold">{p.diagnosis || "প্রেসক্রিপশন"}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(p.updatedAt || p.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    `http://localhost:8000/api/prescription/${p.appointmentID}/pdf`,
                                                    "_blank"
                                                )
                                            }
                                            className="bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600 transition-all duration-200"
                                        >
                                            ডাউনলোড
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
};

export default AppointmentDetailsPatient;
