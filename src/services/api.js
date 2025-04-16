// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cf46-206-42-117-63.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;
