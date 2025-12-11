import React from 'react';
import Hero from '../hero/Hero';
import SectionHeading from '../../shared/SectionHeader';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <SectionHeading heading={"বিশেষজ্ঞ ডাক্তারগণ"} subHeading={"আপনার জন্য আমাদের বিশেষজ্ঞ ডাক্তাররা আছে সবসময়"}></SectionHeading>
        </div>
    );
};

export default Home;