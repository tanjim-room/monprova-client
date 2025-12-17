import React from 'react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const PatientRegister = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2">মনপ্রভায় স্বাগতম</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        একজন রোগী হিসেবে শুরু করুন।
                    </p>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">নাম দিন</span>
                        </label>
                        <input
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
                            placeholder="আপনার পাসওয়ার্ড লিখুন"
                            className="input input-bordered w-full px-4 bg-gray-200"
                        />
                    </div>


                    <Button btnName={"সাইন আপ করুন"} bgColor="bg-secondary-color w-full mb-4"></Button>


                    <div className="divider">অথবা</div>


                    <button className="btn btn-outline w-full flex gap-2 bg-primary-color text-white py-4">
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
                        <a href="" className="tertiary-color font-bold">
                            লগইন করুন
                        </a>
                        </Link>
                    </p>

                    <p className="text-sm text-center mt-6">
                        আপনা কি একজন ডাক্তার?{" "}
                        <Link to="/doctorRegister" className="tertiary-color font-bold">
                        <a href="" className="tertiary-color font-bold">
                            সাইন আপ করুন
                        </a>
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


export default PatientRegister;