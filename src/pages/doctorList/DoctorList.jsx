import React from 'react';
import PageCover from '../shared/PageCover';
import useDoctors from '../../hooks/useDoctors';
import DoctorCard from '../../components/cards/DoctorCard';

const DoctorList = () => {
    const [doctors] = useDoctors()
    
    return (
        <div>
            <PageCover coverTitle="আমাদের বিশেষজ্ঞ ডাক্তারগণ" coverSubtitle="আপনার স্বাস্থ্যের জন্য আমাদের ডাক্তারদের নির্ভুল পরিচিতি" coverImg="https://i.ibb.co.com/Z6bp254P/medium-shot-scientists-posing-together.jpg"></PageCover>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-12 mx-auto px-0 mt-16">
                {
                    doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor}></DoctorCard>)
                }
            </div>
        </div>
    );
};

export default DoctorList;