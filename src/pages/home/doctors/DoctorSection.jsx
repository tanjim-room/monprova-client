import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import DoctorCard from "../../../components/cards/DoctorCard";
import useDoctors from "../../../hooks/useDoctors";

const DoctorSection = () => {
    const [doctors] = useDoctors();
    return (
        <section>
            <div className="grid grid-cols-3 gap-12 mx-auto px-24">
                {
                    doctors.slice(0, 6).map(doctor => <DoctorCard key={doctor.id} doctor={doctor}></DoctorCard>)
                }
            </div>
            <div className="flex justify-center text-center my-12">
                <Link to="/doctorList">
                    <Button btnName={"সব ডাক্তার দেখুন"} bgColor={"bg-secondary-color"}></Button>
                </Link>
            </div>
        </section>


    );
};

export default DoctorSection;