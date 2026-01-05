import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import BackButton from "../../components/BackButton";
import Swal from "sweetalert2";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const response = await axiosSecure.get(`/api/users/${id}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.response?.data?.message || "ব্যবহারকারীর তথ্য লোড করতে সমস্যা হয়েছে",
        confirmButtonColor: "#d33"
      });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "নিশ্চিত করুন",
      text: `আপনি কি "${user.name || user.email}" কে মুছে ফেলতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল"
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/users/${id}`);
        if (response.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonColor: "#10b981"
          });
          navigate("/dashboardAdmin/users");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.response?.data?.message || "ব্যবহারকারী মুছতে সমস্যা হয়েছে",
          confirmButtonColor: "#d33"
        });
      }
    }
  };

  const getRoleBangla = (role) => {
    switch (role) {
      case "admin":
        return "অ্যাডমিন";
      case "doctor":
        return "ডাক্তার";
      case "patient":
        return "রোগী";
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">ব্যবহারকারী পাওয়া যায়নি</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6F0FF] p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton destination="/dashboardAdmin/users" />

        <div className="bg-white shadow-lg rounded-lg p-8 mt-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            ব্যবহারকারীর বিস্তারিত তথ্য
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User ID */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">ব্যবহারকারী আইডি</p>
              <p className="text-lg text-gray-800">{user._id}</p>
            </div>

            {/* Name */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">নাম</p>
              <p className="text-lg text-gray-800">{user.name || "N/A"}</p>
            </div>

            {/* Email */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">ইমেইল</p>
              <p className="text-lg text-gray-800">{user.email}</p>
            </div>

            {/* Role */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">ভূমিকা</p>
              <span
                className={`inline-block px-4 py-2 text-lg font-semibold rounded-full ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleBangla(user.role)}
              </span>
            </div>

            {/* Created At */}
            {user.createdAt && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 font-semibold">নিবন্ধনের তারিখ</p>
                <p className="text-lg text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
            )}

            {/* Last Updated */}
            {user.updatedAt && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 font-semibold">সর্বশেষ আপডেট</p>
                <p className="text-lg text-gray-800">{formatDate(user.updatedAt)}</p>
              </div>
            )}
          </div>

          {/* Additional Info for Different Roles */}
          {user.role === "patient" && user.age && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">অতিরিক্ত তথ্য</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {user.age && <p className="text-gray-800">বয়স: {user.age}</p>}
                {user.gender && <p className="text-gray-800">লিঙ্গ: {user.gender}</p>}
                {user.phone && <p className="text-gray-800">ফোন: {user.phone}</p>}
              </div>
            </div>
          )}

          {user.role === "doctor" && user.specialization && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">অতিরিক্ত তথ্য</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {user.specialization && <p className="text-gray-800">বিশেষত্ব: {user.specialization}</p>}
                {user.phone && <p className="text-gray-800">ফোন: {user.phone}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/dashboardAdmin/users")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-md transition"
            >
              ফিরে যান
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-md transition"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
