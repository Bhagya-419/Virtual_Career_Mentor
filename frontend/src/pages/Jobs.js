import { useState } from "react"
import API from "../services/api"

export default function Jobs() {

    const [skills, setSkills] = useState("")
    const [qualification, setQualification] = useState("")
    const [experienceLevel, setExperienceLevel] = useState("Entry")
    const [saved, setSaved] = useState(false)
    const [result, setResult] = useState(null)

    const qualifications = [

        "Bachelor's in Computer Science",
        "Bachelor's in Cybersecurity",
        "Bachelor's in Design",
        "Bachelor's in Game Development",
        "Bachelor's in Graphic Design",
        "Bachelor's in Information Technology",
        "Bachelor's in Marketing",
        "Bachelor's in Software Engineering",
        "Bachelor's in Statistics",

        "Master's in Business Administration",
        "Master's in Computer Science",
        "Master's in Cybersecurity",
        "Master's in Data Science",
        "Master's in Finance",
        "Master's in Human Resources",
        "Master's in Software Engineering",

        "PhD in Artificial Intelligence"
    ]

    const handlePredict = async () => {

        try {

            const token =
                localStorage.getItem("token")

            await API.put(
                "/profile/update",
                {
                    skills: skills
                        .split(",")
                        .map(s => s.trim()),

                    qualification,

                    experienceLevel
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            const response = await API.post(
                "/jobs/recommend",{},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            setResult(response.data)
            setSaved(false)

        } catch (error) {

            console.log(error)

            alert("Prediction failed")
        }
    
    }
    const handleSaveJob = async () => {

    try {

        const token = localStorage.getItem("token")

        await API.post(

            "/jobs/save",
            {
    role: result.recommendedRole,

    matchScore: result.matchScore,

    skills: skills
        .split(",")
        .map(s => s.trim())
},

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        )

        setSaved(true)

        alert("Career saved successfully")

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Unable to save career"
        )

    }

}
    return (

        <div
            style={{
                maxWidth: "800px",
                margin: "40px auto",
                padding: "30px",
                background: "#fff",
                borderRadius: "15px",
                boxShadow:
                    "0 4px 15px rgba(0,0,0,0.1)"
            }}
        >

            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "30px"
                }}
            >
                AI Career Predictor
            </h1>

            <label>
                Skills
            </label>

            <textarea
                rows="4"
                placeholder="Example: Python, SQL, Machine Learning, React"
                value={skills}
                onChange={(e) =>
                    setSkills(e.target.value)
                }

                style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    marginBottom: "20px"
                }}
            />

            <label>
                Qualification
            </label>

            <select
                value={qualification}
                onChange={(e) =>
                    setQualification(
                        e.target.value
                    )
                }

                style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    marginBottom: "20px"
                }}
            >

                <option value="">
                    Select Qualification
                </option>

                {
                    qualifications.map((q, i) => (

                        <option
                            key={i}
                            value={q}
                        >
                            {q}
                        </option>

                    ))
                }

            </select>

            <label>
                Experience Level
            </label>

            <select
                value={experienceLevel}
                onChange={(e) =>
                    setExperienceLevel(
                        e.target.value
                    )
                }

                style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "8px",
                    marginBottom: "25px"
                }}
            >

                <option value="Entry">
                    Entry
                </option>

                <option value="Mid">
                    Mid
                </option>

                <option value="Senior">
                    Senior
                </option>

            </select>

            <button
                onClick={handlePredict}
                style={{
                    width: "100%",
                    padding: "14px",
                    border: "none",
                    background: "#4CAF50",
                    color: "white",
                    fontSize: "16px",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
            >
                Predict Career Role
            </button>
            {result && (
            <div style={{ marginTop: "30px" }}>

            <h2 style={{ color: "#4CAF50", marginBottom: "5px" }}>
            🎯 Best Career Match
            </h2>

            <h1 style={{ margin: "0" }}>
            {result.recommendedRole}
            </h1>

            <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "5px" }}>
            {result.matchScore}%
            </p>

            <div
            style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "20px"
            }}
            >
            <h3 style={{ marginTop: 0 }}>
            💡 Why this Career?
            </h3>

            <p style={{ margin: 0 }}>
            Your skills closely match the requirements of <b>{result.recommendedRole}</b>. This role is recommended based on your skills, qualification and experience level.
            </p>

            </div>

            <button

    onClick={handleSaveJob}

    disabled={saved}

    style={{

        marginTop: "20px",

        padding: "12px 20px",

        background: saved
            ? "#999"
            : "#2196F3",

        color: "white",

        border: "none",

        borderRadius: "8px",

        cursor: saved
            ? "default"
            : "pointer"

    }}

>

    {

        saved

            ? "✅ Career Saved"

            : "💾 Save Recommendation"

    }

</button>
            <h2 style={{ marginTop: "25px", marginBottom: "15px" }}>
            📌 Related Career Options
            </h2>

            {result.topPredictions?.slice(1,4).map((item,index)=>(

            <div
            key={index}
            style={{
            marginBottom:"18px"
            }}
            >

            <div
            style={{
            display:"flex",
            justifyContent:"space-between",
            marginBottom:"5px"
            }}
            >

            <strong>{item.role}</strong>

            <strong>{item.match_score}%</strong>

            </div>

            <div
            style={{
            height:"12px",
            background:"#ddd",
            borderRadius:"8px",
            overflow:"hidden"
            }}
            >

            <div
            style={{
            width:`${item.match_score}%`,
            height:"100%",
            background:"#4CAF50"
            }}
            />
            

            </div>

            </div>

            ))}

            </div>
            )}
            

        </div>
    )
}