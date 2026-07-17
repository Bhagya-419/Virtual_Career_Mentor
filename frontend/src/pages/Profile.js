import { useState, useEffect } from "react"
import API from "../services/api"

export default function Profile() {

const [name, setName] = useState("")
const [email, setEmail] = useState("")

const [skills, setSkills] = useState([])

const [qualification, setQualification] =
    useState("")

const [experienceLevel, setExperienceLevel] =
    useState("Entry")


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

    try {

        const token =
            localStorage.getItem("token")

        await API.put(
            "/profile/update",
            {
                skills,
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

        alert("Profile updated successfully")

    } catch (error) {

        console.log(error)

        alert("Update failed")
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
