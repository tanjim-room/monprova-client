import { Link, useLocation, useNavigate } from "react-router-dom";
import { patientMenuItems, doctorMenuItems, adminMenuItems } from "../../dashboardMenus.jsx";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider.jsx";
import Logo from "../Logo.jsx";

const DashboardNavBar = ({ fullName, role }) => {
    const { logOut } = useContext(AuthContext)
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();

        if (role === "doctor") {
            navigate("/login", { replace: true });
        } else if (role === "admin") {
            navigate("/admin", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    };



    const menuItems =
        role === "admin" ? adminMenuItems
            : role === "doctor" ? doctorMenuItems
                : patientMenuItems;

    return (
        <aside className="w-1/5 bg-white shadow-lg p-6 fixed h-full overflow-y-auto">
            <div className="mb-4">
                <Logo></Logo>
            </div>
            <div className="mb-12 bg-secondary-color rounded-md py-4 px-4">
                
                {/* <h2 className="text-xl font-bold text-[#E8594A]">{fullName}</h2> */}
                <p className="text-white">
                    {role === "admin" ? "অ্যাডমিন ড্যাশবোর্ড"
                        : role === "doctor" ? "ডাক্তারের ড্যাশবোর্ড"
                            : "রোগীর ড্যাশবোর্ড"}
                </p>
            </div>
                        
            <ul className="space-y-4">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.link;

                    // 🔴 Logout item
                    if (item.isLogout) {
                        return (
                            <li key={index} className="border rounded-md">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-6 px-4 py-2 text-xl font-semibold
                        rounded-md text-red-600 hover:bg-red-600 hover:text-white transition"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </button>
                            </li>
                        );
                    }

                    // 🟢 Normal menu item
                    return (
                        <li key={index} className="border rounded-md">
                            <Link
                                to={item.link}
                                className={`flex items-center gap-6 px-4 py-2 text-xl font-semibold rounded-md transition
                    ${isActive
                                        ? "bg-[#27b294] text-white"
                                        : "hover:bg-[#27b294] hover:text-white"
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            

        </aside>
    );
};

export default DashboardNavBar;
