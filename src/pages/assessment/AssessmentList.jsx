import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentCard from '../../components/assessment/AssessmentCard';
import { assessmentConfig, assessmentTypes } from '../../assessmentConfig';

const AssessmentList = () => {
    const navigate = useNavigate();

    const assessments = [
        assessmentConfig[assessmentTypes.PHQ9],
        assessmentConfig[assessmentTypes.GAD7],
        assessmentConfig[assessmentTypes.PSS10]
    ];

    const handleSelectAssessment = (assessment) => {
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
                    {assessments.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onClick={() => handleSelectAssessment(assessment)}
                        />
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
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
            </div>
        </div>
    );
};

export default AssessmentList;
