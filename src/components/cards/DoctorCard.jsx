
import { Link } from 'react-router-dom';
import docImg from '../../assets/doc1.jpg';
import Button from '../Button';
const DoctorCard = ({ doctor }) => {
   
    const { _id, name, designation, expertise, consultationFee, img, yearsOfExperience, degrees, regNo, institute } = doctor;
    return (
        <div className="card bg-base-100 shadow-md border-1">
            <figure>
                <img
                    className="object-cover w-full h-96"
                    src={img || "https://i.ibb.co.com/zVcdq9PG/1704193051.jpg"} 
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h3 className="card-title font-bold text-xl my-0 primary-color">{name}</h3>
                <p className='font-semibold tertiary-color text-lg'>{designation}</p>
                <p className='text-md font-semibold'>{institute}</p>
                <p className='text-sm'>
                {/* {
                    degrees.map((degree, idx) => <span key={idx} className='text-sm'>{degree} ,</span>)

                } */}
                {degrees}

                </p>
                <div className="badge badge-error text-white bg-secondary-color">পরামর্শ ফি: {consultationFee} টাকা</div>
               
                
            </div>
            <div className="mb-6 mx-6">
                   <Link to={`doctorDetails/${_id}`}>
                       <Button btnName={"বিস্তারিত দেখুন"} bgColor="bg-primary-color w-full"></Button>
                   </Link>
            </div>
        </div>
    );
};

export default DoctorCard;