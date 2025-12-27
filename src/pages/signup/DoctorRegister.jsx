import React, { useContext, useState } from 'react';
import Button from '../../components/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../providers/AuthProvider';
import { sendEmailVerification } from 'firebase/auth';

const DoctorRegister = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/dashboardDoctor"
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
        setError("গুগল দিয়ে সাইন আপ করা যায়নি");
        console.error(err.message);
    }
};

    const handleSignUp = (event) => {
        event.preventDefault();
        setError(""); // reset error

        const form = event.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;

        // ===== Validation =====
        if (!name) {
            setError("আপনার নাম দিন");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("আপনার সঠিক ইমেইল দিন");
            return;
        }

        if (password.length < 6) {
            setError("কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড দিন");
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        if (!passwordRegex.test(password)) {
            setError(
                "পাসওয়ার্ড এ কমপক্ষে একটি করে আপার কেস, লোয়ার কেস, সংখ্যা ও বিশেষ চিহ্ন দিন "
            );
            return;
        }

        // ===== Firebase Signup =====
       signUpEmail(email, password)
    .then(result => {
        const createdUser = result.user;

        sendEmailVerification(createdUser).then(() => {
            setError(
                "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে। লগইন করার আগে ভেরিফাই করুন।"
            );
        });

        // ❌ No redirect here
    })
    .catch(() => {
        setError("এই ইমেইলটি ব্যবহৃত হয়েছে");
    });

    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <Helmet>
                <title>Doctor Register</title>
            </Helmet>
            <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2">মনপ্রভায় স্বাগতম</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        একজন ডাক্তার হিসেবে শুরু করুন।
                    </p>

                    <form action="" onSubmit={handleSignUp}>
                        {
                            error && <p className="text-red-600 text-sm mb-2">** {error} **</p>

                        }
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">নাম দিন</span>
                            </label>
                            <input
                                name="name"
                                type="text"
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
                        <Link to="/doctorLogin" className="tertiary-color font-bold">

                            লগইন করুন

                        </Link>
                    </p>

                    <p className="text-sm text-center mt-6">
                        আপনি যদি একজন রোগী হয়ে থাকেন?{" "}
                        <Link to="/patientRegister" className="tertiary-color font-bold">
                            <a href="" className="tertiary-color font-bold">
                                সাইন আপ করুন
                            </a>
                        </Link>
                    </p>
                </div>


                {/* Right Section */}
                <div className="relative hidden md:block">
                    <img
                        src="https://i.ibb.co.com/whH9DckW/portrait-male-doctor-patient.jpg"
                        alt="HR"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>


                    {/* <div className="relative z-10 p-10 text-white flex flex-col justify-end h-full">
                        <div className="badge badge-primary mb-4">Be Confidently</div>
                        <h3 className="text-2xl font-semibold mb-2">
                            Streamline Your HR Tasks
                        </h3>
                        <p className="text-sm max-w-sm">
                            Unlock the power of our advanced HR Dashboard. Effortlessly oversee
                            every aspect of your team’s progress and monitor key performance
                            indicators with ease.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}


export default DoctorRegister;