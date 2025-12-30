import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useDoctor from '../../hooks/useDoctor';

const DoctorProfile = () => {
    const axiosPublic = useAxiosPublic();
    const [users] = useUser();
    const [doctors] = useDoctor();
    const { user } = useAuth(); // Get the current logged-in user from useAuth
    const [isEditable, setIsEditable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Safely check if doctor data is available
    const doctor = users?.find(dbUser => dbUser.email === user?.email) || {};  // Default to empty object if undefined
    const doctorInfo = doctors?.find(doctor => doctor.email === user?.email) || {};  // Default to empty object if undefined

    // ✅ Save profile with double confirmation
    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const designation = form.designation.value;
        const degrees = form.degrees.value;
        const expertise = form.expertise.value;
        const consultationFee = form.consultationFee.value;
        const regNo = form.regNo.value;
        const institute = form.institute.value;
        const chamber = form.chamber.value;
        const yearsOfExperience = form.yearsOfExperience.value;
        const medium = form.medium.value;
        const mobileNo = form.mobileNo.value;
        const bkashAccount = form.bkashAccount.value;
        const shortBio = form.shortBio.value;

        const doctorData = {
            name,
            email,
            designation,
            degrees,
            expertise,
            consultationFee,
            regNo,
            institute,
            chamber,
            yearsOfExperience,
            medium,
            mobileNo,
            bkashAccount,
            shortBio,
            status: '',
            createdAt: new Date(),
        };

        const confirmResult = await Swal.fire({
            title: 'আপনি কি নিশ্চিত?',
            text: 'আপনার প্রোফাইল সংরক্ষণ করতে চান?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, সংরক্ষণ করুন',
            cancelButtonText: 'না, বাতিল',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
        });

        if (!confirmResult.isConfirmed) return;

        // Basic validation
        if (!doctorData.name) {
            return Swal.fire({
                icon: 'error',
                title: 'ত্রুটি!',
                text: 'নাম এবং ইমেইল আবশ্যক।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#2563eb',
            });
        }

        try {
            setIsSaving(true);

            // Send the updated profile data to the backend
            const response = await axiosPublic.post('/api/doctor', doctorData);

            Swal.fire({
                icon: 'success',
                title: '✅ প্রোফাইল সংরক্ষণ হয়েছে!',
                text: 'আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।',
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#2563eb',
            });

            setIsEditable(false); // Disable editing after save
        } catch (err) {
            console.error('Error saving profile:', err);

            let errorMessage = 'প্রোফাইল সংরক্ষণ করা যায়নি।';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'ত্রুটি!',
                text: errorMessage,
                confirmButtonText: 'ঠিক আছে',
                confirmButtonColor: '#2563eb',
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
                            {/* Display doctor image */}
                            {/* {doctorInfo?.image && (
                <img
                  src={doctorInfo?.image}
                  alt="doctor"
                  className="rounded-full w-36 h-36 object-cover"
                />
              )} */}
                        </div>
                    </div>
                    {isEditable && (
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                        />
                    )}
                </div>

                {/* Fields with Labels */}
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
                        <label className="label-text font-semibold mb-1">অভিজ্ঞতার বছর</label>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            defaultValue={doctorInfo?.yearsOfExperience || ''} // Default to empty if undefined
                            disabled={!isEditable}
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
                    <div>
                        <label className="label-text font-semibold mb-1">পরামর্শের মাধ্যম</label>
                        <select
                            name="medium"
                            value={doctorInfo?.medium || ''} // Controlled value
                            disabled={!isEditable}
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
                            defaultValue={doctor?.email || ''} // Default to empty if undefined
                            disabled
                            className="input input-bordered w-full border-2 p-2"
                        />
                    </div>
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
    );
};

export default DoctorProfile;
