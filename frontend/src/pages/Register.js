import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

export default function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()
    const handleRegister = async () => {

    // Name validation
    if (!name.trim()) {
        alert("Please enter your name")
        return
    }

    if (name.trim().length < 2) {
        alert("Name must contain at least 2 characters")
        return
    }

    const nameRegex = /^[A-Za-z ]+$/

    if (!nameRegex.test(name.trim())) {
        alert("Name can contain only letters and spaces")
        return
    }

    // Email validation
    if (!email.trim()) {
        alert("Please enter your email")
        return
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email.trim())) {
        alert("Please enter a valid email address")
        return
    }

    // Password validation
    if (!password) {
        alert("Please enter a password")
        return
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters")
        return
    }

    if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least one uppercase letter")
        return
    }

    if (!/[a-z]/.test(password)) {
        alert("Password must contain at least one lowercase letter")
        return
    }

    if (!/[0-9]/.test(password)) {
        alert("Password must contain at least one number")
        return
    }

    if (!/[!@#$%^&*]/.test(password)) {
        alert("Password must contain at least one special character")
        return
    }

    // Confirm password
    if (!confirmPassword) {
        alert("Please confirm your password")
        return
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
    }

    try {

        await API.post(
            "/auth/signup",
            {
                name: name.trim(),
                email: email.trim(),
                password
            }
        )

        toast.success("Registration successful")

        navigate("/")

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Registration failed"
        )
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
                    width: "500px",
                    boxShadow:
                        "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Register
                </h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <button
                    onClick={handleRegister}

                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Register
                </button>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    Already have an account?{" "}

                    <Link to="/">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}