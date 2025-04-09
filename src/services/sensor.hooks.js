// services/sensor.hooks.js
import { useQuery } from '@tanstack/react-query';
import sensorServices from './sensor.services';

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

// For the last 7 Days
export const useGetSensorDataLastSevenDays = () => {
    return useQuery({
        queryKey: ['sensors', 'lastSevenDays'],
        queryFn: async () => {
            try {
                console.log('Fetching sensor data for last 7 days');
                const response = await sensorServices.getSevenDaysData();
                console.log('7-day sensor data fetched successfully:', response.data.length);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch 7-day sensor data:', error.message);
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
