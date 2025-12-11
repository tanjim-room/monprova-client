
import docImg from '../../assets/doc1.jpg';
import Button from '../Button';
const DoctorCard = ({ doctor }) => {
   
    const { name, designation, specialities, fee, img, experiance_year, degrees, bmdc_reg_no, current_working_institution } = doctor;
    return (
        <div className="card bg-base-100 shadow-md border-1">
            <figure>
                <img
                    className="object-cover w-full"
                    src={docImg} 
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h3 className="card-title font-bold text-xl my-0">{name}</h3>
                <p className='font-semibold primary-color text-lg'>{designation}</p>
                <p className='text-md'>{current_working_institution}</p>
                <p className='text-sm'>
                {
                    degrees.map((degree, idx) => <span key={idx} className='text-sm'>{degree} ,</span>)

                }

                </p>

                
            </div>
            <div className="my-6 mx-6">
                   <Button btnName={"বিস্তারিত দেখুন"}></Button>
            </div>
        </div>
    );
};

export default DoctorCard;