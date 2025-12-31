import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAppointment = () => {
    const axiosSecure = useAxiosSecure();
    const { data: appointments = [] } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/appointments')
            return res.data
        }
    })
    return [appointments]
};

export default useAppointment;