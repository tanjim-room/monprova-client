import { Link } from "react-router-dom";
import BlogCard from "../../../components/cards/BlogCard";
import useBlogs from "../../../hooks/useBlogs";
import Button from "../../../components/Button";


const BlogSection = () => {
    const [blogs] = useBlogs();
    return (
        <div>
            <div className="grid grid-cols-3 gap-12 mx-auto px-24">
                {
                    blogs.map(blog => <BlogCard key={blog.id} blog={blog}></BlogCard>)
                }
            </div>
            <div className="flex justify-center text-center my-12">
                <Link to="/doctorList">
                    <Button btnName={"সব ব্লগ দেখুন"} bgColor={"bg-secondary-color"}></Button>
                </Link>
            </div>
        </div>
    );
};

export default BlogSection;