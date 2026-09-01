import { useEffect, useState } from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";


const useBlogs = () => {
    // const axiosPublic = useAxiosPublic();
    // const { data: blogs = [] } = useQuery({
    //     queryKey: ['blogs'],
    //     queryFn: async () => {
    //         const res = await axiosPublic.get('/api/blogs')
    //         return res.data
    //     }
    // })
    // return [blogs]

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);

            // const res = await axiosPublic.get("/api/blogs");
            const res = await fetch("https://monprova-server.vercel.app/api/blogs");

            if (!res.ok) {
                throw new Error("Failed");
            }

            const data = await res.json();
            setBlogs(data);
        }
        catch (err) {
            setError("Failed to load");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogs();

        const interval = setInterval(() => {
            fetchBlogs();
        }, 10000)

        return () => clearInterval(interval);
    }, []);

    return { blogs, loading, error };
};

export default useBlogs;