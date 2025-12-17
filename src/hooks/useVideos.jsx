import { useEffect, useState } from "react";


const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       fetch('/videos.json')
           .then(res => res.json())
           .then(data => {
            setVideos(data)
            setLoading(false);})
           .catch(err => {
            console.error("Error fetching videos data:", err)
            setLoading(false);
           });
    }
    ,[]);

   return [videos, loading];
};

export default useVideos;