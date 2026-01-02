import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import usePatient from "../../hooks/usePatient";
import useQuestion from "../../hooks/useQuestion";

const PatientHelp = () => {
  const axiosPublic = useAxiosPublic();
  const [patients] = usePatient();
  const { user } = useAuth();
  const [questions] = useQuestion();

  const patient = patients.find(p => p.email === user?.email);
  const patientID = patient?._id;

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

      {/* 🔒 FIXED / STICKY QUESTION FORM */}
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 rounded-b-2xl">
        <h1 className="text-2xl font-bold text-center mb-3">
          🩺 Patient Help Center
        </h1>

        <form onSubmit={handleQuestionSubmit} className="space-y-3">
          <textarea
            name="question"
            className="border-2 p-3 w-full rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="আপনার প্রশ্ন লিখুন..."
            rows={3}
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="
    px-10 py-2 rounded-full text-lg font-semibold text-white
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
    transition-all duration-300
    shadow-lg hover:shadow-xl
    active:scale-95
  "
            >
              প্রশ্ন পাঠান
            </button>
          </div>
        </form>
      </div>

      {/* 🧾 SCROLLABLE COMMENTS SECTION */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-8 bg-gray-50">
        {
          patientQuestions.map(q => (
            <div
              key={q._id}
              className="bg-white shadow rounded-2xl p-4 flex gap-4"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary-color flex items-center justify-center text-white font-bold text-xl">
                {patient?.name?.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {patient?.name}
                </h3>

                <p className="text-gray-800 mt-1 text-lg">
                  {q.question}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
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
