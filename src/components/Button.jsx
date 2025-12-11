import React from 'react';

const Button = ({btnName}) => {
    return (
        <div>
            <button type="button" className="btn bg-primary-color text-white px-8 py-6">{btnName}</button>
        </div>
    );
};

export default Button;