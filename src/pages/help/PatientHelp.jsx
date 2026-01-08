import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useDoctor from "../../hooks/useDoctor";
import usePatient from "../../hooks/usePatient";
import useQuestion from "../../hooks/useQuestion";
import useReply from "../../hooks/useReply";

// 🔥 Avatar component
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
      className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500
                 flex items-center justify-center text-white font-bold text-lg"
    >
      {firstLetter}
    </div>
  );
};

const PatientHelp = () => {
  const axiosPublic = useAxiosPublic();
  const [patients] = usePatient();
  const [doctors] = useDoctor();
  const { user } = useAuth();
  const [questions, refetch] = useQuestion();
  const [replies] = useReply();

  const patient = patients?.find(p => p.email === user?.email);
  const patientID = patient?._id;

  // 🔥 Only this patient's questions, latest first
  const patientQuestions = questions
    .filter(q => q.patientID === patientID)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    const question = event.target.question.value;

    const questionData = {
      question,
      patientID,
      status: "pending",
    
      patientName: patient?.name,
      patientImage: patient?.image || null,
      createdAt: new Date(),

    };

    await axiosPublic.post("/api/question", questionData);
    refetch();
    event.target.reset();
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">

      {/* Header + Form */}
      <div className="sticky top-0 bg-white z-10 shadow p-4 rounded-b-2xl">
        <h1 className="text-2xl font-bold text-center mb-3">
          🩺 Patient Help Center
        </h1>

        <form onSubmit={handleQuestionSubmit} className="space-y-3">
          <textarea
            name="question"
            className="border p-3 w-full rounded-xl text-lg"
            placeholder="আপনার প্রশ্ন লিখুন..."
            rows={3}
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 rounded-full text-white font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              প্রশ্ন পাঠান
            </button>
          </div>
        </form>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50">
        {patientQuestions.map(q => {

          // 🔥 Replies for this question, latest first
          const questionReplies = replies
            .filter(r => r.questionId === q._id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          return (
            <div key={q._id} className="bg-white shadow rounded-2xl p-4">

              {/* Patient Question */}
              <div className="flex gap-3 items-start">
                <Avatar
                  name={patient?.name}
                  image={patient.image}
                  size={40}
                />

                <div className="flex-1">
                  <p className="font-semibold">{patient?.name}</p>

                  <p className="text-gray-800 text-lg mt-1">{q.question}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(q.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Replies */}
              <div className="ml-12 mt-4 space-y-3">
                {questionReplies.length > 0 ? (
                  questionReplies.map((r, i) => {
                    // 🔥 Find doctor from doctors array
                    const doctor = doctors?.find(d => d._id === r.doctorID);

                    return (
                      <div key={i} className="flex gap-3 items-start">
                        <Avatar
                          name={r.doctorName}
                          image={doctor?.image || null} // Use doctor image from array
                          size={36}
                        />

                        <div className="bg-gray-100 rounded-2xl px-4 py-2 flex-1">
                          <p className="text-sm font-semibold text-blue-600">
                            👨‍⚕️ {r.doctorName}
                          </p>

                          <p className="text-gray-700 mt-1">{r.reply}</p>

                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    এখনো ডাক্তারের কোনো উত্তর আসেনি।
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {patientQuestions.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            এখনো কোনো প্রশ্ন করা হয়নি।
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientHelp;