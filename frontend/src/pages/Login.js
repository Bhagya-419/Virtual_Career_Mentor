import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleLogin = async () => {

        try {

            const res = await API.post(
                "/auth/login",
                {
                    email,
                    password
                }
            )

            localStorage.setItem(
                "token",
                res.data.token
            )

            alert("Login successful")

            navigate("/dashboard")

        } catch (error) {

    alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed"
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
                    width: "350px",
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
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"

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

                <button
                    onClick={handleLogin}

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
                    Login
                </button>

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