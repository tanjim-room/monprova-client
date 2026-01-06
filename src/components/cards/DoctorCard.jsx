import { Link } from 'react-router-dom';
import Button from '../Button';

const DoctorCard = ({ doctor }) => {
    const { _id, name, designation, expertise, consultationFee, img, yearsOfExperience, degrees, regNo, institute, image } = doctor;

    return (
        <div className="card bg-base-100 shadow-md border rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
            <figure>
                <img
                    className="object-cover w-32 h-32 rounded-full mx-auto mt-4"
                    src={image || "https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"} 
                    alt={name} />
            </figure>
            <div className="card-body p-4">
                <h3 className="card-title font-bold text-lg text-primary-color">{name}</h3>
                <p className='font-semibold text-tertiary-color text-sm'>{designation}</p>
                <p className='text-xs text-gray-600'>{institute}</p>
                <p className='text-xs text-gray-600'>{degrees}</p>
                <div className="badge badge-error text-white bg-secondary-color text-sm mt-2">পরামর্শ ফি: {consultationFee} টাকা</div>
            </div>
            <div className="mb-4 mx-4">
                <Link to={`doctorDetails/${_id}`}>
                    <Button btnName={"বিস্তারিত দেখুন"} bgColor="bg-primary-color w-full py-2"></Button>
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
