import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Income = () => {
  const axiosSecure = useAxiosSecure();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [payouts, setPayouts] = useState([]);
  const [totalRecieved, setTotalReceived] = useState(0);

  useEffect(() => {
    // Load doctor info
    const loggedInDoctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    setDoctor(loggedInDoctor);

    // Fetch appointments for this doctor
    const fetchAppointments = async () => {
      try {
        const response = await axiosSecure.get(`/appointments?doctorName=${loggedInDoctor.fullName}&status=completed`);
        const myAppointments = response.data;

        // Calculate incomes
        const income = myAppointments.reduce(
          (sum, a) => sum + (Number(a.consultationFee) || 0),
          0
        );
        const nIncome = myAppointments.reduce(
          (sum, a) =>
            sum + (Number(a.consultationFee) - Number(a.consultationFee) * 0.2 || 0),
          0
        );

        setAppointments(myAppointments);
        setTotalIncome(income);
        setNetIncome(nIncome);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    // Fetch payouts for this doctor
    const fetchPayouts = async () => {
      try {
        const response = await axiosSecure.get(`/payouts?doctorId=${loggedInDoctor._id}`);
        const doctorPayouts = response.data;
        
        const tReceived = doctorPayouts.reduce(
          (sum, a) => sum + (Number(a.amount) || 0),
          0
        );
        
        setTotalReceived(tReceived);
        setPayouts(doctorPayouts);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      }
    };

    if (loggedInDoctor?.fullName) {
      fetchAppointments();
      fetchPayouts();
    }
  }, [axiosSecure]);

  return (
    <div className="bg-[#EFF7FE] p-4 min-h-screen">
      <div className="min-h-[850px] bg-white rounded-md p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl text-gray-800 p-4 mb-8 font-bold text-center rounded-md bg-[#EFF7FE] border">
          আয় সংক্রান্ত তথ্য
        </h2>

        <p className="text-center text-red-500 my-4">
          প্রতি অ্যাপয়েন্টমেন্টে মনপ্রভা অ্যাপয়েন্টমেন্ট ফি এর ২০% টাকা সার্ভিস চার্জ হিসেবে কেটে রাখবে
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-white shadow-md p-6 rounded-md text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">
              সম্পন্ন অ্যাপয়েন্টমেন্ট
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {appointments.length}
            </p>
          </div>

          <div className="card bg-white shadow-md p-6 rounded-md text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">মোট আয়</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ৳ {totalIncome}
            </p>
          </div>

          <div className="card bg-white shadow-md p-6 rounded-md text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">নিট আয়</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ৳ {netIncome}
            </p>
          </div>

          <div className="card bg-white shadow-md p-6 rounded-md text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">মোট গ্রহণ</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ৳ {totalRecieved}
            </p>
          </div>

          <div className="card bg-white shadow-md p-6 rounded-md text-center border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">মোট বাকি</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ৳ {netIncome - totalRecieved}
            </p>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-[#EFF7FE] p-3 rounded-md border text-center">
            ইনকাম হিস্টোরি
          </h3>

          <div className="overflow-x-auto bg-white rounded-md shadow-md border border-gray-200">
            <table className="table w-full">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th>তারিখ</th>
                  <th>রোগীর নাম</th>
                  <th>অ্যাপয়েন্টমেন্ট ফি (৳)</th>
                  <th>চার্জ (২০%)</th>
                  <th>নিট পেমেন্ট (৳)</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-600">
                      কোনো পেমেন্ট রেকর্ড নেই।
                    </td>
                  </tr>
                ) : (
                  appointments.map((app, index) => {
                    const fee = Number(app.consultationFee) || 0;
                    const deduction = fee * 0.2;
                    const net = fee - deduction;
                    return (
                      <tr key={index} className="hover:bg-blue-50">
                        <td>{app.date}</td>
                        <td>{app.name}</td>
                        <td>৳ {fee}</td>
                        <td className="text-red-500">-৳ {deduction}</td>
                        <td className="text-green-600 font-semibold">৳ {net}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
 
        {/* Payment Received History Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-[#EFF7FE] p-3 rounded-md border text-center">
            পেমেন্ট গ্রহণের হিস্টোরি
          </h3>

          <div className="overflow-x-auto bg-white rounded-md shadow-md border border-gray-200">
            <table className="table w-full">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th>তারিখ</th>
                  <th>মাধ্যম</th>
                  <th>ট্রানজেকশন আইডি</th>
                  <th>এমাউন্ট গ্রহণ (৳)</th>
                  <th>নোট</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-600">
                      কোনো পেমেন্ট রেকর্ড নেই।
                    </td>
                  </tr>
                ) : (
                  payouts.map((p, i) => (
                    <tr key={i} className="hover:bg-blue-50 text-center">
                      <td className="text-left">{new Date(p.timestamp).toLocaleDateString('bn-BD')}</td>
                      <td className="text-left">{p.method}</td>
                      <td className="text-left">{p.transactionId}</td>
                      <td className="text-left">৳ {p.amount}</td>
                      <td className="text-left">{p.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
