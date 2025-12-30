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
            <SectionHeading heading={"বিশেষজ্ঞ ডাক্তারগণ"} subHeading={"আপনার জন্য আমাদের বিশেষজ্ঞ ডাক্তাররা আছে সবসময়"}></SectionHeading>
            <DoctorSection></DoctorSection>
            <SectionHeading heading={"ব্লগসমুহ"} subHeading={"আপনার মানসিক স্বাস্থ্য সম্পর্কিত ব্লগ পড়ুন"}></SectionHeading>
            <BlogSection></BlogSection>
            <ActionButton link="/blogList" btnName={"সব ব্লগ দেখুন"} bgColor={"bg-secondary-color"}></ActionButton>
            <SectionHeading heading={"ভিডিও সেকশন"} subHeading={"আপনার মানসিক স্বাস্থ্য সম্পর্কিত ভিডিও দেখুন"}></SectionHeading>
            <VideoSection></VideoSection>
            <ActionButton link="/videoList" btnName={"সব ভিডিও দেখুন"} bgColor={"bg-secondary-color"}></ActionButton>
        </div>
    );
};

export default Home;