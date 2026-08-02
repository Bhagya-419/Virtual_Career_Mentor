import { NavLink, useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/"
    }

    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#4f46e5" : "#374151",
        background: isActive ? "#eef2ff" : "transparent",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 600,
        padding: "8px 14px",
        borderRadius: "8px",
        transition: "background 0.15s ease, color 0.15s ease",
    })

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "14px 32px",
                background: "#ffffff",
                borderBottom: "1px solid #e6e8f0",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <h2
                style={{
                    margin: 0,
                    marginRight: "28px",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1a1b25",
                    whiteSpace: "nowrap",
                }}
            >
                🎓 Virtual Career Mentor
            </h2>

            <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
            <NavLink to="/quiz" style={linkStyle}>Quiz</NavLink>
            <NavLink to="/jobs" style={linkStyle}>Jobs</NavLink>
            <NavLink to="/resume-analyzer" style={linkStyle}>Resume Analyzer</NavLink>
            <NavLink to="/chatbot" style={linkStyle}>AI Mentor</NavLink>

            <div
                style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                {token ? (
                    <>
                        <NavLink to="/profile" style={linkStyle}>👤 Profile</NavLink>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/" style={linkStyle}>Login</NavLink>
                        <NavLink to="/register" className="btn btn-primary" style={{textDecoration: "none"}}>
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}