// services/sensor.hooks.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sensorServices from './sensor.services';
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
            if (!Array.isArray(oldData)) { return oldData || []; }

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
            if (!Array.isArray(oldData)) { return oldData || []; }

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
            if (!Array.isArray(oldData)) { return oldData || []; }

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

// Get Latest AQI Mean - FIXED
export const useGetLatestMeanAQIValues = () => {
    const query = useQuery({
        queryKey: ['MeanAQIValues'],
        queryFn: async () => {
            try {
                console.log('Fetching Latest Mean AQI Values');
                const response = await sensorServices.getLatestMeanAQIValues();

                // Check if response and response.data exist before proceeding
                if (!response || !response.data) {
                    throw new Error('Invalid response format from AQI service');
                }

                console.log('Latest Mean AQI data fetched successfully:', response.data);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch latest AQI data from sensors:', error.message);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                }
                // Return a default empty object instead of throwing to prevent UI errors
                return { error: true, message: 'Failed to load AQI data' };
            }
        },
        retry: 3,  // Increased retries for this critical data
        retryDelay: 2000,  // Longer delay between retries
        staleTime: 60000,  // Data stays fresh for 1 minute
        cacheTime: 300000,  // Keep in cache for 5 minutes
    });

    // Add WebSocket enhancement for AQI updates
    useWebSocketEnhancedQuery(
        ['MeanAQIValues'],
        (message) => {
            // Only process AQI updates
            return message && message.type === 'aqi_update';
        },
        (oldData, message) => {
            // Safely handle the update with data validation
            if (!message || !message.data) return oldData || {};
            if (!oldData) return message.data;
            return { ...oldData, ...message.data };
        }
    );

    return query;
};

export const useGetHealthAdvisory = () => {
    const query = useQuery({
        queryKey: ['HealthAdvisory'],
        queryFn: async () => {
            try {
                console.log('Fetching Health Advisory');
                const response = await sensorServices.getHealthAdvisory();
                console.log('Health Advisory data fetched successfully:', response.data);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch health advisory data:', error.message);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                }
                // Return a default empty object instead of throwing to prevent UI errors
                return { error: true, message: 'Failed to load health advisory data' };
            }
        },
        retry: 2,
        retryDelay: 1000,
    });

    // Add WebSocket enhancement for health advisory updates
    useWebSocketEnhancedQuery(
        ['HealthAdvisory'],
        (message) => {
            // Only process health advisory updates
            return message && message.type === 'health_advisory_update';
        },
        (oldData, message) => {
            if (!message || !message.data) return oldData || {};
            if (!oldData) return message.data;
            return { ...oldData, ...message.data };
        }
    );

    return query;
};

// Submit Sensor Data
export const useSubmitSensorReading = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            try {
                const response = await sensorServices.submitSensorReading(data);
                return response;
            } catch (error) {
                console.error('Error in mutation function:', error);
                throw error;
            }
        },
        onSuccess: (response, variables) => {
            console.log('Sensor reading submitted successfully for location:', variables.location);

            // Instead of trying to update the cache manually,
            // simply invalidate all sensor-related queries to force a fresh fetch
            queryClient.invalidateQueries(['sensors']);
            queryClient.invalidateQueries(['MeanAQIValues']);
            queryClient.invalidateQueries(['sensors', 'lastSevenDays']);
            queryClient.invalidateQueries(['HealthAdvisory']);

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
