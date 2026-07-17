import { Link, useNavigate } from "react-router-dom"
export default function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
}
    return (

        <nav
            style={{
                display: "flex",
                gap: "20px",
                padding: "15px 25px",
                background: "#222",
                color: "white",
                alignItems: "center"
            }}
        >

            <h2
                style={{
                    marginRight: "30px"
                }}
            >
                Virtual Career Mentor
            </h2>

            <Link
                to="/dashboard"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Dashboard
            </Link>

            <Link
                to="/quiz"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Quiz
            </Link>

            <Link
                to="/jobs"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Jobs
            </Link>

            <Link
                to="/resume-analyzer"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Resume Analyzer
            </Link>

            <Link
                to="/chatbot"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                AI Mentor
            </Link>

            <div
    style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "15px"
    }}
>

    {token ? (
        <>
            <Link
                to="/profile"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "15px"
                }}
            >
                👤 Profile
            </Link>

            <button
                onClick={handleLogout}
                style={{
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>
        </>
    ) : (
        <>
            <Link
                to="/"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Login
            </Link>

            <Link
                to="/register"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Register
            </Link>
        </>
    )}

</div>

        </nav>
    )
}