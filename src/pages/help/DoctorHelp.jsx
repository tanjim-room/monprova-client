import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useDoctor from "../../hooks/useDoctor";
import usePatient from "../../hooks/usePatient";
import useQuestion from "../../hooks/useQuestion";

const DoctorHelp = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [questions, refetch] = useQuestion();
  const [doctors] = useDoctor();
  const [patients] = usePatient();

  const doctor = doctors?.find(d => d.email === user?.email);
  const doctorID = doctor?._id;
  const doctorName = doctor?.name;

  const handleReplySubmit = async (e, questionId) => {
    e.preventDefault();
    const reply = e.target.reply.value;

    const replyData = {
      reply,
      doctorID,
      doctorName,
      createdAt: new Date(),
    };

    await axiosPublic.post(`/api/question/reply/${questionId}`, replyData);
    e.target.reset();
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen p-4">

      {/* Professional Header */}
      <div className="mb-6 rounded-xl p-4 text-center text-white
        bg-gradient-to-r from-blue-600 to-teal-500 shadow">
        <h1 className="text-2xl font-semibold">
          🩺 Doctors Help Center
        </h1>
      </div>

      <div className="space-y-6">
        {questions.map(q => (
          <div
            key={q._id}
            className="bg-white border rounded-xl p-5"
          >
            {/* Question */}
            <div className="flex gap-4">
              {/* Patient Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center
                bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold">

                {
                  patients?.find(p => p._id === q.patientID)?.image ? (
                    <img
                      src={patients.find(p => p._id === q.patientID).image}
                      alt={q.patientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    q.patientName?.charAt(0)
                  )
                }
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  {q.patientName}
                </h3>
                <p className="text-gray-800">
                  {q.question}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Replies */}
            <div className="ml-14 mt-4 space-y-2">
              {q.replies?.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 text-gray-800
                    bg-gradient-to-r from-slate-100 to-slate-200 border"
                >
                  <p className="text-sm font-semibold text-blue-700">
                    👨‍⚕️ {r.doctorName}
                  </p>
                  <p className="text-sm">
                    {r.reply}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form
              onSubmit={(e) => handleReplySubmit(e, q._id)}
              className="flex gap-2 mt-5 ml-14"
            >
              <input
                type="text"
                name="reply"
                placeholder="Write a reply..."
                className="flex-1 px-4 py-2 rounded-full border
                focus:outline-none focus:ring-2
                focus:ring-blue-500"
                required
              />

              {/* Professional Button */}
              <button
                className="px-5 py-2 rounded-full text-white font-medium
                bg-blue-600 hover:bg-blue-700 transition"
              >
                Reply
              </button>
            </form>
          </div>
        ))}

        {questions.length === 0 && (
          <p className="text-center text-gray-500">
            কোনো প্রশ্ন পাওয়া যায়নি
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorHelp;
