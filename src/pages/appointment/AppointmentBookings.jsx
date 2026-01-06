import React from 'react';

const AppointmentBookings = () => {

    // demo data (later API থেকে আনবে)
    const bookings = [
        {
            id: 1,
            doctor: "Dr. Rahman",
            department: "Cardiology",
            date: "10 Jan 2026",
            time: "10:30 AM",
            status: "Pending Payment",
        },
        {
            id: 2,
            doctor: "Dr. Ayesha",
            department: "Dermatology",
            date: "15 Jan 2026",
            time: "4:00 PM",
            status: "Paid",
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
                আপনার বুকিংসগুলো
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white shadow-md rounded-xl p-5 border"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            {booking.doctor}
                        </h2>

                        <p className="text-gray-600">
                            বিভাগ: {booking.department}
                        </p>
                        <p className="text-gray-600">
                            তারিখ: {booking.date}
                        </p>
                        <p className="text-gray-600 mb-3">
                            সময়: {booking.time}
                        </p>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm mb-4
                                ${
                                    booking.status === "Paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {booking.status}
                        </span>

                        <div className="flex gap-3 mt-4">
                            <button
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                disabled={booking.status === "Paid"}
                            >
                                Make Payment
                            </button>

                            <button
                                className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentBookings;
