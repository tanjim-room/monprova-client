import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavBar from '../components/NavBar/DashboardNavBar';

const PatientDashboardLayout = () => {
    return (
        <div>
            <DashboardNavBar role="patient"></DashboardNavBar>
            <main className="pt-16 md:pt-0 md:ml-[20%] flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">
               <Outlet></Outlet>
            </main>
        </div>
    );
};

export default PatientDashboardLayout;