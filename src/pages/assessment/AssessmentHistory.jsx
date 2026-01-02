import React, { useState, useEffect } from 'react';
import useAssessment from '../../hooks/useAssessment';
import AssessmentGraph from '../../components/assessment/AssessmentGraph';
import { assessmentTypes } from '../../assessmentConfig';

const AssessmentHistory = () => {
    const { assessmentHistory, isLoading } = useAssessment();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (assessmentHistory && assessmentHistory.length > 0) {
            if (selectedFilter === 'all') {
                setFilteredData(assessmentHistory);
            } else {
                setFilteredData(assessmentHistory.filter(item => item.assessmentType === selectedFilter));
            }
        }
    }, [assessmentHistory, selectedFilter]);

    const getRecentAssessments = () => {
        return assessmentHistory
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
    };

    if (isLoading) {
        return (
            <div className="min-h-[850px] bg-[#E1ECFF] rounded-lg mt-16 p-10 flex items-center justify-center">
                <p className="text-gray-600">ডেটা লোড হচ্ছে...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[850px] bg-[#E1ECFF] rounded-lg mt-16 p-10">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    আপনার মূল্যায়ন ইতিহাস
                </h2>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        ফিল্টার করুন:
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                selectedFilter === 'all'
                                    ? 'bg-primary-color text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            সব মূল্যায়ন
                        </button>
                        <button
                            onClick={() => setSelectedFilter(assessmentTypes.PHQ9)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                selectedFilter === assessmentTypes.PHQ9
                                    ? 'bg-primary-color text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            PHQ-9
                        </button>
                        <button
                            onClick={() => setSelectedFilter(assessmentTypes.GAD7)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                selectedFilter === assessmentTypes.GAD7
                                    ? 'bg-primary-color text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            GAD-7
                        </button>
                        <button
                            onClick={() => setSelectedFilter(assessmentTypes.PSS10)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                selectedFilter === assessmentTypes.PSS10
                                    ? 'bg-primary-color text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            PSS-10
                        </button>
                    </div>
                </div>

                {filteredData.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <AssessmentGraph historyData={filteredData} assessmentType={selectedFilter} />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                সাম্প্রতিক মূল্যায়ন
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-800">তারিখ</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-800">মূল্যায়ন ধরন</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-800">স্কোর</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-800">স্তর</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getRecentAssessments().map((assessment, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-gray-800">
                                                    {new Date(assessment.date).toLocaleDateString('bn-BD', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {assessment.assessmentType}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-bold text-primary-color">
                                                        {assessment.score}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        assessment.severity === 'No depression' || assessment.severity === 'No anxiety' || assessment.severity === 'Low stress'
                                                            ? 'bg-green-100 text-green-800'
                                                            : assessment.severity.includes('Mild') || assessment.severity.includes('Moderate')
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {assessment.severityBangla}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">কোনো মূল্যায়ন ডেটা পাওয়া যায়নি</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentHistory;
