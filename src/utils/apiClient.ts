// src/utils/apiClient.ts
import axios from "axios"
import * as SecureStore from "expo-secure-store"

const apiClient = axios.create({
    baseURL: "https://flightticketproject.onrender.com",
    timeout: 10000,
})

apiClient.interceptors.request.use(async config => {
    const token = await SecureStore.getItemAsync("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default apiClient
