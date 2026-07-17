import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

export default function SavedJobs() {

    const [savedJobs, setSavedJobs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                const token = localStorage.getItem("token")

                const res = await API.get(
                    "/profile/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setSavedJobs(res.data.savedJobs || [])

            } catch (error) {

                console.log(error)

            }

        }

        fetchJobs()

    }, [])

    const handleDelete = async (role) => {

        try {

            const token = localStorage.getItem("token")

            await API.delete(
                `/jobs/saved/${encodeURIComponent(role)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setSavedJobs(
                savedJobs.filter(
                    job => job.role !== role
                )
            )

        } catch (error) {

            console.log(error)

        }

    }

    return (

        <div
            style={{
                padding: "30px",
                background: "#f4f4f4",
                minHeight: "100vh"
            }}
        >

            <h1>Saved Career Recommendations</h1>

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
                savedJobs.length > 0 ? (

                    savedJobs.map((job, index) => (

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

                            <h3 style={{ margin: 0 }}>
                                {job.role}
                            </h3>

                            <p>
                                <b>Match Score:</b> {job.matchScore}%
                            </p>

                            <p>
                                <b>Skills:</b> {job.skills.join(", ")}
                            </p>

                            <p>
                                <b>Saved On:</b>{" "}
                                {new Date(job.savedAt).toLocaleDateString()}
                            </p>

                            <button
                                onClick={() => handleDelete(job.role)}
                                style={{
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 12px",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>

                        </div>

                    ))

                ) : (

                    <p>No saved career recommendations found.</p>

                )
            }

        </div>

    )

}