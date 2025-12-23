import { Link, useLocation } from "react-router-dom";
import { patientMenuItems, doctorMenuItems, adminMenuItems } from "../../dashboardMenus.jsx";

const DashboardNavBar = ({ fullName, role }) => {
    const location = useLocation();

    const menuItems =
        role === "admin"
            ? adminMenuItems
            : role === "doctor"
                ? doctorMenuItems
                : patientMenuItems;

    return (
        <aside className="w-1/5 bg-white shadow-lg p-6 fixed h-full overflow-y-auto">
            <div className="mb-12 bg-[#27b294] rounded-md py-4 px-4">
                <h2 className="text-xl font-bold text-[#E8594A]">{fullName}</h2>
                <p className="text-white">
                    {role === "admin"
                        ? "অ্যাডমিন ড্যাশবোর্ড"
                        : role === "doctor"
                            ? "ডাক্তারের ড্যাশবোর্ড"
                            : "রোগীর ড্যাশবোর্ড"}
                </p>
            </div>

            <ul className="space-y-4">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.link;
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
