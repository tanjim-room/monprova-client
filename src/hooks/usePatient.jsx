import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const usePatient = () => {
    const axiosSecure = useAxiosSecure();
    const { data: patients = [] } = useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/patients')
            return res.data
        }
    })
    return [patients]
};

export default usePatient;