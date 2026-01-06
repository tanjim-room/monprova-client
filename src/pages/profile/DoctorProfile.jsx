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
    const [verificationStatus, setVerificationStatus] = useState("not-verified");
    const [isVerifying, setIsVerifying] = useState(false);

    // Safely check if doctor data is available
    const doctor = users?.find(dbUser => dbUser.email === user?.email) || {};  // Default to empty object if undefined
    const doctorInfo = doctors?.find(doctor => doctor.email === user?.email) || {};  // Default to empty object if undefined
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    
    // Update medium from doctorInfo when available
    useEffect(() => {
        // run only once when doctorInfo arrives
        if (doctorInfo ) {
            setMedium(doctorInfo.medium || "");
            setDivision(doctorInfo.division || "");
            setVerificationStatus(doctorInfo.verificationStatus || "not-verified");
        }
    }, [doctorInfo]);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
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
                shortBio,
                // Don't send verificationStatus - preserve it in database
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
        // Check if already pending or verified
        if (verificationStatus === 'pending') {
            return Swal.fire({
                icon: 'info',
                title: 'ইতিমধ্যে পাঠানো হয়েছে',
                text: 'আপনার ভেরিফিকেশন রিকুয়েস্ট ইতিমধ্যে অপেক্ষমাণ রয়েছে।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#2563eb',
            });
        }

        if (verificationStatus === 'verified') {
            return Swal.fire({
                icon: 'success',
                title: 'ইতিমধ্যে ভেরিফাইড',
                text: 'আপনার প্রোফাইল ইতিমধ্যে ভেরিফাইড হয়ে গেছে।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#16a34a',
            });
        }

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
            try {
                setIsVerifying(true);
                
                Swal.fire({
                    title: 'পাঠানো হচ্ছে...',
                    text: 'অনুগ্রহ করে অপেক্ষা করুন',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                const response = await axiosPublic.post('/api/doctors/request-verification', {
                    email: user?.email
                });

                if (response.data.success) {
                    // Update local state
                    setVerificationStatus('pending');
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'সফলভাবে পাঠানো হয়েছে!',
                        text: 'আপনার প্রোফাইল ভেরিফিকেশনের জন্য পাঠানো হয়েছে। অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।',
                        confirmButtonText: 'ঠিক আছে',
                        confirmButtonColor: '#16a34a',
                    });
                } else {
                    throw new Error(response.data.message || 'Failed to submit request');
                }
            } catch (error) {
                console.error('Error submitting verification request:', error);
                
                Swal.fire({
                    icon: 'error',
                    title: 'ত্রুটি!',
                    text: error.response?.data?.message || 'ভেরিফিকেশন রিকুয়েস্ট পাঠানো যায়নি। অনুগ্রহ করে আপনার প্রোফাইল সম্পূর্ণ করুন এবং পুনরায় চেষ্টা করুন।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#ef4444',
                });
            } finally {
                setIsVerifying(false);
            }
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
                                required
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
                                required
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
                    {/* Buttons */}
                    <div className="space-y-3">
                        {/* Show verification status badge */}
                        {verificationStatus && (
                            <div className={`text-center py-2 px-4 rounded-lg font-semibold ${
                                verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {verificationStatus === 'verified' ? '✓ আপনার প্রোফাইল ভেরিফাইড' :
                                 verificationStatus === 'pending' ? '⏳ ভেরিফিকেশন অপেক্ষমাণ' :
                                 verificationStatus === 'rejected' ? '✗ ভেরিফিকেশন প্রত্যাখ্যাত' :
                                 '○ প্রোফাইল ভেরিফাইড নয়'}
                            </div>
                        )}
                        
                        {!isEditable ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="btn btn-outline w-full flex gap-2 bg-secondary-color text-white py-4"
                                >
                                    প্রোফাইল এডিট করুন
                                </button>

                                {/* Show verify button only if not already verified or pending */}
                                {verificationStatus !== 'verified' && verificationStatus !== 'pending' && (
                                    <button
                                        type="button"
                                        onClick={handleVerify}
                                        disabled={isVerifying}
                                        className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4 disabled:opacity-50"
                                    >
                                        {isVerifying ? 'পাঠানো হচ্ছে...' : 
                                         verificationStatus === 'rejected' ? 'পুনরায় ভেরিফাই করুন' : 
                                         'প্রোফাইল ভেরিফাই করুন'}
                                    </button>
                                )}
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