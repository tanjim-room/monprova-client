import {
  FaClipboardList,
  FaCalendarAlt,
  FaUserMd,
  FaFilePrescription,
  FaBookOpen,
  FaGamepad,
  FaHandsHelping,
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaClock,
  FaMoneyBillWave,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaCogs,
} from "react-icons/fa";

export const patientMenuItems = [
  { title: "হোম", link: "/patientDashboard", icon: <FaHome /> },
  { title: "অ্যাসেসমেন্ট", link: "/patientDashboard/assessment", icon: <FaClipboardList /> },
  { title: "অ্যাপয়েন্টমেন্ট", link: "/patientDashboard/appointment", icon: <FaCalendarAlt /> },
  { title: "ডাক্তার", link: "/dashboardPatient/doctorList", icon: <FaUserMd /> },
  { title: "প্রেসক্রিপশন", link: "/patientDashboard/prescription", icon: <FaFilePrescription /> },
  { title: "রিসোর্স", link: "/dashboardPatient/resources", icon: <FaBookOpen /> },
  { title: "গেমস", link: "/patientDashboard/games", icon: <FaGamepad /> },
  { title: "সাহায্য", link: "/patientDashboard/patientHelp", icon: <FaHandsHelping /> },
  { title: "প্রোফাইল", link: "/patientDashboard/patientProfile", icon: <FaUser /> },
  { title: "লগ আউট", link: "/", icon: <FaSignOutAlt /> ,isLogout: true},
];

export const doctorMenuItems = [
  { title: "হোম", link: "/doctorDashboard", icon: <FaHome /> },
  { title: "অ্যাপয়েন্টমেন্ট", link: "/doctorDashboard/appointmentDoctor", icon: <FaCalendarAlt /> },
  { title: "শিডিউল", link: "/doctorDashboard/schedule", icon: <FaClock /> },
  { title: "ইনকাম", link: "/doctorDashboard/income", icon: <FaMoneyBillWave /> },
  { title: "সাহায্য", link: "/doctorDashboard/doctorHelp", icon: <FaHandsHelping /> },
  { title: "প্রোফাইল", link: "/doctorDashboard/doctorProfile", icon: <FaUser /> },
  { title: "লগ আউট", link: "/", icon: <FaSignOutAlt /> ,isLogout: true},
];

export const adminMenuItems = [
  { title: "হোম", link: "/adminDashboard", icon: <FaHome /> },
  { title: "ইউজার ম্যানেজমেন্ট", link: "/adminDashboard/users", icon: <FaUsers /> },
  { title: "ডাক্তার ম্যানেজমেন্ট", link: "/adminDashboard/doctors", icon: <FaUserMd /> },
  { title: "রিপোর্টস", link: "/adminDashboard/reports", icon: <FaChartBar /> },
  { title: "সিস্টেম সেটিংস", link: "/adminDashboard/settings", icon: <FaCogs /> },
  { title: "প্রোফাইল", link: "/adminDashboard/profile", icon: <FaUserShield /> },
  { title: "লগ আউট", link: "/", icon: <FaSignOutAlt /> ,isLogout: true},
];