import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2"; // Ensure Swal is imported
import usePatient from "../../hooks/usePatient";

const PatientProfile = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [patients] = usePatient();
  const [users] = useUser();
  const { user } = useAuth(); // Get the current logged-in user from useAuth
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.log(user);
  // Ensure patient is fetched correctly
  const patient = users?.find(dbUser => dbUser.email === user?.email); // Since user already contains the patient details, we use user directly.
  console.log(patient)
  const patientInfo = patients?.find(patient => patient.email === user?.email);

  // if (!patientInfo) {
  //   return <div>Loading...</div>; // Handle the case where patient information isn't available yet
  // }

  // Handle form submission to update the profile
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

    const patientInfo = {
      name,
      age,
      gender,
      phone,
      email,
      bloodGroup,
      address,
      emergencyContact,
      profession,
      createdAt: new Date(),
    };

    // Confirm before saving the profile
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
    if (!patientInfo.name) {
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
      const response = await axiosPublic.post('/api/patient', patientInfo);

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

  return (
    <div className="min-h-screen p-16 bg-[#E1ECFF] mt-16">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-semibold text-center mb-8">রোগীর প্রোফাইল</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-2 overflow-hidden">
            <img
              src={"https://via.placeholder.com/150"} // Placeholder image for profile picture
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label">নাম</label>
              <input
                name="name"
                defaultValue={patientInfo?.name || patient?.name} /* || patient.name*/
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">বয়স</label>
              <input
                name="age"
                defaultValue={patientInfo?.age} // Populate the patient's age
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">জেন্ডার</label>
              <select
                name="gender"
                value={patientInfo?.gender} // Populate the patient's gender
                disabled={!isEditable}
                className="select select-bordered w-full border-2 p-2"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="label">মোবাইল</label>
              <input
                name="phone"
                defaultValue={patientInfo?.phone} // Populate phone number
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">ইমেইল</label>
              <input
                type="email"
                name="email"
                defaultValue={patientInfo?.email || patient?.email}
                className="input input-bordered w-full border-2 p-2"
                disabled
              />
            </div>

            <div>
              <label className="label">রক্তের গ্রুপ</label>
              <select
                name="bloodGroup"
                defaultValue={patientInfo?.bloodGroup} // Populate blood group
                disabled={!isEditable}
                className="select select-bordered w-full border-2 p-2"
              >
                <option value="">নির্বাচন করুন</option>
                {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">ঠিকানা</label>
              <textarea
                name="address"
                defaultValue={patientInfo?.address} // Populate address
                disabled={!isEditable}
                className="textarea textarea-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">জরুরি যোগাযোগ</label>
              <input
                name="emergencyContact"
                defaultValue={patientInfo?.emergencyContact} // Populate emergency contact
                disabled={!isEditable}
                className="input input-bordered w-full border-2 p-2"
              />
            </div>

            <div>
              <label className="label">পেশা</label>
              <input
                name="profession"
                defaultValue={patientInfo?.profession} // Populate profession
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
                <input
                  type="submit"
                  disabled={isSaving}
                  className="btn bg-primary-color text-white w-1/2 px-8"
                  value="সংরক্ষণ করুন"
                />

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
