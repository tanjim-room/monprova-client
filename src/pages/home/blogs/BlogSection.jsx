import { Link } from "react-router-dom";
import BlogCard from "../../../components/cards/BlogCard";
import useBlogs from "../../../hooks/useBlogs";



const BlogSection = () => {
    const [blogs] = useBlogs();
    return (
        <div className="mt-6" id="blogs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-auto px-4">
                {
                    blogs.map(blog => <BlogCard key={blog.id} blog={blog}></BlogCard>)
                }
            </div>
            
        </div>
    );
};

export default BlogSection;