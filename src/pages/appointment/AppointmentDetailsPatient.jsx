import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAppointment from "../../hooks/useAppointment";
import useDoctor from "../../hooks/useDoctor";
import usePrescription from "../../hooks/usePrescription";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { IoMdDownload } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

const AppointmentDetailsPatient = () => {
    const [appointments] = useAppointment();
    const [doctors] = useDoctor();
    const [prescriptions] = usePrescription();
    const axiosPublic = useAxiosPublic();
    const { appointmentId } = useParams();

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [shareWithDoctor, setShareWithDoctor] = useState(false);

    if (!appointments || !doctors) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
            </div>
        );
    }

    const appointment = appointments.find((a) => a._id === appointmentId);
    const doctor = doctors.find((d) => d._id === appointment?.doctorID);

    useEffect(() => {
        setUploadMessage("");
    }, [appointmentId]);

    if (!appointment || !doctor) {
        return (
            <div className="text-center text-xl text-red-500 mt-20">
                <p>Appointment or doctor not found</p>
            </div>
        );
    }

    const patientPrescriptions = prescriptions?.filter(
        (p) => p.patientID === appointment.patientID
    ) || [];

    const onDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropped = Array.from(e.dataTransfer.files || []);
        const pdfs = dropped.filter(
            (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
        );
        setFiles((prev) => [...prev, ...pdfs]);
    }, []);

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || []);
        const pdfs = selected.filter(
            (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
        );
        setFiles((prev) => [...prev, ...pdfs]);
    };

    const removeFile = (index) =>
        setFiles((prev) => prev.filter((_, i) => i !== index));

    const handleUpload = async () => {
        if (files.length === 0) {
            setUploadMessage("কোনো ফাইল নির্বাচন করা হয়নি");
            return;
        }
        setUploading(true);
        setUploadMessage("");
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));
            formData.append("patientID", appointment.patientID);
            formData.append("doctorID", appointment.doctorID);
            formData.append("appointmentID", appointment._id);
            formData.append("sharedWithDoctor", shareWithDoctor ? "true" : "false");

            await axiosPublic.post("/api/prescriptions/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUploadMessage("ফাইল আপলোড সফল হয়েছে");
            setFiles([]);
        } catch (err) {
            console.error(err);
            setUploadMessage("আপলোডে ত্রুটি হয়েছে, পরে আবার চেষ্টা করুন");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-8">
                {/* Appointment Info */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                        অ্যাপয়েন্টমেন্ট সম্পর্কিত তথ্য
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p>
                            <strong>মাধ্যমঃ</strong>{" "}
                            <span className="bg-indigo-500 text-white px-2 py-1 rounded">
                                {appointment.mode === "online"
                                    ? "অনলাইন"
                                    : appointment.mode === "offline"
                                    ? "অফলাইন"
                                    : "অনলাইন/অফলাইন"}
                            </span>
                        </p>
                        <p>
                            <strong>তারিখঃ</strong>{" "}
                            {appointment.appointmentDate
                                ? new Date(appointment.appointmentDate).toLocaleDateString(
                                      "en-BD",
                                      { day: "2-digit", month: "long", year: "numeric" }
                                  )
                                : "Not available"}
                        </p>
                        <p>
                            <strong>সময়ঃ</strong> {appointment.slot || "Not available"}
                        </p>
                        <p>
                            <strong>ফিঃ</strong> {doctor.consultationFee} টাকা
                        </p>
                        <p>
                            <strong>স্ট্যাটাসঃ</strong>{" "}
                            <span
                                className={`font-semibold ${
                                    appointment.state === "completed"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                }`}
                            >
                                {appointment.state || "upcoming"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Patient & Doctor Info */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Patient Info */}
                    <div className="bg-green-50 p-6 rounded-lg shadow flex-1 hover:shadow-lg transition-all duration-200">
                        <h2 className="text-xl font-semibold text-green-700 mb-4">
                            রোগীর তথ্য
                        </h2>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>নামঃ</strong> {appointment.patientName}
                            </p>
                            <p>
                                <strong>মোবাইলঃ</strong> {appointment.phone}
                            </p>
                            <p>
                                <strong>ইমেইলঃ</strong> {appointment.patientEmail}
                            </p>
                            <p>
                                <strong>বয়সঃ</strong> {appointment.age} বছর
                            </p>
                            <p>
                                <strong>জেন্ডারঃ</strong>{" "}
                                {appointment.gender === "male"
                                    ? "পুরুষ"
                                    : appointment.gender === "female"
                                    ? "মহিলা"
                                    : "অন্যান্য"}
                            </p>
                            <p>
                                <strong>ব্লাড গ্রুপঃ</strong> {appointment.bloodGroup}
                            </p>
                            <p>
                                <strong>পেশাঃ</strong> {appointment.profession}
                            </p>
                            <p>
                                <strong>সমস্যা/রোগের বিবরণঃ</strong>{" "}
                                {appointment.problem}
                            </p>
                        </div>

                        {/* Upload Prescription */}
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">পূর্বের প্রেসক্রিপশন আপলোড করুন (PDF)</h3>
                            <div
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                className="border-2 border-dashed rounded-md p-6 text-center bg-white"
                            >
                                <p className="mb-2">
                                    ফাইল এখানে টেনে আনুন অথবা নিচের বাটন ব্যবহার করুন
                                </p>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    onChange={handleFileChange}
                                    className="mb-3"
                                />
                                {files.length > 0 && (
                                    <div className="text-left space-y-2">
                                        {files.map((f, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                                            >
                                                <span className="truncate">{f.name}</span>
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mt-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={shareWithDoctor}
                                            onChange={(e) => setShareWithDoctor(e.target.checked)}
                                        />
                                        <span>ডাক্তারের সাথে একসাথে শেয়ার করুন</span>
                                    </label>
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
        </div>
    );
};

export default AppointmentDetailsPatient;
