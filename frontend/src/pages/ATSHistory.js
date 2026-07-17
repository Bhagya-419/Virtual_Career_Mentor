import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function ATSHistory() {

    const [history, setHistory] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const token =
                    localStorage.getItem("token")

                const res = await API.get(
                    "/resume/history",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

                setHistory(res.data)

            } catch (error) {

                console.log(error)
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
                onClick={() =>
                    navigate("/dashboard")
                }
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
                history.length > 0 ? (

                    history.map((item, index) => (

                        <div
                            key={index}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        >

                            <h3>
                                ATS Score:
                                {" "}
                                {item.score}%
                            </h3>

                            <p>
                                Resume:
                                {" "}
                                {item.resumeFile}
                            </p>

                            <p>
                                Date:
                                {" "}
                                {
                                    new Date(
                                        item.createdAt
                                    ).toLocaleDateString()
                                }
                            </p>

                        </div>

                    ))

                ) : (

                    <p>
                        No ATS history found
                    </p>

                )
            }

        </div>

    )
}