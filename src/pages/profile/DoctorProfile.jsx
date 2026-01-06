import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useDoctor from '../../hooks/useDoctor';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const DoctorProfile = () => {
    const axiosPublic = useAxiosPublic();
    // const initialized = useRef(false); // Ref to track initialization
    const [users] = useUser();
    const [doctors] = useDoctor();
    const { user } = useAuth(); // Get the current logged-in user from useAuth
    const [isEditable, setIsEditable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [medium, setMedium] = useState("");
    const [division, setDivision] = useState("")

    // Safely check if doctor data is available
    const doctor = users?.find(dbUser => dbUser.email === user?.email) || {};  // Default to empty object if undefined
    const doctorInfo = doctors?.find(doctor => doctor.email === user?.email) || {};  // Default to empty object if undefined
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // NID Image States
    const [nidFrontImage, setNidFrontImage] = useState(null);
    const [nidFrontPreview, setNidFrontPreview] = useState("");
    const [nidBackImage, setNidBackImage] = useState(null);
    const [nidBackPreview, setNidBackPreview] = useState("");
    const [deletedNidFront, setDeletedNidFront] = useState(false);
    const [deletedNidBack, setDeletedNidBack] = useState(false);

    // Certificates States
    const [certificateFields, setCertificateFields] = useState([{ id: 1, file: null, preview: "" }]);
    const [nextCertId, setNextCertId] = useState(2);
    const [deletedCertificates, setDeletedCertificates] = useState([]);
    
    // Update medium from doctorInfo when available
    useEffect(() => {
        // run only once when doctorInfo arrives
        if (doctorInfo ) {
            setMedium(doctorInfo.medium || "");
            setDivision(doctorInfo.division || "");
        }
    }, [doctorInfo]);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // NID Front Image Handler
    const handleNidFrontChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNidFrontImage(file);
        setNidFrontPreview(URL.createObjectURL(file));
    };

    // NID Back Image Handler
    const handleNidBackChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNidBackImage(file);
        setNidBackPreview(URL.createObjectURL(file));
    };

    // Certificate Image Handler
    const handleCertificateChange = (e, fieldId) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCertificateFields(certificateFields.map(field =>
            field.id === fieldId
                ? { ...field, file, preview: URL.createObjectURL(file) }
                : field
        ));
    };

    // Add New Certificate Field
    const addCertificateField = () => {
        const totalCerts = certificateFields.length + (doctorInfo?.certificates?.length || 0);
        if (totalCerts >= 10) {
            Swal.fire({
                icon: "error",
                title: "ত্রুটি!",
                text: "সর্বোচ্চ ১০টি সার্টিফিকেট আপলোড করতে পারবেন।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#2563eb",
            });
            return;
        }

        setCertificateFields([
            ...certificateFields,
            { id: nextCertId, file: null, preview: "" }
        ]);
        setNextCertId(nextCertId + 1);
    };

    // Remove Certificate Field
    const removeCertificateField = (fieldId) => {
        if (certificateFields.length === 1) {
            Swal.fire({
                icon: "warning",
                title: "সতর্কতা!",
                text: "অন্তত একটি সার্টিফিকেট ফিল্ড প্রয়োজন।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#2563eb",
            });
            return;
        }

        setCertificateFields(certificateFields.filter(field => field.id !== fieldId));
    };

    // Delete NID Front Image
    const deleteNidFront = () => {
        const confirmDelete = Swal.fire({
            title: 'এনআইডি সামনের দিক মুছবেন?',
            text: 'এটি মুছে দেওয়া হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });
        confirmDelete.then((result) => {
            if (result.isConfirmed) {
                setDeletedNidFront(true);
                setNidFrontPreview("");
                setNidFrontImage(null);
                Swal.fire({
                    icon: 'success',
                    title: 'মুছা হয়েছে!',
                    text: 'এনআইডি সামনের দিক মুছে দেওয়া হয়েছে।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#2563eb',
                });
            }
        });
    };

    // Delete NID Back Image
    const deleteNidBack = () => {
        const confirmDelete = Swal.fire({
            title: 'এনআইডি পিছনের দিক মুছবেন?',
            text: 'এটি মুছে দেওয়া হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });
        confirmDelete.then((result) => {
            if (result.isConfirmed) {
                setDeletedNidBack(true);
                setNidBackPreview("");
                setNidBackImage(null);
                Swal.fire({
                    icon: 'success',
                    title: 'মুছা হয়েছে!',
                    text: 'এনআইডি পিছনের দিক মুছে দেওয়া হয়েছে।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#2563eb',
                });
            }
        });
    };

    // Delete Certificate from existing
    const deleteExistingCertificate = (index) => {
        const confirmDelete = Swal.fire({
            title: 'সার্টিফিকেট মুছবেন?',
            text: 'এটি মুছে দেওয়া হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });
        confirmDelete.then((result) => {
            if (result.isConfirmed) {
                setDeletedCertificates([...deletedCertificates, index]);
                Swal.fire({
                    icon: 'success',
                    title: 'মুছা হয়েছে!',
                    text: 'সার্টিফিকেট মুছে দেওয়া হয়েছে।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#2563eb',
                });
            }
        });
    };

    // Delete new NID Front preview (before save)
    const deleteNewNidFront = () => {
        setNidFrontImage(null);
        setNidFrontPreview("");
    };

    // Delete new NID Back preview (before save)
    const deleteNewNidBack = () => {
        setNidBackImage(null);
        setNidBackPreview("");
    };

    // Delete new certificate field preview (before save)
    const deleteNewCertificatePreview = (fieldId) => {
        setCertificateFields(certificateFields.map(field =>
            field.id === fieldId
                ? { ...field, file: null, preview: "" }
                : field
        ));
    };

     // State for medium
    
    // ✅ Save profile with double confirmation
    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const designation = form.designation.value.trim();
        const degrees = form.degrees.value.trim();
        const expertise = form.expertise.value.trim();
        const consultationFee = form.consultationFee.value;
        const regNo = form.regNo.value.trim();
        const institute = form.institute.value.trim();
        const chamber = form.chamber.value.trim();
        const division = form.division.value;
        const yearsOfExperience = form.yearsOfExperience.value;
        const mediumValue = form.medium.value;
        const mobileNo = form.mobileNo.value.trim();
        const nidNo = form.nidNo.value.trim();
        const bkashAccount = form.bkashAccount.value.trim();
        const shortBio = form.shortBio.value.trim();

        // ✅ Basic validation (doctorData নয়)
        if (!name || !email) {
            return Swal.fire({
                icon: "error",
                title: "ত্রুটি!",
                text: "নাম এবং ইমেইল আবশ্যক।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#2563eb",
            });
        }

        const confirmResult = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "আপনার প্রোফাইল সংরক্ষণ করতে চান?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "হ্যাঁ, সংরক্ষণ করুন",
            cancelButtonText: "না, বাতিল",
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            setIsSaving(true);

            // ✅ Nice: loading indicator


            // ✅ Image upload only if new image selected
            let imageUrl = doctorInfo?.image || doctor?.image || "";
            let nidFrontUrl = deletedNidFront ? "" : (doctorInfo?.nidFront || "");
            let nidBackUrl = deletedNidBack ? "" : (doctorInfo?.nidBack || "");
            let certificateUrls = [];

            // Handle deleted certificates
            if (doctorInfo?.certificates && doctorInfo.certificates.length > 0) {
                certificateUrls = doctorInfo.certificates.filter((_, index) => !deletedCertificates.includes(index));
            }

            Swal.fire({
                title: "সেভ হচ্ছে...",
                text: "অনুগ্রহ করে অপেক্ষা করুন",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (selectedImage) {
                const imageData = new FormData();
                imageData.append("image", selectedImage);

                const imgbbRes = await axiosPublic.post(image_hosting_api, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                imageUrl = imgbbRes?.data?.data?.display_url || imageUrl;
            }

            // Upload NID Front
            if (nidFrontImage) {
                const imageData = new FormData();
                imageData.append("image", nidFrontImage);

                const imgbbRes = await axiosPublic.post(image_hosting_api, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                nidFrontUrl = imgbbRes?.data?.data?.display_url || nidFrontUrl;
            }

            // Upload NID Back
            if (nidBackImage) {
                const imageData = new FormData();
                imageData.append("image", nidBackImage);

                const imgbbRes = await axiosPublic.post(image_hosting_api, imageData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                nidBackUrl = imgbbRes?.data?.data?.display_url || nidBackUrl;
            }

            // Upload Certificates
            if (certificateFields.some(field => field.file)) {
                const newCertUrls = [];
                for (const field of certificateFields) {
                    if (field.file) {
                        const imageData = new FormData();
                        imageData.append("image", field.file);

                        const imgbbRes = await axiosPublic.post(image_hosting_api, imageData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });

                        newCertUrls.push(imgbbRes?.data?.data?.display_url);
                    }
                }
                // Append new certificates to existing (after filtering deleted ones)
                certificateUrls = [...certificateUrls, ...newCertUrls];
            }

            const doctorData = {
                name,
                image: imageUrl,
                email,
                designation,
                degrees,
                expertise,
                consultationFee,
                regNo,
                institute,
                chamber,
                division,
                yearsOfExperience,
                medium: mediumValue,
                mobileNo,
                bkashAccount,
                nidNo,
                nidFront: nidFrontUrl,
                nidBack: nidBackUrl,
                certificates: certificateUrls,
                shortBio,
                status: "",
            };

            await axiosPublic.post("/api/doctor", doctorData);

            Swal.fire({
                icon: "success",
                title: "প্রোফাইল সংরক্ষণ হয়েছে!",
                text: "আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#16a34a",
            });

            setIsEditable(false);

            // optional reset preview after save
            setSelectedImage(null);
            setImagePreview("");
            setNidFrontImage(null);
            setNidFrontPreview("");
            setNidBackImage(null);
            setNidBackPreview("");
            setDeletedNidFront(false);
            setDeletedNidBack(false);
            setCertificateFields([{ id: 1, file: null, preview: "" }]);
            setNextCertId(2);
            setDeletedCertificates([]);
        } catch (err) {
            console.error("Error saving profile:", err);

            Swal.fire({
                icon: "error",
                title: "ত্রুটি!",
                text: err.response?.data?.message || "প্রোফাইল সংরক্ষণ করা যায়নি।",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#2563eb",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleCancel = () => {
        setIsEditable(false);
    };

    const handleVerify = async () => {
        const confirmVerify = await Swal.fire({
            title: 'প্রোফাইল ভেরিফিকেশন',
            text: 'আপনি কি প্রোফাইল ভেরিফিকেশনের জন্য পাঠাতে চান?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, পাঠান',
            cancelButtonText: 'না, এখনই না',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
        });

        if (confirmVerify.isConfirmed) {
            Swal.fire({
                icon: 'info',
                title: 'ভেরিফিকেশন প্রক্রিয়া শুরু হয়েছে!',
                text: 'আপনার প্রোফাইল ভেরিফিকেশনের জন্য পাঠানো হয়েছে।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#2563eb',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#E6F0FF]">
            <div className="mx-auto p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 my-4 mb-4">
                    ডাক্তারের প্রোফাইল
                </h2>

                {/* Profile Picture */}
                <div className="flex flex-col items-center">

                    <div className="avatar placeholder">
                        <div className="bg-gray-200 rounded-full w-36 h-36 flex items-center justify-center border-2">
                            <img
                                src={
                                    imagePreview ||
                                    doctorInfo?.image ||
                                    doctor?.image ||
                                    "https://via.placeholder.com/150"
                                }
                                alt="doctor"
                                className="rounded-full w-36 h-36 object-cover"
                            />
                        </div>

                    </div>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl pb-8 mb-8"
                >


                    {/* Fields with Labels */}
                    <div className="mt-2 mb-4 flex justify-center">
                        <div className="w-full max-w-xs mb-2">
                            <label className="block text-center mb-2 text-sm font-semibold">
                                প্রোফাইল ছবি দিন
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                accept="image/*"
                                disabled={!isEditable}
                                className="file-input file-input-bordered w-full border-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">নাম</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={doctorInfo?.name || doctor?.name} // Default value fallback
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">পদবি</label>
                            <input
                                type="text"
                                name="designation"
                                defaultValue={doctorInfo?.designation || doctor?.designation} // Default value fallback
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">ডিগ্রি</label>
                            <input
                                type="text"
                                name="degrees"
                                defaultValue={doctorInfo?.degrees || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">বিশেষ দক্ষতা</label>
                            <input
                                type="text"
                                name="expertise"
                                defaultValue={doctorInfo?.expertise || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">পরামর্শ ফি (টাকা)</label>
                            <input
                                type="number"
                                name="consultationFee"
                                defaultValue={doctorInfo?.consultationFee || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">রেজিস্ট্রেশন নাম্বার</label>
                            <input
                                type="text"
                                name="regNo"
                                defaultValue={doctorInfo?.regNo || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">প্রতিষ্ঠান</label>
                            <input
                                type="text"
                                name="institute"
                                defaultValue={doctorInfo?.institute || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">চেম্বারের ঠিকানা</label>
                            <input
                                type="text"
                                name="chamber"
                                defaultValue={doctorInfo?.chamber || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">বিভাগ</label>
                            <select
                                name="division"
                                value={division} // Controlled value
                                onChange={(e) => setDivision(e.target.value)} // Handle value change
                                className="select select-bordered w-full border-2 p-2"
                                
                                disabled={!isEditable} // Control editability
                            >
                                <option value="">নির্বাচন করুন</option>
                                <option value="Dhaka">ঢাকা</option>
                                <option value="Chattogram">চট্টগ্রাম</option>
                                <option value="Rajshahi">রাজশাহী</option>
                                <option value="Khulna">খুলনা</option>
                                <option value="Barishal">বরিশাল</option>
                                <option value="Sylhet">সিলেট</option>
                                <option value="Mymensingh">ময়মনসিংহ</option>
                                <option value="Rangpur">রংপুর</option>
                            </select>
                        </div>
                    </div>
                

                    {/* Medium Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">অভিজ্ঞতার বছর</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                defaultValue={doctorInfo?.yearsOfExperience || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label-text font-semibold mb-1">পরামর্শের মাধ্যম</label>
                            <select
                                name="medium"
                                value={medium} // Controlled value
                                onChange={(e) => setMedium(e.target.value)} // Handle value change
                                disabled={!isEditable}
                                className="select select-bordered w-full border-2 p-2"
                                
                                 // Control editability
                            >
                                <option value="">নির্বাচন করুন</option>
                                <option value="online">অনলাইন</option>
                                <option value="offline">অফলাইন</option>
                                <option value="both">উভয়ই</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">ইমেইল</label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={doctor?.email || ''} // Default to empty if undefined
                                disabled
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">এনআইডি নাম্বার</label>
                            <input
                                type="number"
                                name="nidNo"
                                defaultValue={doctor?.nidNo || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label-text font-semibold mb-1">মোবাইল নাম্বার</label>
                            <input
                                type="text"
                                name="mobileNo"
                                defaultValue={doctorInfo?.mobileNo || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                        <div>
                            <label className="label-text font-semibold mb-1">বিকাশ নাম্বার</label>
                            <input
                                type="text"
                                name="bkashAccount"
                                defaultValue={doctorInfo?.bkashAccount || ''} // Default to empty if undefined
                                disabled={!isEditable}
                                className="input input-bordered w-full border-2 p-2"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="label-text font-semibold mb-1">সংক্ষিপ্ত বায়ো</label>
                        <textarea
                            name="shortBio"
                            defaultValue={doctorInfo?.shortBio || ''} // Default to empty if undefined
                            disabled={!isEditable}
                            className="textarea textarea-bordered w-full border-2 p-2"
                            rows="3"
                        ></textarea>
                    </div>
                    {/* NID Upload Section */}
                    <div className="mb-6 border-t-2 pt-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">এনআইডি আপলোড করুন</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* NID Front */}
                            <div>
                                <label className="label-text font-semibold mb-2 block">এনআইডির সামনের দিক</label>
                                {nidFrontPreview ? (
                                    <div className="mb-2 relative">
                                        <img src={nidFrontPreview} alt="NID Front Preview" className="w-full h-40 object-cover rounded border-2" />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={deleteNewNidFront}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ) : doctorInfo?.nidFront && !deletedNidFront ? (
                                    <div className="mb-2 relative">
                                        <img src={doctorInfo.nidFront} alt="NID Front" className="w-full h-40 object-cover rounded border-2" />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={deleteNidFront}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ) : null}
                                <input
                                    type="file"
                                    onChange={handleNidFrontChange}
                                    accept="image/*"
                                    disabled={!isEditable}
                                    className="file-input file-input-bordered w-full border-2"
                                />
                            </div>

                            {/* NID Back */}
                            <div>
                                <label className="label-text font-semibold mb-2 block">এনআইডির পিছনের দিক</label>
                                {nidBackPreview ? (
                                    <div className="mb-2 relative">
                                        <img src={nidBackPreview} alt="NID Back Preview" className="w-full h-40 object-cover rounded border-2" />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={deleteNewNidBack}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ) : doctorInfo?.nidBack && !deletedNidBack ? (
                                    <div className="mb-2 relative">
                                        <img src={doctorInfo.nidBack} alt="NID Back" className="w-full h-40 object-cover rounded border-2" />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={deleteNidBack}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ) : null}
                                <input
                                    type="file"
                                    onChange={handleNidBackChange}
                                    accept="image/*"
                                    disabled={!isEditable}
                                    className="file-input file-input-bordered w-full border-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Certificates Upload Section */}
                    <div className="mb-6 border-t-2 pt-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">সার্টিফিকেট আপলোড করুন</h3>
                        <p className="text-sm text-gray-600 mb-4">সর্বনিম্ন ১টি এবং সর্বোচ্চ ১০টি সার্টিফিকেট আপলোড করুন</p>

                        {/* Display existing certificates */}
                        {doctorInfo?.certificates && doctorInfo.certificates.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">বিদ্যমান সার্টিফিকেট</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {doctorInfo.certificates.map((cert, index) => (
                                        !deletedCertificates.includes(index) && (
                                            <div key={`existing-${index}`} className="relative">
                                                <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-32 object-cover rounded border-2" />
                                                <span className="absolute bottom-1 left-1 bg-green-500 text-white px-2 py-1 rounded text-xs">বিদ্যমান</span>
                                                {isEditable && (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExistingCertificate(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificate Upload Fields */}
                        <div className="space-y-4">
                            {certificateFields.map((field, index) => (
                                <div key={field.id} className="border-2 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="label-text font-semibold">সার্টিফিকেট {index + 1}</label>
                                        {certificateFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCertificateField(field.id)}
                                                className="btn btn-sm btn-error text-white flex gap-1"
                                                disabled={!isEditable}
                                            >
                                                <X size={16} />
                                                সরান
                                            </button>
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    {field.preview && (
                                        <div className="mb-3 relative">
                                            <img src={field.preview} alt={`Preview ${field.id}`} className="w-full h-40 object-cover rounded border-2" />
                                            {isEditable && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteNewCertificatePreview(field.id)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleCertificateChange(e, field.id)}
                                        disabled={!isEditable}
                                        className="file-input file-input-bordered w-full border-2"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Add Button */}
                        {isEditable && (certificateFields.length + (doctorInfo?.certificates?.length || 0) < 10) && (
                            <button
                                type="button"
                                onClick={addCertificateField}
                                className="mt-4 btn btn-outline btn-primary w-full"
                            >
                                + আরও সার্টিফিকেট যোগ করুন
                            </button>
                        )}

                        {/* Certificate Counter */}
                        <p className="text-xs text-gray-500 mt-3">
                            মোট: ({certificateFields.filter(f => f.file).length + (doctorInfo?.certificates?.length || 0)}/10) আপলোড করা হয়েছে
                        </p>
                    </div>                    {/* Buttons */}
                    <div className="space-y-3">
                        {!isEditable ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="btn btn-outline w-full flex gap-2 bg-secondary-color text-white py-4"
                                >
                                    প্রোফাইল এডিট করুন
                                </button>

                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4"
                                >
                                    প্রোফাইল ভেরিফাই করুন
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn bg-primary-color text-white w-full px-8"
                                    value="সংরক্ষণ করুন"
                                />
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-outline w-full flex gap-2 bg-secondary-color text-white py-4"
                                >
                                    বাতিল করুন
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;