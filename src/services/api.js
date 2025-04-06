// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://6073-182-185-183-76.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;
