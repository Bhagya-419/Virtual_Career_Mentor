import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        // Email validation
        if (!email.trim()) {
            toast.error("Please enter your email")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }

        // Password validation
        if (!password) {
            toast.error("Please enter your password")
            return
        }

        try {
            setLoading(true)
            const res = await API.post("/auth/login", { 
                email: email.trim(), 
                password 
            })

            localStorage.setItem("token", res.data.token)
            toast.success("Login successful")
            navigate("/dashboard")
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid email or password"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f4f4f4"
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Login
                </h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box"
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box"
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}