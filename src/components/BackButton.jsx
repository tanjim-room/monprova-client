import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = ({destination}) => {
    return (
        <div className="my-4">
            <Link to={`${destination}`}>
                <button className="border-2 rounded-md flex justify-center items-center hover:bg-[#E8594A] hover:text-white transition px-4 py-2 font-semibold text-lg">
                    ফিরে যান
                </button>
            </Link>
        </div>
    );
};

export default BackButton;