import {
  createBrowserRouter,
} from "react-router-dom";


import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/home/Home";
import PatientLogin from "../pages/login/PatientLogin";
import PatientRegister from "../pages/signup/PatientRegister";
import DoctorLogin from "../pages/login/DoctorLogin";
import DoctorRegister from "../pages/signup/DoctorRegister";
import DoctorList from "../pages/doctorList/DoctorList";
import DoctorDetails from "../pages/doctorDetails/DoctorDetails";
import BlogDetails from "../pages/blogDetails/BlogDetails";
import PatientDashboardLayout from "../layouts/PatientDashboardLayout";
import PatientHome from "../pages/patient/PatientHome";
import DoctorDashboardLayout from "../layouts/DoctorDashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminHome from "../pages/admin/AdminHome";
import DoctorHome from "../pages/doctor/DoctorHome";
import Resources from "../pages/resources/Resources";
import BlogList from "../pages/blogList/BlogList";
import VideoList from "../pages/videoList/VideoList";
import ResourcesHome from "../pages/resources/ResourcesHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "patientLogin",
        element: <PatientLogin></PatientLogin>
      },
      {
        path: "patientRegister",
        element: <PatientRegister></PatientRegister>
      },
      {
        path: "doctorLogin",
        element: <DoctorLogin></DoctorLogin>
      },
      {
        path: "doctorRegister",
        element: <DoctorRegister></DoctorRegister>
      },
      {
        path: "doctorList",
        element: <DoctorList></DoctorList>
      },
      {
        path: "doctorDetails/:doctorId",
        element: <DoctorDetails></DoctorDetails>,
      },

      {
        path: "blogList",
        element: <BlogList></BlogList>,
      },
      {
        path: "videoList",
        element: <VideoList></VideoList>,
      },

    ]
  },
  {
    path: "/dashboardPatient",
    element: <PatientDashboardLayout></PatientDashboardLayout>,
    children: [
      // Dashboard routes can be added here
      {
        path: "/dashboardPatient",
        element: <PatientHome></PatientHome>
      },
      {
        path: "doctorList",
        element: <DoctorList></DoctorList>,
      },

      {
        path: "resources",
        element: <Resources></Resources>,
        children: [
          {
            index: true,
            element: <ResourcesHome></ResourcesHome>
          },
          {
            path: "blogs",
            element: <BlogList></BlogList>
          },
          {
            path: "blogDetails/:blogId",
            element: <BlogDetails></BlogDetails>,
          },
          {
            path: "videos",
            element: <VideoList></VideoList>
          }

        ]
      },


    ]
  },
  {
    path: "/dashboardDoctor",
    element: <DoctorDashboardLayout></DoctorDashboardLayout>,
    children: [
      // Dashboard routes can be added here
      {
        path: "/dashboardDoctor",
        element: <DoctorHome></DoctorHome>
      },
      {
      }
    ]
  },
  {
    path: "/dashboardAdmin",
    element: <AdminDashboardLayout></AdminDashboardLayout>,
    children: [
      // Dashboard routes can be added here
      {
        path: "/dashboardAdmin",
        element: <AdminHome></AdminHome>
      },
      {
      }
    ]
  }
]);