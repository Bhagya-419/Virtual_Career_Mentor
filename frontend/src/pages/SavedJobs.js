import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem("token")

                const res = await API.get("/profile/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setSavedJobs(res.data.savedJobs || [])
            } catch (error) {
                console.log(error)
                alert(
                    error.response?.data?.message ||
                    "Unable to load saved careers"
                )
            }
        }

        fetchJobs()
    }, [])

    const handleDelete = async (role) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to remove "${role}" from saved careers?`
        )

        if (!confirmDelete) return

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

            setSavedJobs(prevJobs =>
                prevJobs.filter(job => job.role !== role)
            )

            toast.success("Career removed successfully")
        } catch (error) {
            console.log(error)
            alert(
                error.response?.data?.message ||
                "Unable to delete saved career"
            )
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

            {savedJobs.length > 0 ? (
                savedJobs.map((job, index) => (
                    <div
                        key={`${job.role}-${index}`}
                        style={{
                            background: "white",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h3 style={{ margin: 0 }}>
                            {job.role || "Unknown Role"}
                        </h3>

                        <p>
                            <b>Match Score:</b>{" "}
                            {job.matchScore ?? 0}%
                        </p>

                        <p>
                            <b>Skills:</b>{" "}
                            {job.skills?.length
                                ? job.skills.join(", ")
                                : "No skills recorded"}
                        </p>

                        <p>
                            <b>Saved On:</b>{" "}
                            {job.savedAt
                                ? new Date(job.savedAt).toLocaleDateString()
                                : "N/A"}
                        </p>

                        <button
                            onClick={() => handleDelete(job.role)}
                            style={{
                                background: "#dc2626",
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
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <p>No saved career recommendations found.</p>

                    <button
                        onClick={() => navigate("/jobs")}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Find Career Recommendations
                    </button>
                </div>
            )}
        </div>
    )
}