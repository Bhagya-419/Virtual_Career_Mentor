import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function ATSHistory() {
    const [history, setHistory] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token")

                const res = await API.get("/resume/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setHistory(Array.isArray(res.data) ? res.data : [])
            } catch (error) {
                console.log(error)
                alert(
                    error.response?.data?.message ||
                    "Unable to load ATS history"
                )
            }
        }

        fetchHistory()
    }, [])

    return (
        <div
            style={{
                padding: "30px",
                background: "#f4f4f4",
                minHeight: "100vh"
            }}
        >
            <h1>ATS History</h1>

            <button
                onClick={() => navigate("/dashboard")}
                style={{
                    padding: "10px 15px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                ← Back to Dashboard
            </button>

            {history.length > 0 ? (
                history.map((item, index) => (
                    <div
                        key={`${item.createdAt || "history"}-${index}`}
                        style={{
                            background: "white",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h3>
                            ATS Score: {item.score ?? 0}%
                        </h3>

                        <p>
                            <b>Resume:</b>{" "}
                            {item.resumeFile || "Unknown"}
                        </p>

                        <p>
                            <b>Date:</b>{" "}
                            {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                ))
            ) : (
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <p>No ATS history found.</p>

                    <button
                        onClick={() => navigate("/resume-analyzer")}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Analyze Resume
                    </button>
                </div>
            )}
        </div>
    )
}