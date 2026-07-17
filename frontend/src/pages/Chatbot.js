import API from "../services/api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Chatbot() {
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const [chat, setChat] = useState([])
    const [history,setHistory]= useState([])
    const [loading,setLoading] = useState(false)

    const sendMessage = async () => {

        if (!message.trim()) return

        const userMessage = {
            sender: "user",
            text: message
        }

        setChat(prev => [...prev, userMessage])
        setLoading(true)
        try {

            const token =
                localStorage.getItem("token")

            const res = await API.post(

                "/chat/ask",

                {
                    message,
                    history
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            const botMessage = {

    sender: "bot",

    text: res.data.reply,

    resources: res.data.resources || []

}

            setChat(prev => [
                ...prev,
                botMessage
            ])
            setHistory(prev => [
            ...prev,
            {
                role: "user",
                content: message
            },
            {
                role: "assistant",
                content: res.data.reply
            }
        ])
            setLoading(false)
        } catch (error) {
            console.log(error)
            alert("Chatbot error")
            setLoading(false)
        }

        setMessage("")
    }
    const suggestions = [
        "Which career suits me best?",
        "How can I improve my ATS score?",
        "What skills should I learn next?",
        "Suggest projects for my profile",
        "How to become a Data Scientist?"
]    

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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    }}
>

    <button
        onClick={() => {
            setChat([])
        }}
        style={{
            padding: "10px 16px",
            background: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
        }}
    >
        🗑 Clear Chat
    </button>

    <button
        onClick={() => navigate("/chat-history")}
        style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
        }}
    >
        📜 View Chat History
    </button>

</div>
                <div
    style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px"
    }}
>

    {
        suggestions.map((item, index) => (

            <button
                key={index}

                onClick={() =>
                    setMessage(item)
                }

                style={{
                    padding: "10px",
                    borderRadius: "20px",
                    border: "none",
                    background: "#e8f5e9",
                    cursor: "pointer"
                }}
            >
                {item}
            </button>
        ))
    }

</div>
            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.1)"
                }}
            >

                {
                    chat.map((msg, index) => (

                        <div
                            key={index}

                            style={{
                                textAlign:
                                    msg.sender === "user"
                                        ? "right"
                                        : "left",

                                marginBottom: "15px"
                            }}
                        >

                            <div
    style={{
        display: "inline-block",
        padding: "12px",
        borderRadius: "10px",
        background:
            msg.sender === "user"
                ? "#4CAF50"
                : "#ddd",
        color:
            msg.sender === "user"
                ? "white"
                : "black",
        maxWidth: "70%",
        whiteSpace: "pre-wrap",
        lineHeight: "1.8"
    }}
>

    <div>{msg.text}</div>

    {
        msg.resources &&
        msg.resources.length > 0 && (

            <div
                style={{
                    marginTop: "15px",
                    paddingTop: "10px",
                    borderTop: "1px solid #999"
                }}
            >

                <h4>📚 Verified Resources</h4>

                {

                    msg.resources.map((item, index) => (

                        <div
                            key={index}
                            style={{
                                marginBottom: "15px"
                            }}
                        >

                            <b>{item.title}</b>

                            <br />

                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {item.url}
                            </a>

                            <p
                                style={{
                                    marginTop: "5px"
                                }}
                            >
                                {item.content}
                            </p>

                        </div>

                    ))

                }

            </div>

        )
    }

</div>

                        </div>
                    ))
                }
                {
                loading && (

                    <p
                        style={{
                            color: "#666"
                        }}
                    >
                        AI Mentor is typing...
                    </p>
                )
            }
            </div>

            <div
                style={{
                    display: "flex",
                    marginTop: "20px",
                    gap: "10px"
                }}
            >

                <input
                    type="text"

                    value={message}

                    placeholder="Ask career questions..."

                    onChange={(e) =>
                        setMessage(e.target.value)
                    }

                    style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <button
                    onClick={sendMessage}

                    style={{
                        padding: "12px 20px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>

            </div>

        </div>
    )
}