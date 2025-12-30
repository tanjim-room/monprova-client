import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useDoctor = () => {
    const axiosSecure = useAxiosSecure();
    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/doctors')
            return res.data
        }
    })
    return [doctors]
};

export default useDoctor;