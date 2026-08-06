import axios from "axios"
import { toast } from "react-toastify"

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://virtual-career-mentor-backend.onrender.com/api",
    withCredentials: true
})

// Attach token automatically to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Catch invalid/expired token globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.response?.data?.error || ""

        if (
            error.response?.status === 401 ||
            message.toLowerCase().includes("invalid token") ||
            message.toLowerCase().includes("no token")
        ) {
            localStorage.removeItem("token")
            toast.error("Please login to continue")
            window.location.href = "/"
        }

        return Promise.reject(error)
    }
)

export default API