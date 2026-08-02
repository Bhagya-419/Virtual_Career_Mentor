import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

export default function QuizHistory() {
    const [attempts, setAttempts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const token = localStorage.getItem("token")

                const res = await API.get("/quiz/my-attempts", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setAttempts(Array.isArray(res.data) ? res.data : [])
            } catch (error) {
                console.log(error)
                alert(
                    error.response?.data?.message ||
                    "Unable to load quiz history"
                )
            }
        }

        fetchAttempts()
    }, [])

    return (
        <div
            style={{
                padding: "30px",
                background: "#f4f4f4",
                minHeight: "100vh"
            }}
        >
            <h1>Quiz History</h1>

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

            {attempts.length > 0 ? (
                attempts.map((attempt, index) => (
                    <div
                        key={`${attempt.subject}-${attempt.createdAt}-${index}`}
                        style={{
                            background: "white",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h3>
                            {attempt.subject || "Unknown Subject"}
                        </h3>

                        <p>
                            <strong>Score:</strong>{" "}
                            {attempt.score ?? 0}/
                            {attempt.totalQuestions ?? 0}
                        </p>

                        <p>
                            <strong>Percentage:</strong>{" "}
                            {attempt.percentage ?? 0}%
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {attempt.createdAt
                                ? new Date(attempt.createdAt).toLocaleDateString()
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
                    <p>No quiz attempts found.</p>

                    <button
                        onClick={() => navigate("/quiz")}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Take a Quiz
                    </button>
                </div>
            )}
        </div>
    )
}