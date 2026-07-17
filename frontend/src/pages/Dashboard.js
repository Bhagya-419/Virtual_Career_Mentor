import { useEffect, useState } from "react"
import API from "../services/api"
import {useNavigate} from "react-router-dom"

export default function Dashboard() {

  const [user, setUser] = useState(null)
  const [quizAttempts, setQuizAttempts] = useState([])
  const [showAttempts, setShowAttempts] = useState(false)
  const navigate = useNavigate()
const [showSavedJobs, setShowSavedJobs] = useState(false)

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token = localStorage.getItem("token")

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(res.data)
        setQuizAttempts(
    res.data.quizAttempts || []
)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()

  }, [])

  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s",
  }

  return (

    <div
      style={{
        padding: "30px",
        background: "#f4f4f4",
        minHeight: "100vh"
      }}
    >
        <div
  style={{
    background:
      "linear-gradient(to right, #4CAF50, #2E7D32)",
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  }}
>

  <h2
    style={{
      marginBottom: "10px"
    }}
  >
    AI-Powered Career Guidance Platform
  </h2>

  <p
    style={{
      fontSize: "18px",
      lineHeight: "1.6"
    }}
  >
    Discover personalized career paths,
    analyze resumes with ATS scoring,
    and get intelligent job recommendations
    based on your profile and skills.
  </p>

</div>
      <h1
        style={{
          marginBottom: "30px",
          color: "#222"
        }}
      >
        Welcome to Virtual Career Mentor
      </h1>

      {user ? (

        <div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >

            <h2>Dashboard</h2>

            <p><strong>Name:</strong> {user.name}</p>

            <p><strong>Email:</strong> {user.email}</p>

            <p>
              <strong>Skills:</strong>{" "}
              {user.skills?.join(", ")}
            </p>

          </div>
            <div
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px"
    }}
>

    <div style={cardStyle}>

    <h3>ATS Score</h3>

    <h1>
        {user.resumeScore || 0}%
    </h1>

    <button
        onClick={() =>
            navigate("/ats-history")
        }
        style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }}
    >
        View History
    </button>

</div>

    <div style={cardStyle}>
    <h3>Quiz Attempts</h3>

    <h1>{quizAttempts.length}</h1>
    <button
    onClick={() => navigate("/quiz-history")}
    style={{
        padding: "10px 15px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }}
>
    View History
</button>

</div>

    <div style={cardStyle}>

    <h3>Saved Jobs</h3>

    <h1>
        {user.savedJobs?.length || 0}
    </h1>

    <button
        onClick={() =>
            navigate("/saved-jobs")
        }
        style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }}
    >
        View Saved Jobs
    </button>

</div>
    
</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}
          >

                <div
        style={cardStyle}

        onClick={() => navigate("/quiz")}

        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)"
            e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(0,0,0,0.15)"
        }}

        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.1)"
        }}
    >
              <h2> Quiz</h2>

              <p>
                Test your skills and improve recommendations.
              </p>
            </div>

            <div
    style={cardStyle}

    onClick={() => navigate("/jobs")}

    onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)"
        e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(0,0,0,0.15)"
    }}

    onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.1)"
    }}
>
              <h2>💼 Jobs</h2>

              <p>
                View personalized career recommendations.
              </p>
            </div>

            <div
    style={cardStyle}

    onClick={() => navigate("/resume-analyzer")}

    onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)"
        e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(0,0,0,0.15)"
    }}

    onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.1)"
    }}
>
              <h2>📄 ATS Analyzer</h2>

              <p>
                Analyze your resume against job descriptions.
              </p>
            </div>

            <div
    style={cardStyle}

    onClick={() => navigate("/profile")}

    onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)"
        e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(0,0,0,0.15)"
    }}

    onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.1)"
    }}
>
              <h2>👤 Profile</h2>

              <p>
                Update your skills and interests.
              </p>
            </div>

          </div>

        </div>

      ) : (

        <p>Loading...</p>

      )}

    </div>
  )
}