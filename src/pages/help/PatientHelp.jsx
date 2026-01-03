import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import usePatient from "../../hooks/usePatient";
import useQuestion from "../../hooks/useQuestion";
import useReply from "../../hooks/useReply";

const PatientHelp = () => {
  const axiosPublic = useAxiosPublic();
  const [patients] = usePatient();
  const { user } = useAuth();
  const [questions] = useQuestion();
  const [replies] = useReply();

  const patient = patients?.find(p => p.email === user?.email);
  const patientID = patient?._id;

  // Only this patient's questions
  const patientQuestions = questions.filter(
    q => q.patientID === patientID
  );

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    const question = event.target.question.value;

    const questionData = {
      question,
      patientID,
      patientName: patient?.name,
      createdAt: new Date(),
    };

    await axiosPublic.post("/api/question", questionData);
    event.target.reset();
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">

      {/* Header + Question Form */}
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 rounded-b-2xl">
        <h1 className="text-2xl font-bold text-center mb-3">
          🩺 Patient Help Center
        </h1>

        <form onSubmit={handleQuestionSubmit} className="space-y-3">
          <textarea
            name="question"
            className="border-2 p-3 w-full rounded-xl text-lg"
            placeholder="আপনার প্রশ্ন লিখুন..."
            rows={3}
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 rounded-full text-lg font-semibold text-white
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              প্রশ্ন পাঠান
            </button>
          </div>
        </form>
      </div>

      {/* Questions + Replies */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-8 bg-gray-50">
        {
          patientQuestions.map(q => {
            const questionReplies = replies.filter(
              r => r.questionId === q._id
            );

            return (
              <div key={q._id} className="bg-white shadow rounded-2xl p-4">

                {/* Question */}
                <h3 className="font-semibold text-lg">
                  {patient?.name}
                </h3>

                <p className="text-gray-800 mt-1 text-lg">
                  {q.question}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(q.createdAt).toLocaleString()}
                </p>

                {/* Replies */}
                <div className="ml-6 mt-4 space-y-2">
                  {
                    questionReplies.length > 0 ? (
                      questionReplies.map((r, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 rounded-xl p-3"
                        >
                          <p className="text-sm font-semibold text-blue-600">
                            👨‍⚕️ {r.doctorName}
                          </p>

                          <p className="text-gray-700">
                            {r.reply}
                          </p>

                          <p className="text-xs text-gray-400">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        এখনো ডাক্তারের কোনো উত্তর আসেনি।
                      </p>
                    )
                  }
                </div>
              </div>
            );
          })
        }

        {
          patientQuestions.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              এখনো কোনো প্রশ্ন করা হয়নি।
            </p>
          )
        }
      </div>
    </div>
  );
};

export default PatientHelp;
