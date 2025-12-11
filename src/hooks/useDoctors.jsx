import { useEffect, useState } from "react";


const useDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       fetch('/doctors.json')
           .then(res => res.json())
           .then(data => setDoctors(data))
           .catch(err => console.error("Error fetching doctors data:", err));
    },[]);

   return [doctors, loading];
};

export default useDoctors;