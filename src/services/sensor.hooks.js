// // services/sensor.hooks.js
// import { useMutation, useQuery } from '@tanstack/react-query';
// import sensorServices from './sensor.services';

// export const useGetAllSensors = () => {
//     return useQuery({
//         queryKey: ['sensors'],
//         queryFn: async () => {
//             try {
//                 console.log('Fetching sensors from service');
//                 const response = await sensorServices.getAllSensors();
//                 console.log('Sensor data fetched successfully:', response.data.length);
//                 return response.data;
//             } catch (error) {
//                 console.error('Failed to fetch sensors:', error.message);
//                 if (error.response) {
//                     console.error('Response status:', error.response.status);
//                 }
//                 throw error;
//             }
//         },
//         retry: 2,
//         retryDelay: 1000,
//     });
// };

// // For the last 7 Days
// export const useGetSensorDataLastSevenDays = () => {
//     return useQuery({
//         queryKey: ['sensors', 'lastSevenDays'],
//         queryFn: async () => {
//             try {
//                 console.log('Fetching sensor data for last 7 days');
//                 const response = await sensorServices.getSevenDaysData();
//                 console.log('7-day sensor data fetched successfully:', response.data.length);
//                 return response.data;
//             } catch (error) {
//                 console.error('Failed to fetch 7-day sensor data:', error.message);
//                 if (error.response) {
//                     console.error('Response status:', error.response.status);
//                 }
//                 throw error;
//             }
//         },
//         retry: 2,
//         retryDelay: 1000,
//     });
// };


// // Get Locatinons Data
// export const useGetSensorLocations = () => {
//     return useQuery({
//         queryKey: ['locations'],
//         queryFn: async () => {
//             try {
//                 console.log('Fetching sensor locations');
//                 const response = await sensorServices.getSensorLocations();
//                 console.log('Locations fetched successfully:', response.data.length);
//                 return response.data;
//             } catch (error) {
//                 console.error('Failed to fetch locations:', error.message);
//                 if (error.response) {
//                     console.error('Response status:', error.response.status);
//                 }
//                 throw error;
//             }
//         },
//         retry: 2,
//         retryDelay: 1000,
//     });
// };

// // Submit Sensor Data
// // Mutation hook for submitting sensor data
// export const useSubmitSensorReading = () => {
//     return useMutation({
//         mutationFn: (data) => {
//             return sensorServices.submitSensorReading(data);
//         },
//         onSuccess: () => {
//             console.log('Sensor reading submitted successfully');
//         },
//         onError: (error) => {
//             console.error('Failed to submit sensor reading:', error.message);
//             if (error.response) {
//                 console.error('Response status:', error.response.status);
//                 console.error('Response data:', error.response.data);
//             }
//         },
//     });
// };




// ------------------------------------------------------------------------------- //


// // services/sensor.hooks.js (with WebSocket enhancements)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sensorServices from './sensor.services';
// import { useWebSocketEnhancedQuery } from './useWebSocketEnhancedQuery';
import { useWebSocketEnhancedQuery } from './useWebSocketEnhancedQuery.js';

export const useGetAllSensors = () => {
    const query = useQuery({
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

    // Add WebSocket enhancement
    useWebSocketEnhancedQuery(
        ['sensors'],
        (message) => {
            // Determine if this WebSocket message should update sensor readings
            return message.type === 'sensor_reading' || message.sensor_id !== undefined;
        },
        (oldData, message) => {
            // Update sensor data with WebSocket message
            if (!Array.isArray(oldData)) { return oldData; }

            const index = oldData.findIndex(item => item.sensor_id === message.sensor_id);

            if (index >= 0) {
                // Update existing reading
                const newData = [...oldData];
                newData[index] = { ...newData[index], ...message };
                return newData;
            } else {
                // Add new reading
                return [...oldData, message];
            }
        }
    );

    return query;
};

// For the last 7 Days
export const useGetSensorDataLastSevenDays = () => {
    const query = useQuery({
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

    // Add WebSocket enhancement for daily data updates
    useWebSocketEnhancedQuery(
        ['sensors', 'lastSevenDays'],
        (message) => {
            // Only update if it's a daily summary update
            return message.type === 'daily_summary_update';
        },
        (oldData, message) => {
            if (!Array.isArray(oldData)) { return oldData; }

            // Find if we have data for this date
            const date = message.date;
            const index = oldData.findIndex(item => item.date === date);

            if (index >= 0) {
                // Update existing daily data
                const newData = [...oldData];
                newData[index] = { ...newData[index], ...message };
                return newData;
            } else {
                // Add new daily data
                return [...oldData, message];
            }
        }
    );

    return query;
};

// Get Locations Data
export const useGetSensorLocations = () => {
    const query = useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            try {
                console.log('Fetching sensor locations');
                const response = await sensorServices.getSensorLocations();
                console.log('Locations fetched successfully:', response.data.length);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch locations:', error.message);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                }
                throw error;
            }
        },
        retry: 2,
        retryDelay: 1000,
    });

    // Add WebSocket enhancement
    useWebSocketEnhancedQuery(
        ['locations'],
        (message) => {
            // Determine if this message should update locations
            return message.type === 'location_update';
        },
        (oldData, message) => {
            if (!Array.isArray(oldData)) { return oldData; }

            const index = oldData.findIndex(location => location.id === message.id);

            if (index >= 0) {
                // Update existing location
                const newData = [...oldData];
                newData[index] = { ...newData[index], ...message };
                return newData;
            } else {
                // Add new location
                return [...oldData, message];
            }
        }
    );

    return query;
};

// Get Latest AQI Mean
export const useGetLatestMeanAQIValues = () => {
    return useQuery({
        queryKey: ['MeanAQIValues'],
        queryFn: async () => {
            try {
                console.log('Fetching Latest Mean AQI Values');
                const response = await sensorServices.getLatestMeanAQIValues();
                console.log('Latest Mean AQI data fetched successfully:', response.data);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch latest AQI data from sensors:', error.message);
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


export const useGetHealthAdvisory = () => {
    return useQuery({
        queryKey: ['HealthAdvisory'],
        queryFn: async () => {
            try {
                console.log('Fetching Latest Mean AQI Values');
                const response = await sensorServices.getHealthAdvisory();
                console.log('Latest Mean AQI data fetched successfully:', response.data);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch latest AQI data from sensors:', error.message);
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



// Submit Sensor Data
// Submit Sensor Data
// Submit Sensor Data
export const useSubmitSensorReading = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            return sensorServices.submitSensorReading(data);
        },
        onSuccess: (response, variables) => {
            console.log('Sensor reading submitted successfully for location:', variables.location);

            // Instead of trying to update the cache manually,
            // simply invalidate all sensor-related queries to force a fresh fetch
            queryClient.invalidateQueries(['sensors']);

            // If you have other related queries that should refresh:
            queryClient.invalidateQueries(['MeanAQIValues']);

            console.log('Invalidated queries to refresh all components');
        },
        onError: (error) => {
            console.error('Failed to submit sensor reading:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
        },
    });
};



// Get Latest AQI Mean


