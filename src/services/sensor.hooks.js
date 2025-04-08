// services/sensor.hooks.js
import { useQuery } from '@tanstack/react-query';
import sensorServices from './sensor.services';
// import sensorServices from './sensor.services';

export const useGetAllSensors = () => {
    return useQuery({
        queryKey: ['sensors'],
        queryFn: async () => {
            try {
                console.log('Fetching sensors from service');
                const response = await sensorServices.getAllSensors();
                console.log('Sensor data fetched successfully:', response.data.length);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch sensors:', error.message);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                }
                throw error;
            }
        },
        retry: 2,
        retryDelay: 1000,
    });
};
