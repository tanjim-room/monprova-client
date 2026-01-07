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
import AdminResources from "../pages/admin/AdminResources";
import DoctorHome from "../pages/doctor/DoctorHome";
import Resources from "../pages/resources/Resources";
import BlogList from "../pages/blogList/BlogList";
import VideoList from "../pages/videoList/VideoList";
import ResourcesHome from "../pages/resources/ResourcesHome";
import Doctors from "../pages/patient/Doctors";
import PrivateRoute from "./PrivateRoute";
import PatientProfile from "../pages/profile/PatientProfile";
import AppointmentForm from "../pages/appointment/AppointmentForm";
import DoctorProfile from "../pages/profile/DoctorProfile";
import AppointmentPatient from "../pages/appointment/AppointmentPatient";
import AppointmentDetailsPatient from "../pages/appointment/AppointmentDetailsPatient";
import AppointmentDoctor from "../pages/appointment/AppointmentDoctor";
import DoctorSchedule from "../pages/schedule/DoctorSchedule";
import AppointmentDetailsDoctor from "../pages/appointment/AppointmentDetailsDoctor";
import CreatePrescription from "../pages/prescription/CreatePrescription";
import PrescriptionDetails from "../pages/prescription/PrescriptionDetails";
import Prescription from "../pages/prescription/Prescription";
import AdminLogin from "../pages/admin/AdminLogin";
import PatientHelp from "../pages/help/PatientHelp";
import AssessmentList from "../pages/assessment/AssessmentList";
import AssessmentForm from "../pages/assessment/AssessmentForm";
import AssessmentResults from "../pages/assessment/AssessmentResults";
import AssessmentHistory from "../pages/assessment/AssessmentHistory";
import DoctorHelp from "../pages/help/DoctorHelp";
import Income from "../pages/doctor/Income";
import Payout from "../pages/admin/Payout";
import PayoutDetails from "../pages/admin/PayoutDetails";
import UserManagement from "../pages/admin/UserManagement";
import UserDetails from "../pages/admin/UserDetails";
import DoctorManagement from "../pages/admin/DoctorManagement";
import AdminDoctorDetails from "../pages/admin/DoctorDetails";
import AppointmentInfo from "../pages/admin/AppointmentInfo";
import AppointmentDetails from "../pages/admin/AppointmentDetails";
import VerificationRequests from "../pages/admin/VerificationRequests";
import Games from "../pages/games/Games";
import BreathingExercise from "../pages/games/BreathingExercise";
import ColourTheBlock from "../pages/games/ColourTheBlock";
import PopTheBalloon from "../pages/games/PopTheBalloon";
import AppointmentBookings from "../pages/appointment/AppointmentBookings";
import Register from "../pages/signup/Register";
import Login from "../pages/login/Login";

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
        path: "admin",
        element: <AdminLogin></AdminLogin>
      },
      {
        path: "/dashboardAdmin",
        element: <AdminDashboardLayout></AdminDashboardLayout>,
        children: [
          {
            path:"/dashboardAdmin",
            element: <AdminHome></AdminHome>          },
          {
            path: "users",
            element: <UserManagement></UserManagement>
          },
          {
            path: "users/:id",
            element: <UserDetails></UserDetails>
          },
          {
            path: "doctors",
            element: <DoctorManagement></DoctorManagement>
          },
          {
            path: "doctors/:id",
            element: <AdminDoctorDetails></AdminDoctorDetails>
          },
          {
            path: "appointmentInfo",
            element: <AppointmentInfo></AppointmentInfo>
          },
          {
            path: "verification",
            element: <VerificationRequests></VerificationRequests>
          },
          {
            path: "appointments/:id",
            element: <AppointmentDetails></AppointmentDetails>
          },
          {
            path: "resources",
            element: <AdminResources></AdminResources>
          },
          {
            path: "payout",
            element: <Payout></Payout>
          },
          {
            path: "payout/:id",
            element: <PayoutDetails></PayoutDetails>
          }
        ]
      },
      {
        path: "signup",
        element: <Register></Register>
      },
      {
        path: "login",
        element: <Login></Login>
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
    element: <PrivateRoute><PatientDashboardLayout></PatientDashboardLayout></PrivateRoute>,
    children: [
      // Dashboard routes can be added here
      {
        path: "/dashboardPatient",
        element: <PatientHome></PatientHome>
      },
      {
        path: "prescription",
        element: <Prescription></Prescription>
      },
      {
        path: "patientHelp",
        element: <PatientHelp></PatientHelp>
      },
      {
        path: "doctorList",
        element: <Doctors></Doctors>,
        children: [
          {
            index: true,
            element: <DoctorList></DoctorList>
          },
          {
            path: "doctorDetails/:doctorId",
            element: <DoctorDetails></DoctorDetails>,
          }
        ]
      },
      {
        path: "appointmentForm/:doctorId",
        element: <AppointmentForm></AppointmentForm>
      },
      {
        path: "appointment",
        element: <AppointmentPatient></AppointmentPatient>
      },
      {
        path: "bookings",
        element: <AppointmentBookings></AppointmentBookings>
      },
      {
        path: "appointmentDetailsPatient/:appointmentId",
        element: <AppointmentDetailsPatient></AppointmentDetailsPatient>

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
      {
        path: "patientProfile",
        element: <PatientProfile></PatientProfile>
      },
      {
        path: "assessment",
        element: <AssessmentList></AssessmentList>
      },
      {
        path: "assessment/:assessmentId/form",
        element: <AssessmentForm></AssessmentForm>
      },
      {
        path: "assessment/:assessmentId/results",
        element: <AssessmentResults></AssessmentResults>
      },
      {
        path: "assessment/history",
        element: <AssessmentHistory></AssessmentHistory>
      },
      {
        path: "games",
        element: <Games></Games>
      },
      {
        path: "games/breathing",
        element: <BreathingExercise></BreathingExercise>
      },
      {
        path: "games/colour",
        element: <ColourTheBlock></ColourTheBlock>
      },
      {
        path: "games/balloon",
        element: <PopTheBalloon></PopTheBalloon>
      }


    ]
  },
  {
    path: "/dashboardDoctor",
    element: <PrivateRoute role="doctor"><DoctorDashboardLayout></DoctorDashboardLayout></PrivateRoute>,
    children: [
      // Dashboard routes can be added here
      {
        path: "/dashboardDoctor",
        element: <DoctorHome></DoctorHome>
      },
      {
        path: "doctorHelp",
        element: <DoctorHelp></DoctorHelp>

      },
      {
        path: "doctorProfile",
        element: <DoctorProfile></DoctorProfile>
      },
      {
        path: "appointment",
        element: <AppointmentDoctor></AppointmentDoctor>
      },
      {
        path: "schedule",
        element: <DoctorSchedule></DoctorSchedule>
      },
      {
        path: "appointmentDetailsDoctor/:appointmentId",
        element: <AppointmentDetailsDoctor></AppointmentDetailsDoctor>,
      },
      {
        path: "createPrescription/:appointmentId",
        element: <CreatePrescription></CreatePrescription>
      },
      {
        path: "prescriptionDetails/:appointmentId",
        element: <PrescriptionDetails></PrescriptionDetails>
      },
      {
        path: "income",
        element: <Income></Income>
      }
    ]
  },
  
]);