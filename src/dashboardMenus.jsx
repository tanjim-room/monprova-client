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
  { title: "হোম", link: "/dashboardPatient", icon: <FaHome /> },
  { title: "অ্যাসেসমেন্ট", link: "/dashboardPatient/assessment", icon: <FaClipboardList /> },
  { title: "অ্যাপয়েন্টমেন্ট", link: "/dashboardPatient/appointment", icon: <FaCalendarAlt /> },
  { title: "ডাক্তার", link: "/dashboardPatient/doctorList", icon: <FaUserMd /> },
  { title: "প্রেসক্রিপশন", link: "/patientDashboard/prescription", icon: <FaFilePrescription /> },
  { title: "রিসোর্স", link: "/dashboardPatient/resources", icon: <FaBookOpen /> },
  { title: "গেমস", link: "/dashboardPatient/games", icon: <FaGamepad /> },
  { title: "সাহায্য", link: "/dashboardPatient/patientHelp", icon: <FaHandsHelping /> },
  { title: "প্রোফাইল", link: "/dashboardPatient/patientProfile", icon: <FaUser /> },
  { title: "লগ আউট", link: "/", icon: <FaSignOutAlt /> ,isLogout: true},
];

export const doctorMenuItems = [
  { title: "হোম", link: "/dashboardDoctor", icon: <FaHome /> },
  { title: "অ্যাপয়েন্টমেন্ট", link: "/dashboardDoctor/appointmentDoctor", icon: <FaCalendarAlt /> },
  { title: "শিডিউল", link: "/dashboardDoctor/schedule", icon: <FaClock /> },
  { title: "ইনকাম", link: "/dashboardDoctor/income", icon: <FaMoneyBillWave /> },
  { title: "সাহায্য", link: "/dashboardDoctor/doctorHelp", icon: <FaHandsHelping /> },
  { title: "প্রোফাইল", link: "/dashboardDoctor/doctorProfile", icon: <FaUser /> },
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