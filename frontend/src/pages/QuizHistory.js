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

                const res = await API.get(
                    "/quiz/my-attempts",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setAttempts(res.data)

            } catch (error) {

                console.log(error)
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

            {
                attempts.length > 0 ? (

                    attempts.map((attempt, index) => (

                        <div
                            key={index}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        >

                            <h3>{attempt.subject}</h3>

                            <p>
                                Score: {attempt.score}/
                                {attempt.totalQuestions}
                            </p>

                            <p>
                                Percentage:
                                {" "}
                                {attempt.percentage}%
                            </p>

                            <p>
                                Date:
                                {" "}
                                {new Date(
                                    attempt.createdAt
                                ).toLocaleDateString()}
                            </p>

                        </div>

                    ))

                ) : (

                    <p>No quiz attempts found.</p>

                )
            }

        </div>

    )
}