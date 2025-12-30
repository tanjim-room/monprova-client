import React from "react";
import { useParams, Link } from "react-router-dom";

import useBlogs from "../../hooks/useBlogs";

// blog data


const BlogDetails = () => {
    const [blogs, loading] = useBlogs();
    const { blogId } = useParams();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">

                <p className="text-center mt-10 text-lg text-gray-600"> Loading blog details...</p>
            </div>
        );
    }
    const blog = blogs.find((b) => b._id == blogId);

    if (!blog) {
        return (
            <div className="bg-[#EFF7FE] p-4">
                <div className="min-h-[850px] p-16 bg-white rounded-md ">
                    <p className="text-gray-500 text-lg">কোনো ব্লগ পাওয়া যায়নি।</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#EFF7FE] p-4">

            <div className="min-h-[850px] p-8 bg-white rounded-md mx-auto">
                <div className="my-4">
                    <button className="border-2 rounded-md flex justify-center items-center hover:bg-[#E8594A] hover:text-white transition">
                        <Link
                            to="/patientDashboard/resources"
                            className="flex items-center gap-6 px-4 py-2 font-semibold text-xl rounded-md "
                        >
                            <div className='flex gap-4 items-center'>
                                {/* <span className="text-xl"><IoArrowBackSharp></IoArrowBackSharp></span> */}
                                <span className='text-center text-lg'>ফিরে যান</span>
                            </div>
                        </Link>
                    </button>
                </div>
                <div className="mb-8 ">
                    <img src={blog.img} alt="" className="h-[480px] w-full object-cover rounded-md" />
                </div>
                <h1 className="text-3xl font-bold mb-6 primary-color text-left">{blog.title}</h1>
                <div className="badge badge-error text-white bg-tertiary-color my-0">{blog.category}</div>
                <p className="font-semibold text-lg mb-4 text-left">Author: {blog.author}</p>
                
                <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6 text-left">
                    {blog.content}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;