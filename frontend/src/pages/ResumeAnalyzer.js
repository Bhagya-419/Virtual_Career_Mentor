import { useState } from "react"
import API from "../services/api"

// ── Helpers ───────────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 80) return { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
  if (score >= 65) return { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" }
  if (score >= 45) return { text: "#d97706", bg: "#fffbeb", border: "#fde68a" }
  return { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" }
}

const priorityColor = { high: "#dc2626", medium: "#d97706", low: "#2563eb" }
const priorityBg    = { high: "#fef2f2", medium: "#fffbeb", low: "#eff6ff" }
const priorityLabel = { high: "High", medium: "Medium", low: "Low" }

// ── Score Ring (SVG) ───────────────────────────────────────────────
function ScoreRing({ score, label }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const colors = scoreColor(score)

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={colors.text}
          strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill={colors.text}>
          {score}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#6b7280">
          out of 100
        </text>
      </svg>
      <div style={{
        display: "inline-block",
        padding: "4px 16px",
        borderRadius: "999px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontWeight: "700",
        fontSize: "14px",
        marginTop: "4px"
      }}>
        {label}
      </div>
    </div>
  )
}

// ── Breakdown Bar ──────────────────────────────────────────────────
function BreakdownBar({ label, score, max, color }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{label}</span>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>{score} / {max}</span>
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: "999px", height: "8px" }}>
        <div style={{
          width: `${pct}%`,
          height: "8px",
          borderRadius: "999px",
          background: color,
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  )
}

// ── Section Badge ──────────────────────────────────────────────────
function SectionBadge({ label, present, weight }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "8px",
      background: present ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${present ? "#bbf7d0" : "#fecaca"}`,
      marginBottom: "8px"
    }}>
      <span style={{ fontSize: "16px" }}>{present ? "✅" : "❌"}</span>
      <span style={{ flex: 1, fontSize: "13px", fontWeight: "500", color: "#374151" }}>{label}</span>
      <span style={{
        fontSize: "11px",
        color: "#6b7280",
        background: "#f3f4f6",
        padding: "2px 7px",
        borderRadius: "999px"
      }}>
        {weight} pts
      </span>
    </div>
  )
}

// ── Skill Pill ─────────────────────────────────────────────────────
function SkillPill({ name, matched }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      margin: "4px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      background: matched ? "#dcfce7" : "#fee2e2",
      color: matched ? "#16a34a" : "#dc2626",
      border: `1px solid ${matched ? "#bbf7d0" : "#fecaca"}`
    }}>
      {matched ? "✓ " : "✗ "}{name}
    </span>
  )
}

// ── Card ───────────────────────────────────────────────────────────
function Card({ title, children, style }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      ...style
    }}>
      {title && (
        <h3 style={{ margin: "0 0 14px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleAnalyze = async () => {
    if (!resume) { alert("Please upload a resume PDF first."); return }
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("jobDescription", jobDescription)
      const token = localStorage.getItem("token")
      const response = await API.post("/resume/analyze", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      setResult(response.data)
      setActiveTab("overview")
    } catch (error) {
      console.error(error)
      alert("Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const tabs = ["overview", "keywords", "sections", "suggestions"]

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "30px 20px" }}>
      <div style={{ maxWidth: "920px", margin: "auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0 }}>
            🎯 ATS Resume Analyzer
          </h1>
          <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
            Upload your resume and optionally paste a job description for a targeted score.
          </p>
        </div>

        {/* ── Upload Form ── */}
        <Card style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* File Input */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Resume (PDF) *
              </label>
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "28px 16px",
                border: `2px dashed ${resume ? "#2563eb" : "#d1d5db"}`,
                borderRadius: "10px", cursor: "pointer",
                background: resume ? "#eff6ff" : "#f9fafb",
                transition: "all 0.2s"
              }}>
                <span style={{ fontSize: "24px", marginBottom: "6px" }}>📄</span>
                <span style={{ fontSize: "13px", color: resume ? "#2563eb" : "#6b7280", fontWeight: "600" }}>
                  {resume ? resume.name : "Click to upload PDF"}
                </span>
                <input
                  type="file" accept=".pdf"
                  onChange={e => setResume(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* JD Input */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Job Description <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional — for targeted scoring)</span>
              </label>
              <textarea
                placeholder="Paste the job description here to get a targeted ATS match score..."
                rows="5"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px",
                  borderRadius: "8px", border: "1px solid #d1d5db",
                  fontSize: "13px", resize: "vertical",
                  fontFamily: "inherit", boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: "100%", marginTop: "16px",
              padding: "13px", borderRadius: "8px",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff", fontWeight: "700", fontSize: "15px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {loading ? "⏳ Analyzing your resume..." : "🔍 Analyze Resume"}
          </button>
        </Card>

        {/* ── Results ── */}
        {result && (
          <>
            {/* Score + Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px", marginBottom: "16px" }}>
              
              <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ScoreRing score={result.score} label={result.scoreLabel} />
                {result.jdSkillsFound && (
                  <div style={{
                    marginTop: "10px", padding: "4px 10px",
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    borderRadius: "999px", fontSize: "11px", color: "#16a34a", fontWeight: "600"
                  }}>
                    📌 JD-targeted score
                  </div>
                )}
              </Card>

              <Card title="Score Breakdown">
                <BreakdownBar
                  label="Keyword Match"
                  score={result.breakdown?.keywordMatch?.score}
                  max={result.breakdown?.keywordMatch?.max}
                  color="#2563eb"
                />
                <BreakdownBar
                  label="Resume Sections"
                  score={result.breakdown?.sections?.score}
                  max={result.breakdown?.sections?.max}
                  color="#7c3aed"
                />
                <BreakdownBar
                  label="Content Quality"
                  score={result.breakdown?.contentQuality?.score}
                  max={result.breakdown?.contentQuality?.max}
                  color="#d97706"
                />
                <BreakdownBar
                  label="ATS Format"
                  score={result.breakdown?.format?.score}
                  max={result.breakdown?.format?.max}
                  color="#16a34a"
                />
              </Card>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#f1f5f9", padding: "4px", borderRadius: "10px" }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "none", cursor: "pointer", fontWeight: "600",
                    fontSize: "13px", textTransform: "capitalize",
                    background: activeTab === tab ? "#fff" : "transparent",
                    color: activeTab === tab ? "#2563eb" : "#6b7280",
                    boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s"
                  }}
                >
                  {tab === "overview" && "📊 "}
                  {tab === "keywords" && "🔑 "}
                  {tab === "sections" && "📋 "}
                  {tab === "suggestions" && "💡 "}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* ── Tab: Overview ── */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                {/* Contact Info */}
                <Card title="📬 Contact Info">
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                      background: result.contactInfo?.hasEmail ? "#f0fdf4" : "#fef2f2",
                      color: result.contactInfo?.hasEmail ? "#16a34a" : "#dc2626",
                      border: `1px solid ${result.contactInfo?.hasEmail ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      {result.contactInfo?.hasEmail ? "✅" : "❌"} Email
                    </span>
                    <span style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                      background: result.contactInfo?.hasPhone ? "#f0fdf4" : "#fef2f2",
                      color: result.contactInfo?.hasPhone ? "#16a34a" : "#dc2626",
                      border: `1px solid ${result.contactInfo?.hasPhone ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      {result.contactInfo?.hasPhone ? "✅" : "❌"} Phone
                    </span>
                    <span style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                      background: result.sections?.github ? "#f0fdf4" : "#fef2f2",
                      color: result.sections?.github ? "#16a34a" : "#dc2626",
                      border: `1px solid ${result.sections?.github ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      {result.sections?.github ? "✅" : "❌"} GitHub
                    </span>
                    <span style={{
                      padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                      background: result.sections?.linkedin ? "#f0fdf4" : "#fef2f2",
                      color: result.sections?.linkedin ? "#16a34a" : "#dc2626",
                      border: `1px solid ${result.sections?.linkedin ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      {result.sections?.linkedin ? "✅" : "❌"} LinkedIn
                    </span>
                  </div>
                </Card>

                {/* Resume Stats */}
                <Card title="📏 Resume Stats">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>Word Count</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>
                        {result.resumeLength?.wordCount} words
                        {" "}
                        <span style={{
                          padding: "2px 8px", borderRadius: "999px", fontSize: "11px",
                          background: result.resumeLength?.status === "good" ? "#f0fdf4" : "#fffbeb",
                          color: result.resumeLength?.status === "good" ? "#16a34a" : "#d97706"
                        }}>
                          {result.resumeLength?.status === "good" ? "Good" : result.resumeLength?.status === "too_short" ? "Too short" : "Too long"}
                        </span>
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>Quantified Achievements</span>
                      <span style={{ fontWeight: "600", color: result.hasQuantifiedAchievements ? "#16a34a" : "#dc2626" }}>
                        {result.hasQuantifiedAchievements ? "✅ Found" : "❌ Not found"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>JD Skills Detected</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>
                        {result.jdSkillsFound ? `${result.matchedSkills?.length} matched` : "No JD provided"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ── Tab: Keywords ── */}
            {activeTab === "keywords" && (
              <Card>
                {result.matchedSkills?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#16a34a", fontSize: "14px" }}>
                      ✅ Matched Skills ({result.matchedSkills.length})
                    </h4>
                    <div>
                      {result.matchedSkills.map((s, i) => <SkillPill key={i} name={s} matched />)}
                    </div>
                  </div>
                )}
                {result.missingSkills?.length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 10px 0", color: "#dc2626", fontSize: "14px" }}>
                      ❌ Missing from JD ({result.missingSkills.length})
                    </h4>
                    <div>
                      {result.missingSkills.map((s, i) => <SkillPill key={i} name={s} matched={false} />)}
                    </div>
                  </div>
                )}
                {!result.jdSkillsFound && (
                  <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                    💡 Paste a job description to get a targeted keyword match report.
                  </p>
                )}
              </Card>
            )}

            {/* ── Tab: Sections ── */}
            {activeTab === "sections" && (
              <Card>
                {Object.entries(result.breakdown?.sections?.details || {}).map(([key, { present, label, weight }]) => (
                  <SectionBadge key={key} label={label} present={present} weight={weight} />
                ))}
                <div style={{ height: "1px", background: "#e5e7eb", margin: "14px 0" }} />
                <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                  Additional (bonus): Certifications {result.sections?.certifications ? "✅" : "❌"}
                  {"  ·  "} Achievements {result.sections?.achievements ? "✅" : "❌"}
                </p>
              </Card>
            )}

            {/* ── Tab: Suggestions ── */}
            {activeTab === "suggestions" && (
              <Card>
                {result.suggestions?.length === 0 && (
                  <p style={{ textAlign: "center", color: "#16a34a", fontWeight: "600" }}>
                    🎉 Great resume! No major suggestions.
                  </p>
                )}
                {result.suggestions?.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "12px", alignItems: "flex-start",
                    padding: "12px", borderRadius: "8px", marginBottom: "10px",
                    background: priorityBg[s.priority],
                    border: `1px solid ${priorityColor[s.priority]}22`
                  }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: "999px", fontSize: "11px",
                      fontWeight: "700", whiteSpace: "nowrap", alignSelf: "center",
                      background: priorityColor[s.priority] + "22",
                      color: priorityColor[s.priority]
                    }}>
                      {priorityLabel[s.priority]}
                    </span>
                    <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5" }}>
                      {s.text}
                    </span>
                  </div>
                ))}
              </Card>
            )}

          </>
        )}
      </div>
    </div>
  )
}