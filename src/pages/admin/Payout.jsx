import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Payout = () => {
  const axiosSecure = useAxiosSecure();
  const [payouts, setPayouts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [doctorPayoutHistory, setDoctorPayoutHistory] = useState([]);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [doctorEarnings, setDoctorEarnings] = useState({
    totalIncome: 0,
    netIncome: 0,
    totalReceived: 0,
    pending: 0,
    completedCount: 0
  });

  const [form, setForm] = useState({
    doctorId: "",
    doctorName: "",
    amount: "",
    method: "Bkash",
    accountNumber: "",
    transactionId: "",
    note: "",
  });

  useEffect(() => {
    fetchPayouts();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axiosSecure.get("/api/doctors");
      console.log("Fetched doctors:", response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ডাক্তারদের তথ্য লোড করতে সমস্যা হয়েছে",
        confirmButtonColor: "#d33"
      });
    }
  };

  const fetchPayouts = async () => {
    try {
      const response = await axiosSecure.get("/api/payouts");
      setPayouts(response.data);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    }
  };

  const calculateDoctorEarnings = async (doctorId, doctorName) => {
    try {
      // Fetch completed appointments for this doctor
      const appointmentsResponse = await axiosSecure.get(`/api/appointments?doctorName=${doctorName}&status=completed`);
      const completedAppointments = appointmentsResponse.data;
      setCompletedAppointments(completedAppointments);

      // Calculate total income (before charge)
      const totalIncome = completedAppointments.reduce(
        (sum, app) => sum + (Number(app.consultationFee) || 0),
        0
      );

      // Calculate net income (after 20% charge)
      const netIncome = totalIncome * 0.8;

      // Fetch existing payouts for this doctor
      const payoutsResponse = await axiosSecure.get(`/api/payouts?doctorId=${doctorId}`);
      const doctorPayouts = payoutsResponse.data;
      setDoctorPayoutHistory(doctorPayouts);
      
      const totalReceived = doctorPayouts.reduce(
        (sum, payout) => sum + (Number(payout.amount) || 0),
        0
      );

      const pending = netIncome - totalReceived;

      setDoctorEarnings({
        totalIncome,
        netIncome,
        totalReceived,
        pending,
        completedCount: completedAppointments.length
      });
    } catch (error) {
      console.error("Error calculating earnings:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    console.log("Search query:", query);
    console.log("Total doctors:", doctors.length);
    
    if (query.trim() === "") {
      setFilteredDoctors([]);
      return;
    }

    // Search by doctor ID or email only
    const filtered = doctors.filter(doctor => {
      const matchesId = doctor._id?.toLowerCase().includes(query.toLowerCase());
      const matchesEmail = doctor.email?.toLowerCase().includes(query.toLowerCase());
      
      return matchesId || matchesEmail;
    });
    
    console.log("Filtered doctors:", filtered.length);
    setFilteredDoctors(filtered);
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSearchQuery("");
    setFilteredDoctors([]);
    setShowPayoutForm(false);
    
    setForm({
      ...form,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      accountNumber: doctor.phone || ""
    });
    
    await calculateDoctorEarnings(doctor._id, doctor.fullName);
  };

  const handleResetDoctor = () => {
    setSelectedDoctor(null);
    setSearchQuery("");
    setFilteredDoctors([]);
    setShowPayoutForm(false);
    setCompletedAppointments([]);
    setDoctorPayoutHistory([]);
    setDoctorEarnings({
      totalIncome: 0,
      netIncome: 0,
      totalReceived: 0,
      pending: 0,
      completedCount: 0
    });
    setForm({
      doctorId: "",
      doctorName: "",
      amount: "",
      method: "Bkash",
      accountNumber: "",
      transactionId: "",
      note: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const adminInfo = JSON.parse(localStorage.getItem("loggedInUser")) || {};
      
      const payoutData = {
        doctorId: form.doctorId,
        doctorName: form.doctorName,
        amount: Number(form.amount),
        charge: Number(form.amount) / 0.8 * 0.2, // Calculate the 20% charge
        method: form.method,
        accountNumber: form.accountNumber,
        transactionId: form.transactionId,
        note: form.note,
        adminId: adminInfo._id || adminInfo.email,
        timestamp: new Date()
      };

      const response = await axiosSecure.post("/api/payouts", payoutData);
      
      if (response.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "পেমেন্ট সফলভাবে যুক্ত হয়েছে",
          confirmButtonColor: "#007AF5"
        });

        fetchPayouts();
        
        // Recalculate earnings
        if (selectedDoctor) {
          calculateDoctorEarnings(selectedDoctor._id, selectedDoctor.fullName);
        }

        // Reset form but keep doctor selected
        setForm({
          ...form,
          amount: "",
          transactionId: "",
          note: "",
        });
        setShowPayoutForm(false);
      }
    } catch (error) {
      console.error("Error submitting payout:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "পেমেন্ট যুক্ত করতে সমস্যা হয়েছে",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <div className="bg-[#EFF7FE] p-4 min-h-screen">
      <div className="bg-white rounded-md p-8 shadow-sm">
        <h2 className="text-xl text-gray-800 p-4 mb-8 font-bold text-center rounded-md bg-[#EFF7FE]">
          পেআউট সংক্রান্ত তথ্য
        </h2>

        {/* Doctor Search Section */}
        {!selectedDoctor && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              ডাক্তার খুঁজুন
            </h3>
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="ডাক্তার আইডি বা ইমেইল দিয়ে খুঁজুন..."
                className="w-full border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              
              {/* Search Results Dropdown */}
              {filteredDoctors.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{doctor.fullName}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          <p className="text-xs text-gray-500 mt-1">আইডি: {doctor._id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          <p className="text-sm text-gray-600">{doctor.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery && filteredDoctors.length === 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
                  <p className="text-center text-gray-500">কোনো ডাক্তার পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctor Info and Earnings Display */}
        {selectedDoctor && (
          <div className="mb-8">
            {/* Doctor Header with Reset Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                ডাক্তারের তথ্য
              </h3>
              <button
                onClick={handleResetDoctor}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md transition"
              >
                অন্য ডাক্তার নির্বাচন করুন
              </button>
            </div>

            {/* Doctor Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">নাম</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDoctor.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">বিশেষত্ব</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDoctor.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ইমেইল</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDoctor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ফোন</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDoctor.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ডাক্তার আইডি</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDoctor._id}</p>
                </div>
              </div>
            </div>

            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white shadow-lg p-4 rounded-lg text-center border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">সম্পন্ন অ্যাপয়েন্টমেন্ট</p>
                <p className="text-3xl font-bold text-blue-600">{doctorEarnings.completedCount}</p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-lg text-center border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">মোট আয়</p>
                <p className="text-2xl font-bold text-purple-600">৳ {doctorEarnings.totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-lg text-center border-2 border-blue-300">
                <p className="text-sm text-gray-600 mb-1">নিট আয় (৮০%)</p>
                <p className="text-2xl font-bold text-blue-700">৳ {doctorEarnings.netIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-lg text-center border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">প্রদান করা হয়েছে</p>
                <p className="text-2xl font-bold text-green-600">৳ {doctorEarnings.totalReceived.toFixed(2)}</p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-lg text-center border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">বাকি আছে</p>
                <p className="text-2xl font-bold text-red-600">৳ {doctorEarnings.pending.toFixed(2)}</p>
              </div>
            </div>

            {/* Completed Appointments Table */}
            <div className="mb-6">
              <h4 className="text-md font-bold text-gray-800 mb-3 bg-blue-100 p-3 rounded-md">
                সম্পন্ন অ্যাপয়েন্টমেন্ট ({completedAppointments.length})
              </h4>
              <div className="overflow-x-auto bg-white rounded-md shadow-md border">
                <table className="min-w-full text-sm">
                  <thead className="bg-blue-200 text-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">তারিখ</th>
                      <th className="px-4 py-2 text-left">রোগীর নাম</th>
                      <th className="px-4 py-2 text-left">অ্যাপয়েন্টমেন্ট ফি</th>
                      <th className="px-4 py-2 text-left">সিস্টেম চার্জ (২০%)</th>
                      <th className="px-4 py-2 text-left">ডাক্তারের প্রাপ্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-600">
                          কোনো সম্পন্ন অ্যাপয়েন্টমেন্ট নেই
                        </td>
                      </tr>
                    ) : (
                      completedAppointments.map((app, index) => {
                        const fee = Number(app.consultationFee) || 0;
                        const charge = fee * 0.2;
                        const doctorAmount = fee * 0.8;
                        return (
                          <tr key={index} className="border-b hover:bg-blue-50">
                            <td className="px-4 py-2">{app.date}</td>
                            <td className="px-4 py-2">{app.name}</td>
                            <td className="px-4 py-2">৳ {fee}</td>
                            <td className="px-4 py-2 text-red-600">৳ {charge}</td>
                            <td className="px-4 py-2 text-green-600 font-semibold">৳ {doctorAmount}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Previous Payouts Table */}
            <div className="mb-6">
              <h4 className="text-md font-bold text-gray-800 mb-3 bg-green-100 p-3 rounded-md">
                পূর্ববর্তী পেআউট হিস্টোরি ({doctorPayoutHistory.length})
              </h4>
              <div className="overflow-x-auto bg-white rounded-md shadow-md border">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-200 text-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">তারিখ</th>
                      <th className="px-4 py-2 text-left">পরিমাণ</th>
                      <th className="px-4 py-2 text-left">মাধ্যম</th>
                      <th className="px-4 py-2 text-left">ট্রানজেকশন আইডি</th>
                      <th className="px-4 py-2 text-left">নোট</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorPayoutHistory.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-600">
                          এখনও কোনো পেআউট করা হয়নি
                        </td>
                      </tr>
                    ) : (
                      doctorPayoutHistory.map((payout, index) => (
                        <tr key={index} className="border-b hover:bg-green-50">
                          <td className="px-4 py-2">{new Date(payout.timestamp).toLocaleDateString('bn-BD')}</td>
                          <td className="px-4 py-2 font-semibold text-green-700">৳ {payout.amount}</td>
                          <td className="px-4 py-2">{payout.method}</td>
                          <td className="px-4 py-2">{payout.transactionId}</td>
                          <td className="px-4 py-2">{payout.note || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Toggle Payout Form Button */}
            {!showPayoutForm ? (
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowPayoutForm(true)}
                  className="bg-[#007AF5] hover:bg-[#0056b3] text-white font-bold px-8 py-3 rounded-md transition text-lg"
                >
                  নতুন পেআউট তৈরি করুন
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-gray-800">নতুন পেআউট ফর্ম</h4>
                  <button
                    onClick={() => setShowPayoutForm(false)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    বাতিল করুন
                  </button>
                </div>

                {/* Payout Form */}
                <form
                  onSubmit={handleSubmit}
                  className="grid md:grid-cols-2 gap-6 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300"
                >
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      অর্থের পরিমাণ (টাকা)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="যেমন: ৫০০০"
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      প্রদানের মাধ্যম নির্বাচন করুন
                    </label>
                    <select
                      name="method"
                      value={form.method}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      একাউন্ট / নাম্বার
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      placeholder="যেমন: 017XXXXXXXX"
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      ট্রানজেকশন আইডি
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={form.transactionId}
                      onChange={handleChange}
                      placeholder="যেমন: TXN123456789"
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold mb-2 text-gray-700">
                      নোট (ঐচ্ছিক)
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="যদি কিছু উল্লেখ করতে চান"
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 text-center mt-4">
                    <button
                      type="submit"
                      className="bg-[#007AF5] hover:bg-[#ff3d2f] text-white font-semibold px-8 py-3 rounded-md transition"
                    >
                      পেমেন্ট যুক্ত করুন
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* All Payouts History Table */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-[#EFF7FE] p-3 rounded-md border text-center">
            সকল পেআউট হিস্টোরি
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#007AF5] text-white">
                <tr>
                  <th className="px-4 py-2">তারিখ</th>
                  <th className="px-4 py-2">নাম</th>
                  <th className="px-4 py-2">পরিমাণ</th>
                  <th className="px-4 py-2">মাধ্যম</th>
                  <th className="px-4 py-2">একাউন্ট / নাম্বার</th>
                  <th className="px-4 py-2">ট্রানজেকশন আইডি</th>
                  <th className="px-4 py-2">নোট</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(p.timestamp).toLocaleDateString('bn-BD')}</td>
                    <td className="px-4 py-2">{p.doctorName}</td>
                    <td className="px-4 py-2">{p.amount}৳</td>
                    <td className="px-4 py-2">{p.method}</td>
                    <td className="px-4 py-2">{p.accountNumber}</td>
                    <td className="px-4 py-2">{p.transactionId}</td>
                    <td className="px-4 py-2">{p.note || "-"}</td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-gray-500 py-4"
                    >
                      এখনও কোনো পেমেন্ট রেকর্ড নেই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payout;
