import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";

const AdminLogin = () => {
    const [users] = useUser();
    
    
    const navigate = useNavigate();



    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        const admin = users?.find(user => user.email === email && user.password == password);
        // if (!formData.email || !formData.password) {
        //   setError("সব ঘর পূরণ করুন");
        //   return;
        // }
        if (admin) {
            navigate('/dashboardAdmin');
        }
        else{
            alert("Admin not found");
        }
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EFF7FE]">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md border">
                <h2 className="text-xl font-bold text-center mb-6">অ্যাডমিন লগইন</h2>

                {/* {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )} */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            ইমেইল
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ইমেইল লিখুন"
                            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            পাসওয়ার্ড
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="পাসওয়ার্ড লিখুন"
                            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        লগইন করুন
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;