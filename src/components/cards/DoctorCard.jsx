
import { Link } from 'react-router-dom';
import docImg from '../../assets/doc1.jpg';
import Button from '../Button';
const DoctorCard = ({ doctor }) => {
   
    const { id, name, designation, specialities, fee, img, experiance_year, degrees, bmdc_reg_no, current_working_institution } = doctor;
    return (
        <div className="card bg-base-100 shadow-md border-1">
            <figure>
                <img
                    className="object-cover w-full h-96"
                    src={img} 
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h3 className="card-title font-bold text-xl my-0 primary-color">{name}</h3>
                <p className='font-semibold tertiary-color text-lg'>{designation}</p>
                <p className='text-md font-semibold'>{current_working_institution}</p>
                <p className='text-sm'>
                {
                    degrees.map((degree, idx) => <span key={idx} className='text-sm'>{degree} ,</span>)

                }

                </p>
                <div className="badge badge-error text-white bg-secondary-color">পরামর্শ ফি: {fee} টাকা</div>
               
                
            </div>
            <div className="mb-6 mx-6">
                   <Link to={`doctorDetails/${id}`}>
                       <Button btnName={"বিস্তারিত দেখুন"} bgColor="bg-primary-color w-full"></Button>
                   </Link>
            </div>
        </div>
    );
};

export default DoctorCard;