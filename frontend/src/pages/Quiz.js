import { useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"

export default function Quiz() {
    const [selectedSubject, setSelectedSubject] = useState("")
    const [questionCount, setQuestionCount] = useState(10)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [quizStarted, setQuizStarted] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [showResults, setShowResults] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const subjects = [
        "Python",
        "Java",
        "SQL",
        "Aptitude",
        "Reasoning",
        "Web Development",
        "HTML",
        "CSS",
        "JavaScript",
        "C",
        "C++"
    ]

    const startQuiz = async () => {
        if (!selectedSubject || loading) return

        setLoading(true)

        try {
            const token = localStorage.getItem("token")

            const res = await API.get(
                `/quiz/questions?subject=${encodeURIComponent(selectedSubject)}&questionCount=${questionCount}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!Array.isArray(res.data) || res.data.length === 0) {
                alert("No questions available for this subject.")
                return
            }

            setQuestions(res.data)
            setAnswers([])
            setQuizStarted(true)
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message ||
                "Unable to start quiz. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (index, option) => {
        const newAnswers = [...answers]
        newAnswers[index] = option
        setAnswers(newAnswers)
    }

    const submitQuiz = async () => {
        if (submitting) return

        const unanswered = questions.filter(
            (_, index) => !answers[index]
        ).length

        if (unanswered > 0) {
            alert(
                `Please answer all questions before submitting.\n${unanswered} question(s) unanswered.`
            )
            return
        }

        setSubmitting(true)

        try {
            const token = localStorage.getItem("token")

            const res = await API.post(
                "/quiz/submit",
                {
                    subject: selectedSubject,
                    answers,
                    questionCount: questions.length
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setResultData(res.data)
            setShowResults(true)
            toast.success("Quiz submitted successfully")
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message ||
                "Unable to submit quiz. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    const resetQuiz = () => {
        setShowResults(false)
        setQuizStarted(false)
        setResultData(null)
        setQuestions([])
        setAnswers([])
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                padding: "30px"
            }}
        >
            {showResults && resultData ? (
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "auto",
                        background: "white",
                        padding: "30px",
                        borderRadius: "15px"
                    }}
                >
                    <h1>Quiz Results</h1>

                    <h2>Score: {resultData?.score}</h2>

                    <h2>
                        Percentage: {resultData?.percentage}%
                    </h2>

                    <hr />

                    <h2>Answer Review</h2>

                    {resultData?.results?.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                borderRadius: "10px",
                                background: item.isCorrect
                                    ? "#dcfce7"
                                    : "#fee2e2"
                            }}
                        >
                            <h4>
                                Q{index + 1}. {item.question}
                            </h4>

                            <p>
                                <strong>Your Answer:</strong>{" "}
                                {item.yourAnswer}
                            </p>

                            <p>
                                <strong>Correct Answer:</strong>{" "}
                                {item.correctAnswer}
                            </p>

                            <p>
                                {item.isCorrect
                                    ? "✅ Correct"
                                    : "❌ Wrong"}
                            </p>
                        </div>
                    ))}

                    <button
                        onClick={resetQuiz}
                        style={{
                            padding: "12px 20px",
                            border: "none",
                            background: "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Back To Quiz Home
                    </button>
                </div>
            ) : !quizStarted ? (
                <div
                    style={{
                        maxWidth: "700px",
                        margin: "auto",
                        background: "white",
                        padding: "30px",
                        borderRadius: "15px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                >
                    <h1
                        style={{
                            textAlign: "center",
                            marginBottom: "30px"
                        }}
                    >
                        Career Quiz
                    </h1>

                    <label>Select Subject</label>

                    <select
                        value={selectedSubject}
                        onChange={e =>
                            setSelectedSubject(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "10px",
                            marginBottom: "20px"
                        }}
                    >
                        <option value="">
                            Choose Subject
                        </option>

                        {subjects.map(subject => (
                            <option
                                key={subject}
                                value={subject}
                            >
                                {subject}
                            </option>
                        ))}
                    </select>

                    <label>Number Of Questions</label>

                    <select
                        value={questionCount}
                        onChange={e =>
                            setQuestionCount(
                                Number(e.target.value)
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "10px"
                        }}
                    >
                        <option value={5}>
                            5 Questions
                        </option>

                        <option value={10}>
                            10 Questions
                        </option>

                        <option value={20}>
                            20 Questions
                        </option>
                    </select>

                    <button
                        onClick={startQuiz}
                        disabled={!selectedSubject || loading}
                        style={{
                            width: "100%",
                            marginTop: "30px",
                            padding: "12px",
                            background: loading
                                ? "#999"
                                : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor:
                                !selectedSubject || loading
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                !selectedSubject || loading
                                    ? 0.6
                                    : 1
                        }}
                    >
                        {loading
                            ? "⏳ Loading Questions..."
                            : "Start Quiz"}
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "auto"
                    }}
                >
                    <h2>{selectedSubject} Quiz</h2>

                    <p>
                        Total Questions: {questions.length}
                    </p>

                    {questions.map((q, index) => (
                        <div
                            key={index}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "12px",
                                marginBottom: "20px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        >
                            <h4>
                                Q{index + 1}. {q.question}
                            </h4>

                            {q.options?.map((opt, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginTop: "10px"
                                    }}
                                >
                                    <label
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            checked={
                                                answers[index] === opt
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    index,
                                                    opt
                                                )
                                            }
                                        />

                                        {" "}
                                        {opt}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        onClick={submitQuiz}
                        disabled={submitting}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: submitting
                                ? "#999"
                                : "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            cursor: submitting
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {submitting
                            ? "⏳ Submitting..."
                            : "Submit Quiz"}
                    </button>
                </div>
            )}
        </div>
    )
}