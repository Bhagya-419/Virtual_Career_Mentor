import { useState, useEffect } from "react"
import API from "../services/api"
import { toast } from "react-toastify"

export default function Profile() {

const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [skills, setSkills] = useState([])
const [qualification, setQualification] = useState("")
const [experienceLevel, setExperienceLevel] = useState("Entry")

const validSkills = [
    "Python", "Java", "C", "C++", "JavaScript", "TypeScript", "HTML",
    "CSS", "React", "Angular", "Vue.js", "Node.js", "Express.js", "Next.js",
    "MongoDB", "SQL", "MySQL", "PostgreSQL", "Firebase", "Redis", "GraphQL",
    "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "REST API",
    "Flask", "Django", "Spring Boot", "DSA", "OOP", "System Design", "DBMS",
    "Operating Systems", "Computer Networks", "Machine Learning", "Deep Learning",
    "Data Science", "Data Analysis", "NLP", "Computer Vision", "Excel", "Tableau",
    "Power BI", "Communication", "Team Work", "Leadership", "Problem Solving",
    "Time Management", "Adaptability", "Critical Thinking", "Creativity",
    "Conflict Resolution", "Presentation Skills", "Decision Making"
]

useEffect(() => {

    const fetchProfile = async () => {

        try {

            const token =
                localStorage.getItem("token")

            const res = await API.get(
                "/profile/me",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            setName(res.data.name || "")
            setEmail(res.data.email || "")

            setSkills(res.data.skills || [])

            setQualification(
                res.data.qualification || ""
            )

            setExperienceLevel(
                res.data.experienceLevel || "Entry"
            )

        } catch (error) {

            console.log(error)
        }
    }

    fetchProfile()

}, [])

const handleUpdate = async () => {

    // Qualification validation
    if (!qualification.trim()) {
        alert("Please enter your qualification")
        return
    }

    if (qualification.trim().length < 2) {
        alert("Please enter a valid qualification")
        return
    }

    // Clean skills
    const cleanedSkills = skills
        .map(skill => skill.trim())
        .filter(skill => skill !== "")

    if (cleanedSkills.length === 0) {
        alert("Please enter at least one skill")
        return
    }

    // Check invalid skills
    const invalidSkills = cleanedSkills.filter(
        skill =>
            !validSkills.some(
                valid =>
                    valid.toLowerCase() === skill.toLowerCase()
            )
    )

    if (invalidSkills.length > 0) {
        alert(
            `Invalid skill(s): ${invalidSkills.join(", ")}\n\nPlease enter skills from the supported skills list.`
        )
        return
    }

    // Remove duplicates and keep correct capitalization
    const uniqueSkills = [
        ...new Set(
            cleanedSkills.map(skill => skill.toLowerCase())
        )
    ].map(lowerSkill =>
        validSkills.find(
            skill =>
                skill.toLowerCase() === lowerSkill
        )
    )

    try {

        const token = localStorage.getItem("token")

        await API.put(
            "/profile/update",
            {
                skills: uniqueSkills,
                qualification: qualification.trim(),
                experienceLevel
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

        setSkills(uniqueSkills)

        toast.success("Profile updated successfully")

    } catch (error) {

        console.log(error)

        toast.error(
            error.response?.data?.message ||
            "Update failed"
        )
    }
}

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
        "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px"
}

return (

    <div
        style={{
            padding: "30px",
            background: "#f4f4f4",
            minHeight: "100vh"
        }}
    >

        <h1
            style={{
                marginBottom: "25px"
            }}
        >
            👤 My Profile
        </h1>

        <div style={cardStyle}>

            <h2>Personal Information</h2>

            <p>
                <strong>Name:</strong>
                {" "}
                {name}
            </p>

            <p>
                <strong>Email:</strong>
                {" "}
                {email}
            </p>

        </div>

        <div style={cardStyle}>

            <h2>Career Information</h2>

            <label>
                Qualification
            </label>

            <input
                type="text"
                value={qualification}
                onChange={(e) =>
                    setQualification(
                        e.target.value
                    )
                }
                placeholder="B.Tech CSE"
                style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "8px",
                    marginBottom: "15px"
                }}
            />

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
                    padding: "10px",
                    marginTop: "8px",
                    marginBottom: "20px"
                }}
            >

                <option value="Entry">
                    Entry
                </option>

                <option value="Junior">
                    Junior
                </option>

                <option value="Mid">
                    Mid
                </option>

                <option value="Senior">
                    Senior
                </option>

            </select>

            <h3>Skills</h3>

                <label>
    Skills
</label>

<input
    type="text"
    value={skills.join(",")}
    onChange={(e) =>
        setSkills(
            e.target.value
                .split(",")
                .map(skill => skill.trim())
        )
    }
    placeholder="Python, SQL, React"
    style={{
        width: "100%",
        padding: "10px",
        marginTop: "8px",
        marginBottom: "20px"
    }}
/>

            <button
                onClick={handleUpdate}
                style={{
                    marginTop: "20px",
                    padding:
                        "10px 18px",
                    border: "none",
                    backgroundColor:
                        "#4CAF50",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
            >
                Update Profile
            </button>

        </div>

    </div>
)
}
