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
            <div className="flex justify-center text-center my-8">
                <Button btnName={"আরও দেখুন"}></Button>
            </div>
        </section>


    );
};

export default DoctorSection;