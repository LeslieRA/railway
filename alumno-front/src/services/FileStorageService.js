// src/services/FileStorageService.js
import axios from 'axios';

const API_URL = "http://localhost:7073/api/files"; // Tu URL del backend

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Devuelve la promesa de Axios
    return axios.post(API_URL + "/upload", formData); 
};