import React, { useState, useEffect } from 'react';
import PageCover from '../shared/PageCover';
import DoctorCard from '../../components/cards/DoctorCard';
import useDoctor from '../../hooks/useDoctor';

const DoctorList = () => {
    const [doctors] = useDoctor();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Initially set to empty array
    const [showStatus, setShowStatus] = useState('both');  // 'all', 'online', 'offline'

    // Mapping of English division names to Bangla names
    const divisionMapping = {
        'Dhaka': 'ঢাকা',
        'Chattogram': 'চট্টগ্রাম',
        'Khulna': 'খুলনা',
        'Rajshahi': 'রাজশাহী',
        'Barishal': 'বরিশাল',
        'Sylhet': 'সিলেট',
        'Rangpur': 'রংপুর',
        'Mymensingh': 'ময়মনসিংহ',
        
    };

    // List of divisions in English
    const divisions = Object.keys(divisionMapping);

    // Handle search input change
    const handleSearch = () => {
        let results = doctors;

        // ✅ Filter only verified doctors
        results = results.filter(doctor => doctor.verificationStatus === 'verified');

        // If there is a search query, filter the doctors based on that
        if (searchQuery) {
            results = results.filter(doctor =>
                Object.values(doctor).some(value =>
                    value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply division filter
        if (selectedDivision) {
            results = results.filter(doctor =>
                doctor.division?.toLowerCase() === selectedDivision.toLowerCase()
            );
        }

        // Apply status filter (online/offline)
        if (showStatus === 'online') {
            results = results.filter(doctor => doctor.medium === 'online');
        } else if (showStatus === 'offline') {
            results = results.filter(doctor => doctor.medium === 'offline');
        }

        // Update filtered doctors list
        setFilteredDoctors(results);
    };

    // Handle division filter change (real-time)
    const handleDivisionFilter = () => {
        let results = doctors;

        // ✅ Filter only verified doctors
        results = results.filter(doctor => doctor.verificationStatus === 'verified');

        // Apply division filter if selected
        if (selectedDivision) {
            results = results.filter(doctor =>
                doctor.division?.toLowerCase() === selectedDivision.toLowerCase()
            );
        }

        // Apply status filter (online/offline)
        if (showStatus === 'online') {
            results = results.filter(doctor => doctor.medium === 'online');
        } else if (showStatus === 'offline') {
            results = results.filter(doctor => doctor.medium === 'offline');
        }

        // Update filtered doctors list
        setFilteredDoctors(results);
    };

    // Handle reset button click (clear search and division filter)
    const handleReset = () => {
        setSearchQuery('');
        setSelectedDivision('');
        setShowStatus('both');  // Show all doctors
        // setFilteredDoctors([]);  // Reset to show no doctors
    };

    // Effect to filter doctors based on search query or division whenever they change
    useEffect(() => {
        handleDivisionFilter();  // Update filter when division changes or search is applied
    }, [selectedDivision, doctors, searchQuery, showStatus]);

    // Handle showing all doctors
    const showAllDoctors = () => {
        setShowStatus('both');
        handleSearch();
    };

    // Handle showing online doctors only
    const showOnlineDoctors = () => {
        setShowStatus('online');
        handleSearch();
    };

    // Handle showing offline doctors only
    const showOfflineDoctors = () => {
        setShowStatus('offline');
        handleSearch();
    };

    return (
        <div>
            <PageCover 
                coverTitle="আমাদের বিশেষজ্ঞ ডাক্তারগণ" 
                coverSubtitle="আপনার স্বাস্থ্যের জন্য আমাদের ডাক্তারদের নির্ভুল পরিচিতি" 
                coverImg="https://i.ibb.co.com/Z6bp254P/medium-shot-scientists-posing-together.jpg" 
            />
            
            <div className="my-8 text-center">
                {/* Search input with width adjustment */}
                <input
                    type="text"
                    placeholder="ডাক্তার খুঁজুন..."
                    className="border px-4 py-2 rounded w-full max-w-xl mx-auto"  // Wider search box
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}  // Trigger search query update
                />

                <button
                    onClick={handleSearch}  // Trigger search on button click
                    className="ml-4 px-4 py-2 bg-primary-color text-white rounded"
                >
                    খুঁজুন
                </button>

                {/* Division filter dropdown */}
                <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}  // Trigger division filter on selection
                    className="ml-4 px-4 py-2 border rounded"
                >
                    <option value="">সব বিভাগ</option>
                    {divisions.map((division) => (
                        <option key={division} value={division}>
                            {divisionMapping[division]}  {/* Show Bangla division names */}
                        </option>
                    ))}
                </select>
                
                <button
                    onClick={handleReset}  // Reset both search and division filters
                    className="ml-4 px-4 py-2 bg-secondary-color text-white rounded"
                >
                    রিসেট
                </button>

                {/* Buttons for showing all, online, and offline doctors */}
                <div className="mt-4">
                    <button
                        onClick={showAllDoctors}
                        className={`ml-4 px-4 py-2 rounded ${showStatus === 'both' ? 'bg-primary-color text-white' : 'bg-gray-500 text-white'}`}
                    >
                        সব ডাক্তার
                    </button>
                    <button
                        onClick={showOnlineDoctors}
                        className={`ml-4 px-4 py-2 rounded ${showStatus === 'online' ? 'bg-primary-color text-white' : 'bg-gray-500 text-white'}`}
                    >
                        অনলাইন ডাক্তার
                    </button>
                    <button
                        onClick={showOfflineDoctors}
                        className={`ml-4 px-4 py-2 rounded ${showStatus === 'offline' ? 'bg-primary-color text-white' : 'bg-gray-500 text-white'}`}
                    >
                        অফলাইন ডাক্তার
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-12 mx-auto px-0 mt-16">
                {
                    filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))
                    ) : (
                        <p>কোনো ডাক্তারের তথ্য পাওয়া যায়নি।</p>
                    )
                }
            </div>
        </div>
    );
};

export default DoctorList;
