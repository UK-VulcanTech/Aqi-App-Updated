// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.innovateitsolutions.co.uk',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;
