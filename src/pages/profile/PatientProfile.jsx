import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';

const PatientProfile = () => {
  const { user } = useAuth(); // your auth hook
  // const [profile, setProfile] = useState({
  //   name: user?.name || "",
  //   email: user?.email || "",
  // });

  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile from backend
  // useEffect(() => {
  //   if (!user?.email) return;

  //   axios.get(`http://localhost:8000/api/patient/${user.email}`)
  //     .then(res => {
  //       if (res.data) {
  //         setProfile(res.data);
  //       }
  //     })
  //     .catch(err => console.log("Error fetching profile:", err));
  // }, [user?.email]);


  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setProfile(prev => ({ ...prev, profilePicture: reader.result })); // save as Base64
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleSave = async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = form.name.value;
    const age = form.age.value;
    const gender = form.gender.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const bloodGroup = form.bloodGroup.value;
    const address = form.address.value;
    const emergencyContact = form.emergencyContact.value;
    const profession = form.profession.value;

    const profile = {name, age, gender, phone, email, bloodGroup, address, emergencyContact, profession}

    fetch('http://localhost:8000//api/patient', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(profile)

    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
  })


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
    if (0) { /*!profile.name || !profile.email*/
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
      // console.log("Saving profile:", profile);

      // const res = await axios.post("http://localhost:8000/api/patient", profile);

      // console.log("Profile saved:", res.data);

      setIsEditable(false);
      Swal.fire({
        icon: 'success',
        title: '✅ প্রোফাইল সংরক্ষণ হয়েছে!',
        text: 'আপনার প্রোফাইল সফলভাবে সংরক্ষণ হয়েছে।',
        confirmButtonText: 'ঠিক আছে',
        confirmButtonColor: '#2563eb',
      });
    } catch (err) {
      console.error("Error saving profile:", err);

      let errorMessage = "প্রোফাইল সংরক্ষণ করা যায়নি।";
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

  return (
    <div className="min-h-screen p-16 bg-[#E1ECFF] mt-16">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-semibold text-center mb-8">
          রোগীর প্রোফাইল
        </h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-2 overflow-hidden">
            <img
              src={"https://via.placeholder.com/150"} /* ||profile.profilePicture*/
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Upload */}
          <div className="flex justify-center mb-6">
            <input
              type="file"
              // onChange={handleFileChange}
              // disabled={!isEditable || isSaving}
              className="file-input file-input-bordered"
            />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label">পূর্ণ নাম</label>
              <input
                name="name"
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">বয়স</label>
              <input
                name="age"
                // value={profile.age}
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">জেন্ডার</label>
              <select
                name="gender"
                // value={profile.gender}
                disabled={!isEditable}
                className="select select-bordered w-full border-2 p-2"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="label">মোবাইল</label>
              <input
                name="phone"
                // value={profile.phone}
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">ইমেইল</label>
              <input
                type="email"
                name="email"
                // value={profile.email}
                // disabled
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">রক্তের গ্রুপ</label>
              <select
                name="bloodGroup"
                // value={profile.bloodGroup}
                disabled={!isEditable}
                className="select select-bordered w-full border-2 p-2"
              >
                <option value="">নির্বাচন করুন</option>
                {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(bg =>
                  <option key={bg} value={bg}>{bg}</option>
                )}
              </select>
            </div>

            <div>
              <label className="label">ঠিকানা</label>
              <textarea
                name="address"
                // value={profile.address}
                disabled={!isEditable}
                className="textarea textarea-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">জরুরি যোগাযোগ</label>
              <input
                name="emergencyContact"
                // value={profile.emergencyContact}
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">পেশা</label>
              <input
                name="profession"
                // value={profile.profession}
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            {!isEditable && (
              <button
                type="button"
                onClick={() => setIsEditable(true)}
                className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4"
              >
                এডিট প্রোফাইল
              </button>
            )}

            {isEditable && (
              <>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-outline w-1/2 flex gap-2 bg-primary-color text-white py-4"
                >
                  {isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditable(false)}
                  className="btn btn-outline w-1/2 flex gap-2 bg-secondary-color text-white py-4"
                >
                  ক্যানসেল
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
