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
        path: "/blogDetails/:blogId",
        element: <BlogDetails></BlogDetails>,
      }
      ]
  },
]);