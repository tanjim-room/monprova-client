import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

const DoctorManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchQuery, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await axiosSecure.get("/api/doctors");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ডাক্তারদের তথ্য লোড করতে সমস্যা হয়েছে",
        confirmButtonColor: "#d33"
      });
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Filter by search query (name or email)
    if (searchQuery.trim()) {
      filtered = filtered.filter(doctor => 
        doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleDelete = async (doctorId, doctorName) => {
    const result = await Swal.fire({
      title: "নিশ্চিত করুন",
      text: `আপনি কি "${doctorName}" কে মুছে ফেলতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল"
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/doctors/${doctorId}`);
        if (response.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "ডাক্তার সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonColor: "#10b981"
          });
          fetchDoctors(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.response?.data?.message || "ডাক্তার মুছতে সমস্যা হয়েছে",
          confirmButtonColor: "#d33"
        });
      }
    }
  };

  const handleViewDetails = (doctorId) => {
    navigate(`/dashboardAdmin/doctors/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6F0FF] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ডাক্তার ম্যানেজমেন্ট
        </h1>

        {/* Search Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম, ইমেইল বা বিশেষত্ব দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">মোট ডাক্তার</p>
              <p className="text-2xl font-bold text-green-600">{doctors.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">দেখানো হচ্ছে</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredDoctors.length}
              </p>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ইমেইল
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বিশেষত্ব
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ফি
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কার্যক্রম
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      কোনো ডাক্তার পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {doctor.expertise || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ৳ {doctor.consultationFee || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(doctor._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
                            title="বিস্তারিত দেখুন"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor._id, doctor.name || doctor.email)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                            title="মুছে ফেলুন"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center text-gray-600">
          দেখানো হচ্ছে {filteredDoctors.length} জন ডাক্তার (মোট {doctors.length} জন)
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
