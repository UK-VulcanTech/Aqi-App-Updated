// services/sensor.services.js
import axios from 'axios';

// Use exactly this URL since you confirmed data is coming from here
const BASE_URL = 'https://2c10-206-42-117-63.ngrok-free.app';

const sensorServices = {
    getAllSensors: () => {
        console.log(`Making API request to: ${BASE_URL}/sensor-readings`);
        return axios.get(`${BASE_URL}/sensor-readings`, {
            timeout: 10000, // 10 second timeout
        });
    },
    getSevenDaysData: () => {
        console.log(`Making API request to: ${BASE_URL}/sensor-readings/daily-means`);
        return axios.get(`${BASE_URL}/sensor-readings/daily-means`, {
            timeout: 10000, // 10 second timeout
        });
    },
    // Get Sensor Locations
    getSensorLocations: () => {
        console.log(`Making API request to: ${BASE_URL}/sensor-locations`);
        return axios.get(`${BASE_URL}/sensor-locations`, {
            timeout: 10000,
        });
    },
    // Submit Sensor Readings
    submitSensorReading: (data) => {
        console.log(`Posting sensor data to: ${BASE_URL}/sensor-readings`, data);
        return axios.post(`${BASE_URL}/sensor-readings`, data, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

export default sensorServices;
