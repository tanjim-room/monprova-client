import { useEffect, useState } from "react";


const useBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       fetch('http://localhost:8000/blogs')
           .then(res => res.json())
           .then(data => {
            setBlogs(data)
            setLoading(false);})
           .catch(err => {
            console.error("Error fetching blogs data:", err)
            setLoading(false);
           });
    }
    ,[]);

   return [blogs, loading];
};

export default useBlogs;