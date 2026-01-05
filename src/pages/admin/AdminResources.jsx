import React, { useState } from 'react';
import { FaUpload, FaEye } from 'react-icons/fa';

const AdminResources = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [uploadType, setUploadType] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        thumbnail: null,
        thumbnailUrl: '',
        slug: '',
        content: '',
        category: ''
    });

    const IMGBB_API_KEY = '714b4ad18d0cf4ce255329888f21797d';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                thumbnail: file
            }));
        }
    };

    const uploadToImageBB = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const base64String = e.target.result;

                    console.log('Uploading image to backend...');

                    // Send to backend endpoint
                    const response = await fetch('http://localhost:8000/api/upload-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            image: base64String
                        })
                    });

                    const data = await response.json();

                    console.log('Backend response:', data);

                    if (data.success) {
                        console.log('Image uploaded successfully:', data.imageUrl);
                        resolve(data.imageUrl);
                    } else {
                        console.error('ImageBB error:', data.message);
                        alert(`থাম্বনেইল আপলোড ব্যর্থ: ${data.message}`);
                        reject(new Error(data.message));
                    }
                } catch (error) {
                    console.error('Error uploading to ImageBB:', error);
                    alert('থাম্বনেইল আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।');
                    reject(error);
                }
            };

            reader.onerror = (error) => {
                console.error('File read error:', error);
                alert('ফাইল পড়তে ত্রুটি হয়েছে');
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.thumbnail) {
            alert('অনুগ্রহ করে একটি থাম্বনেইল নির্বাচন করুন');
            return;
        }

        setIsUploading(true);

        try {
            const thumbnailUrl = await uploadToImageBB(formData.thumbnail);

            const blogData = {
                title: formData.title,
                author: formData.author,
                thumbnail: thumbnailUrl,
                slug: formData.slug,
                content: formData.content,
                category: formData.category
            };

            // Save blog data to MongoDB
            const response = await fetch('http://localhost:8000/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogData)
            });

            const result = await response.json();

            if (result.success) {
                alert('ব্লগ সফলভাবে আপলোড হয়েছে!');

                setFormData({
                    title: '',
                    author: '',
                    thumbnail: null,
                    thumbnailUrl: '',
                    slug: '',
                    content: '',
                    category: ''
                });
                setUploadType(null);
            } else {
                alert(`ব্লগ সংরক্ষণ ব্যর্থ: ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            alert('ব্লগ আপলোড করতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">রিসোর্স ম্যানেজমেন্ট</h1>

                {activeSection === null && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload Resource Button */}
                        <button
                            onClick={() => setActiveSection('upload')}
                            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-full group-hover:from-blue-600 group-hover:to-indigo-700 transition-all">
                                    <FaUpload className="text-4xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">রিসোর্স আপলোড</h2>
                                <p className="text-gray-600 text-center">নতুন ব্লগ বা ভিডিও আপলোড করুন</p>
                            </div>
                        </button>

                        {/* View Previous Resources Button */}
                        <button
                            onClick={() => setActiveSection('view')}
                            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-full group-hover:from-green-600 group-hover:to-teal-700 transition-all">
                                    <FaEye className="text-4xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">পূর্ববর্তী রিসোর্স দেখুন</h2>
                                <p className="text-gray-600 text-center">আগের ব্লগ এবং ভিডিও দেখুন</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Upload Resource Section */}
                {activeSection === 'upload' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <button
                            onClick={() => {
                                setActiveSection(null);
                                setUploadType(null);
                            }}
                            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                        >
                            ← ফিরে যান
                        </button>

                        {uploadType === null && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">আপলোড করুন</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Upload Blog Button */}
                                    <button
                                        onClick={() => setUploadType('blog')}
                                        className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-6 hover:from-blue-600 hover:to-indigo-700 transition"
                                    >
                                        <div className="text-4xl mb-3">📝</div>
                                        <h3 className="text-xl font-bold">ব্লগ আপলোড</h3>
                                        <p className="text-sm mt-2">নতুন ব্লগ পোস্ট যোগ করুন</p>
                                    </button>

                                    {/* Upload Video Button */}
                                    <button
                                        onClick={() => setUploadType('video')}
                                        className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg p-6 hover:from-purple-600 hover:to-pink-700 transition"
                                    >
                                        <div className="text-4xl mb-3">🎥</div>
                                        <h3 className="text-xl font-bold">ভিডিও আপলোড</h3>
                                        <p className="text-sm mt-2">নতুন ভিডিও যোগ করুন</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Blog Upload Form */}
                        {uploadType === 'blog' && (
                            <div>
                                <button
                                    onClick={() => setUploadType(null)}
                                    className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
                                >
                                    ← আপলোড পৃষ্ঠায় ফিরুন
                                </button>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">ব্লগ আপলোড করুন</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Blog Title */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">ব্লগ শিরোনাম *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="ব্লগ শিরোনাম লিখুন"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Author Name */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">লেখক নাম *</label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="লেখক নাম লিখুন"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Thumbnail */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">থাম্বনেইল (ImageBB-তে আপলোড হবে) *</label>
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                            disabled={isUploading}
                                        />
                                        {formData.thumbnail && (
                                            <p className="text-sm text-green-600 mt-2">✓ নির্বাচিত: {formData.thumbnail.name}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">ImageBB-তে আপলোড করা হবে</p>
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">স্লাগ *</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            placeholder="blog-slug-example"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">URL-বান্ধব স্লাগ (শুধুমাত্র ছোট অক্ষর এবং হাইফেন)</p>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">ক্যাটাগরি *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        >
                                            <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                                            <option value="স্বাস্থ্য">স্বাস্থ্য</option>
                                            <option value="মানসিক স্বাস্থ্য">মানসিক স্বাস্থ্য</option>
                                            <option value="পুষ্টি">পুষ্টি</option>
                                            <option value="ফিটনেস">ফিটনেস</option>
                                            <option value="অন্যান্য">অন্যান্য</option>
                                        </select>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">বিষয়বস্তু *</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="ব্লগের বিষয়বস্তু লিখুন"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            rows="10"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'আপলোড হচ্ছে...' : 'ব্লগ আপলোড করুন'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Video Upload Form - Placeholder */}
                        {uploadType === 'video' && (
                            <div>
                                <button
                                    onClick={() => setUploadType(null)}
                                    className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
                                >
                                    ← আপলোড পৃষ্ঠায় ফিরুন
                                </button>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">ভিডিও আপলোড করুন</h2>
                                <div className="text-center text-gray-600 py-12">
                                    <p>ভিডিও আপলোড ফর্ম শীঘ্রই যোগ করা হবে</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* View Resources Section */}
                {activeSection === 'view' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <button
                            onClick={() => setActiveSection(null)}
                            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                        >
                            ← ফিরে যান
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">পূর্ববর্তী রিসোর্স</h2>
                        <div className="text-center text-gray-600 py-12">
                            <p>রিসোর্স তালিকা এখানে প্রদর্শিত হবে</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminResources;
