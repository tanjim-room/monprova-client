import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AssessmentGraph = ({ historyData, assessmentType }) => {
    if (!historyData || historyData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">No assessment data available for the last 30 days</p>
            </div>
        );
    }

    // Process data for 30-day period
    const processedData = historyData.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: item.score,
        type: item.assessmentType
    }));

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                আপনার গত ৩০ দিনের ফলাফল
            </h3>

            <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">স্কোর ট্রেন্ড</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#2563eb"
                            dot={{ fill: '#2563eb' }}
                            name="স্কোর"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">স্কোর বিতরণ</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="score" fill="#3b82f6" name="স্কোর" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">গড় স্কোর</p>
                    <p className="text-3xl font-bold text-primary-color">
                        {(processedData.reduce((sum, item) => sum + item.score, 0) / processedData.length).toFixed(1)}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">সর্বনিম্ন স্কোর</p>
                    <p className="text-3xl font-bold text-green-600">
                        {Math.min(...processedData.map(item => item.score))}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">সর্বোচ্চ স্কোর</p>
                    <p className="text-3xl font-bold text-red-600">
                        {Math.max(...processedData.map(item => item.score))}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssessmentGraph;
