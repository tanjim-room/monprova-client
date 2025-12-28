import React, { useState, useEffect } from 'react';

import { X } from 'lucide-react';
import Swal from 'sweetalert2';

const DoctorProfile = () => {
    const savedProfile = JSON.parse(localStorage.getItem('doctorProfile')) || null;

    const [formData, setFormData] = useState(
        savedProfile || {
            image: null,
            fullName: '',
            specialization: '',
            designation: '',
            degrees: '',
            consultationFee: '',
            expertise: '',
            institute: '',
            regNo: '',
            yearsOfExperience: '',
            shortBio: '',
            medium: '',
            certificates: [null],
            email: '',
            mobileNo: '',
            bkashAccount: '',
        }
    );

    const [isEditing, setIsEditing] = useState(false);
    const [backupData, setBackupData] = useState(null);

    useEffect(() => {
        if (savedProfile) {
            setFormData(savedProfile);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleCertificateChange = (e, index) => {
        const files = e.target.files;
        const updated = [...formData.certificates];
        updated[index] = files[0];
        setFormData({ ...formData, certificates: updated });
    };

    const addCertificateField = () => {
        setFormData({ ...formData, certificates: [...formData.certificates, null] });
    };

    const removeCertificateField = (index) => {
        const updated = formData.certificates.filter((_, i) => i !== index);
        setFormData({ ...formData, certificates: updated });
    };

    // ✅ Save profile with double confirmation
    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmSave = await Swal.fire({
            title: 'আপনি কি নিশ্চিত?',
            text: 'আপনার প্রোফাইল সংরক্ষণ করতে চান?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, সংরক্ষণ করুন',
            cancelButtonText: 'না, বাতিল',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
        });

        if (confirmSave.isConfirmed) {
            const confirmFinal = await Swal.fire({
                title: 'শেষবার যাচাই করুন',
                text: 'আপনি কি সত্যিই প্রোফাইলটি সংরক্ষণ করতে চান?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'হ্যাঁ, নিশ্চিত',
                cancelButtonText: 'না, অপেক্ষা করুন',
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280',
            });

            if (confirmFinal.isConfirmed) {
                localStorage.setItem('doctorProfile', JSON.stringify(formData));

                await Swal.fire({
                    icon: 'success',
                    title: 'প্রোফাইল সংরক্ষণ হয়েছে!',
                    text: 'আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#2563eb',
                });

                setIsEditing(false);
                setBackupData(null);
            }
        }
    };

    const handleEdit = () => {
        setBackupData(formData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (backupData) setFormData(backupData);
        setIsEditing(false);
        setBackupData(null);
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
            
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl pb-8 mb-8 mt-16"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                ডাক্তারের প্রোফাইল
                </h2>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                    <label className="font-semibold mb-2">ছবি যোগ করুন</label>
                    <div className="avatar placeholder mb-3">
                        <div className="bg-gray-200 rounded-full w-36 h-36 flex items-center justify-center">
                            {formData.image ? (
                                <img
                                    src={
                                        formData.image instanceof File
                                            ? URL.createObjectURL(formData.image)
                                            : formData.image
                                    }
                                    alt="doctor"
                                    className="rounded-full w-36 h-36 object-cover"
                                />
                            ) : (
                                <span className="text-3xl"></span>
                            )}
                        </div>
                    </div>
                    {isEditing && (
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                            onChange={handleChange}
                        />
                    )}
                </div>

                {/* Fields with Labels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="label-text font-semibold mb-1">পূর্ণ নাম</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                            required
                        />
                    </div>
                    <div>
                         <label className="label-text font-semibold mb-1">পদবি</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            value={formData.degrees}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                            required
                        />
                    </div>
                    <div>
                       <label className="label-text font-semibold mb-1">বিশেষ দক্ষতা</label>
                        <input
                            type="text"
                            name="expertise"
                            value={formData.expertise}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            value={formData.consultationFee}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                            required
                        />
                    </div>
                    <div>
                         <label className="label-text font-semibold mb-1">রেজিস্ট্রেশন নাম্বার</label>
                        <input
                            type="text"
                            name="regNo"
                            value={formData.regNo}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            value={formData.institute}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                    <div>
                       <label className="label-text font-semibold mb-1">চেম্বারের ঠিকানা</label>
                        <input
                            type="text"
                            name="institute"
                            value={formData.institute}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="label-text font-semibold mb-1">অভিজ্ঞতার বছর</label>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                    <div>
                        <label className="label-text font-semibold mb-1">পরামর্শের মাধ্যম</label>
                        <select
                            name="medium"
                            value={formData.medium}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="select select-bordered w-full border-2 p-2"
                            required
                        >
                            <option value="">নির্বাচন করুন</option>
                            <option value="online">অনলাইন</option>
                            <option value="offline">অফলাইন</option>
                            <option value="both">উভয়ই</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="label-text font-semibold mb-1">ইমেইল</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                    <div>
                        <label className="label-text font-semibold mb-1">মোবাইল নাম্বার</label>
                        <input
                            type="text"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                    <div>
                        <label className="label-text font-semibold mb-1">বিকাশ নাম্বার</label>
                        <input
                            type="text"
                            name="bkashAccount"
                            value={formData.bkashAccount}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                </div>

                {/* Certificates */}
                <div className="mb-4">
                    <label className="label-text font-semibold mb-2">
                        সনদপত্র (Certificates)
                    </label>
                    {formData.certificates.map((cert, index) => (
                        <div key={index} className="mb-2 flex items-center gap-2">
                            {isEditing ? (
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    className="file-input file-input-bordered w-full border-2 p-2"
                                    onChange={(e) => handleCertificateChange(e, index)}
                                />
                            ) : (
                                cert && (
                                    <span className="text-sm text-green-600 truncate w-full">
                                        {cert.name || 'Uploaded File'}
                                    </span>
                                )
                            )}
                            {isEditing && formData.certificates.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCertificateField(index)}
                                    className="btn btn-sm btn-circle btn-error text-white bg-secondary-color"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={addCertificateField}
                            className="btn text-white btn-outline btn-sm mt-2 bg-primary-color p-2"
                        >
                            + আরেকটি সনদপত্র যোগ করুন
                        </button>
                    )}
                </div>

                <div className="mb-6">
                    <label className="label-text font-semibold mb-1">সংক্ষিপ্ত বায়ো</label>
                    <textarea
                        name="shortBio"
                        value={formData.shortBio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="textarea textarea-bordered w-full border-2 p-2"
                        rows="3"
                    ></textarea>
                </div>

                
                {/* Buttons */}
                <div className="space-y-3">

                    {!isEditing ? (
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
                            <button
                                type="submit"
                                className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4"
                            >
                                প্রোফাইল সংরক্ষণ করুন
                            </button>

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
    );
};

export default DoctorProfile;
