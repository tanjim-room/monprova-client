import React, { useContext, useState } from 'react';
import Button from '../../components/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../providers/AuthProvider';
import { sendEmailVerification } from 'firebase/auth';
import Swal from 'sweetalert2';

const PatientRegister = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/dashboardPatient";
    const { signUpEmail, signInWithGoogle } = useContext(AuthContext);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            const googleUser = result.user;

            // ✅ Google users are already verified
            if (googleUser) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError("গুগল দিয়ে লগইন করা যায়নি");
            console.error(err.message);
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError("");  // Reset error message

        const form = event.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;

        // ===== Validation =====
        if (!name) return setError("আপনার নাম দিন");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return setError("আপনার সঠিক ইমেইল দিন");

        if (password.length < 6) return setError("কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড দিন");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        if (!passwordRegex.test(password)) return setError("পাসওয়ার্ডে আপার, লোয়ার, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে");

        // ===== Patient profile (NO PASSWORD) =====
        const profile = {
            name,
            email,
            role: "patient",
            createdAt: new Date(),
        };

        try {
            /* ==========================
               1️⃣ Save to MongoDB FIRST
            ========================== */
            const dbRes = await fetch("http://localhost:8000/api/patient/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            const dbData = await dbRes.json();
            if (!dbRes.ok) {
                throw new Error(dbData.message || "ডাটাবেজে তথ্য সংরক্ষণ ব্যর্থ");
            }

            console.log("Patient profile saved to MongoDB:", dbData);

            /* ==========================
               2️⃣ Firebase Signup SECOND
            ========================== */
            const result = await signUpEmail(email, password);
            const user = result.user;

            await sendEmailVerification(user);

            /* ==========================
               ✅ SUCCESS
            ========================== */
            Swal.fire({
                title: "রেজিস্ট্রেশন সফল",
                text: "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/patientLogin");
            });

        } catch (err) {
            console.error("Error during registration:", err.message);
            // Handle different error cases
            if (err.message.includes("ডাটাবেজে তথ্য সংরক্ষণ ব্যর্থ")) {
                setError("ডাটাবেজে তথ্য সংরক্ষণ ব্যর্থ। দয়া করে আবার চেষ্টা করুন");
            } else {
                setError("রেজিস্ট্রেশন ব্যর্থ হয়েছে");
            }
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <Helmet>
                <title>Patient Register</title>
            </Helmet>
            <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2">মনপ্রভায় স্বাগতম</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        একজন রোগী হিসেবে শুরু করুন।
                    </p>

                    <form onSubmit={handleSignUp}>
                        {error && <p className="text-red-600 text-sm mb-2">** {error} **</p>}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">নাম দিন</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="আপনার নাম লিখুন"
                                className="input input-bordered w-full px-4 bg-gray-200"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">ইমেইল দিন</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="আপনার ইমেইল লিখুন"
                                className="input input-bordered w-full px-4 bg-gray-200"
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">পাসওয়ার্ড দিন</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="আপনার পাসওয়ার্ড লিখুন"
                                className="input input-bordered w-full px-4 bg-gray-200"
                            />
                        </div>

                        <input type="submit" value="সাইন আপ করুন" className="btn bg-secondary-color text-white w-full px-8" />
                    </form>

                    <div className="divider">অথবা</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5 "
                        />
                        গুগল দিয়ে সাইন আপ করুন
                    </button>

                    <p className="text-sm text-center mt-6">
                        আপনার কি কোনো আকাউন্ট আছে?{" "}
                        <Link to="/patientLogin" className="tertiary-color font-bold">
                            লগইন করুন
                        </Link>
                    </p>

                    <p className="text-sm text-center mt-6">
                        আপনা কি একজন ডাক্তার?{" "}
                        <Link to="/doctorRegister" className="tertiary-color font-bold">
                            সাইন আপ করুন
                        </Link>
                    </p>
                </div>

                {/* Right Section */}
                <div className="relative hidden md:block">
                    <img
                        src="https://i.ibb.co.com/fdXsrqkY/cheerful-middle-aged-man-spreading-hands-park.jpg"
                        alt="HR"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegister;
