import React from 'react';
import Hero from '../hero/Hero';
import SectionHeading from '../../shared/SectionHeader';
import DoctorSection from '../doctors/DoctorSection';
import BlogSection from '../blogs/BlogSection';
import VideoSection from '../videos/VideoSection';
import ActionButton from '../../../components/ActionButton';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <div id="doctors" >
                <div className='my-16'>
                    <SectionHeading
                        heading="বিশেষজ্ঞ ডাক্তারগণ"
                        subHeading="আপনার জন্য আমাদের বিশেষজ্ঞ ডাক্তাররা আছে সবসময়"
                    />
                </div>
                <DoctorSection />
            </div>
            <ActionButton link="/doctorList" btnName={"সব ডাক্তার দেখুন"} bgColor={"bg-secondary-color"}></ActionButton>
            
            

            <div id="blogs" className='px-24'>
                <div className='my-16'>
                    <SectionHeading
                        heading="ব্লগসমুহ"
                        subHeading="আপনার মানসিক স্বাস্থ্য সম্পর্কিত ব্লগ পড়ুন"
                    />
                </div>
                <BlogSection />
            </div>
            <ActionButton link="/blogList" btnName={"সব ব্লগ দেখুন"} bgColor={"bg-secondary-color"}></ActionButton>
            <div id="videos" className='px-24'>
                <div className='my-16'>
                    <SectionHeading
                        heading="ভিডিও সেকশন"
                        subHeading="আপনার মানসিক স্বাস্থ্য সম্পর্কিত ভিডিও দেখুন"
                    />
                </div>
                <VideoSection />
            </div>

            <ActionButton link="/videoList" btnName={"সব ভিডিও দেখুন"} bgColor={"bg-secondary-color"}></ActionButton>
        </div>
    );
};

export default Home;





