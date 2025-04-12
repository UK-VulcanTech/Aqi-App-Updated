// services/sensor.services.js
import axios from 'axios';

// Use exactly this URL since you confirmed data is coming from here
const BASE_URL = 'https://e090-206-42-117-63.ngrok-free.app';

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
};

export default sensorServices;
