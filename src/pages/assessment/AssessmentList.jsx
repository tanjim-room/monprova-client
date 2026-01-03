import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentCard from '../../components/assessment/AssessmentCard';
import { assessmentConfig, assessmentTypes } from '../../assessmentConfig';
import useAssessment from '../../hooks/useAssessment';

const AssessmentList = () => {
    const navigate = useNavigate();
    const { assessments, isLoading } = useAssessment();

    const assessmentOptions = [
        assessmentConfig[assessmentTypes.PHQ9],
        assessmentConfig[assessmentTypes.GAD7],
        assessmentConfig[assessmentTypes.PSS10]
    ];

    const hasTakenToday = (assessmentId) => {
        if (!assessments || assessments.length === 0) return false;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return assessments.some(item => {
            if (item.assessmentId !== assessmentId) return false;
            const date = new Date(item.date);
            return date >= todayStart && date <= todayEnd;
        });
    };

    const handleSelectAssessment = (assessment) => {
        if (hasTakenToday(assessment.id)) {
            alert('আজ আপনি এই পরীক্ষাটি ইতোমধ্যেই সম্পন্ন করেছেন। অনুগ্রহ করে আগামীকাল চেষ্টা করুন।');
            return;
        }
        navigate(`/dashboardPatient/assessment/${assessment.id}/form`);
    };

    return (
        <div className="min-h-[850px] bg-[#E1ECFF] rounded-lg mt-16 p-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                    মানসিক স্বাস্থ্য মূল্যায়ন
                </h2>
                <p className="text-center text-gray-600 mb-10">
                    আপনার মানসিক স্বাস্থ্য পরীক্ষা করতে একটি মূল্যায়ন নির্বাচন করুন
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {assessmentOptions.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onClick={() => handleSelectAssessment(assessment)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">ℹ️ মূল্যায়ন সম্পর্কে</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-color font-bold">✓</span>
                                <span>প্রতিটি মূল্যায়ন 5-10 মিনিট সময় নেয়</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-color font-bold">✓</span>
                                <span>আপনার প্রতিক্রিয়া সম্পূর্ণ গোপনীয় এবং নিরাপদ রাখা হয়</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-color font-bold">✓</span>
                                <span>প্রতিটি মূল্যায়ন শেষে একটি স্কোর এবং রিপোর্ট পাবেন</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-color font-bold">✓</span>
                                <span>আপনি যেকোনো সময় মূল্যায়ন নিতে পারেন</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-color font-bold">✓</span>
                                <span>আপনার ডাক্তার আপনার ফলাফল দেখতে পারবেন না</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200 flex flex-col justify-center">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">📊 আপনার অগ্রগতি ট্র্যাক করুন</h3>
                            <p className="text-gray-700 mb-6 text-sm leading-relaxed">গত ৩০ দিনের মূল্যায়নের সম্পূর্ণ ইতিহাস এবং তিনটি পরীক্ষার ধারাবাহিক স্কোর গ্রাফ দেখুন।</p>
                            <button
                                onClick={() => navigate('/dashboardPatient/assessment/history')}
                                className="px-8 py-3 bg-primary-color text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
                            >
                                <span>📈</span>
                                <span>পূর্বের ফলাফল দেখুন</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentList;
