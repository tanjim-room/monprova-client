import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useQuestion from "../../hooks/useQuestion";
import usePatient from "../../hooks/usePatient";
import useDoctor from "../../hooks/useDoctor";

// 🔥 Avatar Component
const Avatar = ({ name = "", image, size = 40 }) => {
  const firstLetter = name?.split(" ")[0]?.charAt(0).toUpperCase() || "?";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                 flex items-center justify-center text-white font-bold text-lg"
    >
      {firstLetter}
    </div>
  );
};

const AdminHelp = () => {
  const axiosPublic = useAxiosPublic();
  const [questions, refetchQuestions] = useQuestion();
  const [patients] = usePatient();
  const [doctors] = useDoctor();

  const [filterStatus, setFilterStatus] = useState("pending"); // pending, approved, declined
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // 🔥 Filter questions by status
  const filteredQuestions = questions
    .filter(q => q.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ✅ Approve selected questions
  const handleApprove = async () => {
    if (selectedQuestions.length === 0) return;
    await Promise.all(
      selectedQuestions.map(qId =>
        axiosPublic.patch(`/api/question/${qId}`, { status: "approved" })
      )
    );
    setSelectedQuestions([]);
    setSelectAll(false);
    refetchQuestions();
  };

  // ❌ Decline selected questions
  const handleDecline = async () => {
    if (selectedQuestions.length === 0) return;
    await Promise.all(
      selectedQuestions.map(qId =>
        axiosPublic.patch(`/api/question/${qId}`, { status: "declined" })
      )
    );
    setSelectedQuestions([]);
    setSelectAll(false);
    refetchQuestions();
  };

  // Toggle selection of a question
  const toggleSelect = (questionId) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
      setSelectAll(false);
    } else {
      const allIds = filteredQuestions.map(q => q._id);
      setSelectedQuestions(allIds);
      setSelectAll(true);
    }
  };

  // Array of pastel background colors for cards
  const cardColors = [
    "bg-pink-50",
    "bg-purple-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        🛡 Admin Help Center
      </h2>

      {/* ===== Filter Buttons ===== */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded-full font-medium shadow ${
            filterStatus === "pending"
              ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium shadow ${
            filterStatus === "approved"
              ? "bg-green-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilterStatus("approved")}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium shadow ${
            filterStatus === "declined"
              ? "bg-red-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilterStatus("declined")}
        >
          Declined
        </button>
      </div>

      {/* ===== Select All & Bulk Approve/Decline ===== */}
      {filterStatus === "pending" && filteredQuestions.length > 0 && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <span className="font-medium">Select All</span>
          </label>

          {selectedQuestions.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow"
              >
                Approve Selected
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full shadow"
              >
                Decline Selected
              </button>
            </div>
          )}
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          কোন {filterStatus} প্রশ্ন নেই।
        </p>
      )}

      {/* ===== Question Cards ===== */}
      <div className="space-y-5">
        {filteredQuestions.map((q, idx) => {
          const patient = patients.find(p => p._id === q.patientID);
          const isSelected = selectedQuestions.includes(q._id);
          const bgColor = cardColors[idx % cardColors.length];

          return (
            <div
              key={q._id}
              className={`${bgColor} shadow-md rounded-2xl p-4 flex gap-3 items-start`}
            >
              {/* Checkbox for pending questions */}
              {filterStatus === "pending" && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(q._id)}
                  className="mt-2"
                />
              )}

              <Avatar name={patient?.name} image={patient?.image} size={40} />

              <div className="flex-1">
                <p className="font-semibold text-indigo-700">{patient?.name || "Unknown Patient"}</p>

                {/* Question content */}
                <p className="text-gray-800 mt-1">{q.question}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(q.createdAt).toLocaleString()}
                </p>

                {/* Status badge for approved/declined */}
                {filterStatus !== "pending" && (
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold text-white ${
                      filterStatus === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {filterStatus.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHelp;
