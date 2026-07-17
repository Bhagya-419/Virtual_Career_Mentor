const User = require("../models/User")
const pdf = require("pdf-parse")
const fs = require("fs")
const path = require("path")
const ATSHistory = require("../models/ATSHistory")

// ─────────────────────────────────────────────
//  SKILL ALIASES  (covers abbreviations, variants)
// ─────────────────────────────────────────────
const SKILL_ALIASES = {
  javascript: ["javascript", "js", "es6", "es2015", "ecmascript"],
  typescript: ["typescript", "ts"],
  python: ["python", "py"],
  java: ["java"],
  "c++": ["c++", "cpp", "c plus plus"],
  "c#": ["c#", "csharp", "c sharp"],
  react: ["react", "reactjs", "react.js"],
  angular: ["angular", "angularjs", "angular.js"],
  vue: ["vue", "vuejs", "vue.js"],
  nodejs: ["node", "nodejs", "node.js"],
  express: ["express", "expressjs", "express.js"],
  mongodb: ["mongodb", "mongo"],
  mysql: ["mysql"],
  postgresql: ["postgresql", "postgres"],
  redis: ["redis"],
  graphql: ["graphql"],
  html: ["html", "html5"],
  css: ["css", "css3"],
  bootstrap: ["bootstrap"],
  tailwind: ["tailwind", "tailwindcss"],
  git: ["git", "github", "gitlab", "bitbucket"],
  docker: ["docker", "containerization"],
  kubernetes: ["kubernetes", "k8s"],
  aws: ["aws", "amazon web services", "ec2", "s3", "lambda"],
  azure: ["azure", "microsoft azure"],
  gcp: ["gcp", "google cloud"],
  "machine learning": ["machine learning", "ml"],
  "deep learning": ["deep learning", "dl"],
  tensorflow: ["tensorflow", "tf"],
  pytorch: ["pytorch"],
  "scikit-learn": ["scikit-learn", "sklearn"],
  nlp: ["nlp", "natural language processing"],
  "data structures": ["data structures", "dsa"],
  algorithms: ["algorithms", "algo"],
  sql: ["sql"],
  rest: ["rest", "restful", "rest api"],
  agile: ["agile", "scrum", "kanban"],
  linux: ["linux", "unix", "bash", "shell"],
  "next.js": ["next", "nextjs", "next.js"],
  redux: ["redux"],
  graphql: ["graphql"],
  firebase: ["firebase"],
  flutter: ["flutter"],
  kotlin: ["kotlin"],
  swift: ["swift"],
  php: ["php"],
  laravel: ["laravel"],
  django: ["django"],
  flask: ["flask"],
  spring: ["spring", "spring boot", "springboot"],
  "data science": ["data science", "data scientist"],
  pandas: ["pandas"],
  numpy: ["numpy"],
  "power bi": ["power bi", "powerbi"],
  tableau: ["tableau"],
  excel: ["excel", "ms excel"],
  figma: ["figma"],
  "ci/cd": ["ci/cd", "cicd", "continuous integration", "jenkins", "github actions"],
  testing: ["testing", "jest", "mocha", "cypress", "selenium", "unit testing"],
}

// ─────────────────────────────────────────────
//  STOPWORDS  (filter noise from JD)
// ─────────────────────────────────────────────
const STOPWORDS = new Set([
  "the","and","for","with","that","this","have","from","are","was","will",
  "they","been","has","not","but","what","all","were","when","your","can",
  "said","there","use","each","which","she","how","their","time","its",
  "about","more","would","write","like","these","her","long","make",
  "thing","see","him","two","into","look","more","day","could","come",
  "did","number","sound","only","little","work","know","place","year",
  "live","back","give","most","very","after","thing","our","just","name",
  "good","sentence","man","think","say","great","where","help","through",
  "much","before","line","right","too","mean","old","any","same","tell",
  "boy","follow","came","want","show","also","around","form","three",
  "small","set","put","end","does","another","well","large","need","big",
  "high","such","turn","here","why","asked","went","men","read","need",
  "land","different","home","move","try","kind","hand","picture","again",
  "change","off","play","spell","air","away","animal","house","point",
  "page","letters","mother","answer","found","study","still","learn",
  "should","america","world","must","able","skills","experience",
  "position","role","team","strong","environment","required","looking",
  "candidate","opportunities","working","using","including","please",
  "apply","join","responsibilities","requirements","preferred","bonus",
  "years","year","plus","least","related","related","knowledge","ability",
  "excellent","excellent","proficiency","understanding","familiarity",
  "hands","comfortable","other","both","between","under","never","few",
  "those","always","often","ever","add","between","own","below","country"
])

// ─────────────────────────────────────────────────
//  SECTION PATTERNS  (more robust detection)
// ─────────────────────────────────────────────────
const SECTION_PATTERNS = {
  education: [
    "education", "academic", "qualification", "degree", "b.tech", "btech",
    "b.e", "be ", "mtech", "m.tech", "bachelor", "master", "bsc", "msc",
    "b.sc", "m.sc", "phd", "university", "college", "institute", "school",
    "graduation", "undergraduate", "postgraduate", "10th", "12th", "ssc",
    "hsc", "intermediate", "matriculation"
  ],
  experience: [
    "experience", "work experience", "professional experience", "employment",
    "internship", "intern", "job", "worked at", "worked with", "company",
    "organisation", "organization", "position", "role", "designation",
    "responsibilities", "full time", "part time", "freelance", "contract"
  ],
  projects: [
    "project", "projects", "personal projects", "academic projects",
    "key projects", "notable projects", "portfolio", "built", "developed",
    "created", "implemented", "deployed"
  ],
  skills: [
    "skills", "technical skills", "core competencies", "competencies",
    "technologies", "tech stack", "tools", "frameworks", "languages",
    "expertise", "proficiencies", "abilities"
  ],
  certifications: [
    "certification", "certifications", "certificate", "certified", "courses",
    "training", "credential", "badge", "license", "udemy", "coursera",
    "nptel", "aws certified", "google certified", "microsoft certified",
    "completion"
  ],
  achievements: [
    "achievement", "achievements", "accomplishment", "award", "awards",
    "honor", "honours", "recognition", "winner", "rank", "scholarship",
    "fellowship"
  ],
  contact: [
    "contact", "phone", "email", "mobile", "address", "linkedin", "github",
    "portfolio", "website", "gmail", "yahoo", "@"
  ]
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/**
 * Normalize text: lowercase, remove special chars, collapse spaces
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s.#+@]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Check if any alias of a skill appears in resume text
 */
function skillFoundInText(skillKey, text) {
  const aliases = SKILL_ALIASES[skillKey] || [skillKey]
  return aliases.some(alias => {
    // Use word-boundary aware matching to avoid false positives
    // e.g., "java" should not match inside "javascript"
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "i")
    return regex.test(text)
  })
}

/**
 * Extract meaningful tech keywords from job description
 * Returns only words/phrases that look like tech skills
 */
function extractJDKeywords(jdText) {
  const normalized = normalizeText(jdText)
  const found = []

  // First pass: check known skill aliases
  for (const [skillKey, aliases] of Object.entries(SKILL_ALIASES)) {
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "i")
      if (regex.test(normalized)) {
        found.push(skillKey)
        break
      }
    }
  }

  // Second pass: extract remaining meaningful tokens (3+ chars, not stopwords)
  const tokens = normalized
    .split(/[\s,;|•·\/\\()\[\]{}]+/)
    .map(t => t.trim())
    .filter(t =>
      t.length >= 3 &&
      !STOPWORDS.has(t) &&
      !/^\d+$/.test(t) &&                  // skip pure numbers
      !/^(http|www|com|org|net)/.test(t)   // skip URLs
    )

  // Dedupe and add tokens not already covered
  const existingKeys = new Set(found.flatMap(k => SKILL_ALIASES[k] || [k]))
  const extra = [...new Set(tokens)].filter(t => !existingKeys.has(t))

  return { jdSkills: found, extraTokens: extra.slice(0, 30) } // cap extra tokens at 30
}

/**
 * Detect which resume sections are present
 */
function detectSections(text) {
  const result = {}
  for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
    result[section] = patterns.some(p => text.includes(p))
  }
  return result
}

/**
 * Check contact quality: email + phone
 */
function checkContactInfo(text) {
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(text)
  const hasPhone = /(\+91[\s-]?)?[6-9]\d{9}|(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(text)
  return { hasEmail, hasPhone }
}

/**
 * Estimate resume length quality  (word count)
 */
function checkResumeLength(text) {
  const wordCount = text.trim().split(/\s+/).length
  if (wordCount < 150) return { status: "too_short", wordCount }
  if (wordCount > 1200) return { status: "too_long", wordCount }
  return { status: "good", wordCount }
}

/**
 * Check for quantified achievements  (numbers / % in experience)
 */
function checkQuantifiedAchievements(text) {
  // Look for patterns like "increased by 30%", "managed team of 5", "reduced by 20%"
  const quantPattern = /\b\d+\s*(%|percent|x|times|users|clients|team|members|projects|months|years|k\b)/i
  return quantPattern.test(text)
}

// ─────────────────────────────────────────────
//  SCORING ENGINE
// ─────────────────────────────────────────────

function calculateATSScore(text, sections, contactInfo, jdAnalysis, resumeLength, hasQuantified) {
  const breakdown = {}

  // ── 1. KEYWORD MATCH SCORE (40 pts) ─────────────────────
  const { jdSkills, extraTokens } = jdAnalysis
  let keywordScore = 0
  const matchedSkills = []
  const missingSkills = []

  // Score from known JD skills (weight: 35 pts)
  if (jdSkills.length > 0) {
    let jdMatched = 0
    jdSkills.forEach(skill => {
      if (skillFoundInText(skill, text)) {
        jdMatched++
        matchedSkills.push(skill)
      } else {
        missingSkills.push(skill)
      }
    })
    keywordScore += Math.round((jdMatched / jdSkills.length) * 35)
  } else {
    // No JD provided: score based on broad tech coverage (35 pts)
    const coreSkills = ["javascript","python","react","nodejs","mongodb","sql","html","css","git"]
    let coreMatched = 0
    coreSkills.forEach(skill => {
      if (skillFoundInText(skill, text)) {
        coreMatched++
        matchedSkills.push(skill)
      }
    })
    keywordScore += Math.round((coreMatched / coreSkills.length) * 35)
  }

  // Score from extra JD tokens (weight: 5 pts)
  if (extraTokens.length > 0) {
    const extraMatched = extraTokens.filter(t => text.includes(t)).length
    keywordScore += Math.round((extraMatched / extraTokens.length) * 5)
  } else {
    keywordScore += 5  // no penalty if no extra tokens
  }

  breakdown.keywordMatch = { score: keywordScore, max: 40, matchedSkills, missingSkills }

  // ── 2. SECTIONS SCORE (30 pts) ───────────────────────────
  const sectionWeights = {
    contact:          { weight: 6, label: "Contact Info" },
    education:        { weight: 5, label: "Education" },
    experience:       { weight: 7, label: "Experience / Internship" },
    projects:         { weight: 7, label: "Projects" },
    skills:           { weight: 5, label: "Skills" },
  }

  let sectionScore = 0
  const sectionResults = {}
  for (const [key, { weight, label }] of Object.entries(sectionWeights)) {
    const present = key === "contact"
      ? (contactInfo.hasEmail || contactInfo.hasPhone)
      : sections[key]
    sectionResults[key] = { present, label, weight }
    if (present) sectionScore += weight
  }
  breakdown.sections = { score: sectionScore, max: 30, details: sectionResults }

  // ── 3. CONTENT QUALITY SCORE (20 pts) ────────────────────
  let qualityScore = 0
  const qualityChecks = {}

  // Contact completeness (5 pts)
  const contactScore = (contactInfo.hasEmail ? 3 : 0) + (contactInfo.hasPhone ? 2 : 0)
  qualityScore += contactScore
  qualityChecks.contactComplete = { score: contactScore, max: 5, hasEmail: contactInfo.hasEmail, hasPhone: contactInfo.hasPhone }

  // Quantified achievements (5 pts)
  qualityScore += hasQuantified ? 5 : 0
  qualityChecks.quantifiedAchievements = { present: hasQuantified, score: hasQuantified ? 5 : 0, max: 5 }

  // Resume length (5 pts)
  const lengthScore = resumeLength.status === "good" ? 5 : resumeLength.status === "too_short" ? 2 : 3
  qualityScore += lengthScore
  qualityChecks.resumeLength = { ...resumeLength, score: lengthScore, max: 5 }

  // Additional sections bonus (5 pts)
  const bonusScore =
    (sections.certifications ? 2 : 0) +
    (sections.achievements ? 1 : 0) +
    (sections.contact && text.includes("github") ? 1 : 0) +
    (sections.contact && text.includes("linkedin") ? 1 : 0)
  qualityScore += bonusScore
  qualityChecks.additionalSections = {
    score: bonusScore,
    max: 5,
    certifications: sections.certifications,
    achievements: sections.achievements,
    github: text.includes("github"),
    linkedin: text.includes("linkedin")
  }

  breakdown.contentQuality = { score: qualityScore, max: 20, checks: qualityChecks }

  // ── 4. FORMAT / ATS READABILITY (10 pts) ─────────────────
  let formatScore = 0
  const formatChecks = {}

  // No tables/graphics issues (heuristic: pdf-parse gives clean text if no tables)
  const textDensity = text.replace(/\s/g, "").length / text.length
  const isCleanFormat = textDensity > 0.4  // low density suggests garbled table text
  formatScore += isCleanFormat ? 4 : 0
  formatChecks.cleanParsing = { pass: isCleanFormat, score: isCleanFormat ? 4 : 0, max: 4 }

  // No grammar red flags (basic check: not ALL CAPS or no proper words)
  const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length
  const hasProperCase = upperCaseRatio < 0.4
  formatScore += hasProperCase ? 3 : 0
  formatChecks.properCasing = { pass: hasProperCase, score: hasProperCase ? 3 : 0, max: 3 }

  // Reasonable line breaks / structure
  const lineCount = text.split("\n").filter(l => l.trim().length > 0).length
  const goodStructure = lineCount > 10
  formatScore += goodStructure ? 3 : 0
  formatChecks.goodStructure = { pass: goodStructure, score: goodStructure ? 3 : 0, max: 3 }

  breakdown.format = { score: formatScore, max: 10, checks: formatChecks }

  // ── TOTAL ─────────────────────────────────────────────────
  const totalScore = Math.min(
    100,
    breakdown.keywordMatch.score +
    breakdown.sections.score +
    breakdown.contentQuality.score +
    breakdown.format.score
  )

  return { totalScore, breakdown }
}

// ─────────────────────────────────────────────
//  GENERATE SMART SUGGESTIONS
// ─────────────────────────────────────────────

function generateSuggestions(breakdown, sections, resumeLength, hasQuantified, contactInfo) {
  const suggestions = []

  const { keywordMatch, contentQuality } = breakdown

  // Missing critical sections
  if (!sections.experience)
    suggestions.push({ priority: "high", text: "Add an Experience or Internship section — it's one of the highest-weighted ATS criteria." })
  if (!sections.projects)
    suggestions.push({ priority: "high", text: "Add a Projects section with tech stack used, your role, and outcome." })
  if (!sections.education)
    suggestions.push({ priority: "high", text: "Add an Education section with degree, institution, year, and CGPA/percentage." })
  if (!sections.skills)
    suggestions.push({ priority: "high", text: "Add a dedicated Skills section listing your technical and soft skills clearly." })

  // Keyword gaps
  if (keywordMatch.missingSkills.length > 0) {
    const top5 = keywordMatch.missingSkills.slice(0, 5).join(", ")
    suggestions.push({ priority: "high", text: `Add these skills from the job description if you know them: ${top5}.` })
  }

  // Contact info
  if (!contactInfo.hasEmail)
    suggestions.push({ priority: "high", text: "Add your email address — ATS systems require it for candidate identification." })
  if (!contactInfo.hasPhone)
    suggestions.push({ priority: "medium", text: "Add your phone number to complete your contact information." })

  // Content quality
  if (!hasQuantified)
    suggestions.push({ priority: "medium", text: "Quantify your achievements (e.g., 'Improved performance by 30%', 'Managed team of 5') to stand out." })
  if (resumeLength.status === "too_short")
    suggestions.push({ priority: "medium", text: `Your resume seems short (${resumeLength.wordCount} words). Expand with more details about your projects and experience.` })
  if (resumeLength.status === "too_long")
    suggestions.push({ priority: "low", text: `Your resume is quite long (${resumeLength.wordCount} words). Keep it under 1–2 pages for better ATS readability.` })

  // Optional but good sections
  if (!sections.certifications)
    suggestions.push({ priority: "low", text: "Consider adding Certifications (Coursera, Udemy, NPTEL, etc.) to boost credibility." })
  if (!contentQuality.checks.additionalSections?.github)
    suggestions.push({ priority: "low", text: "Add your GitHub profile link to showcase your code and projects." })
  if (!contentQuality.checks.additionalSections?.linkedin)
    suggestions.push({ priority: "low", text: "Add your LinkedIn profile link for professional visibility." })
  if (!sections.achievements)
    suggestions.push({ priority: "low", text: "Add an Achievements section if you have awards, ranks, or scholarships." })

  // Format
  if (!breakdown.format.checks.cleanParsing?.pass)
    suggestions.push({ priority: "medium", text: "Your resume may have tables or graphics that confuse ATS parsers. Use a single-column, plain-text-friendly format." })

  // Sort: high → medium → low
  const order = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => order[a.priority] - order[b.priority])

  return suggestions
}

// ─────────────────────────────────────────────────────────────────
//  CONTROLLER EXPORTS
// ─────────────────────────────────────────────────────────────────

exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    user.resumeFile = req.file.filename
    await user.save()
    res.json({ message: "Resume uploaded successfully", file: req.file.filename })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (req.file) {
      user.resumeFile = req.file.filename
      await user.save()
    }

    if (!user || !user.resumeFile)
      return res.status(400).json({ message: "No resume uploaded" })

    const filePath = path.join(__dirname, "../uploads", user.resumeFile)
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "Physical file not found" })

    // ── Parse PDF ──────────────────────────────────────────
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdf(dataBuffer)
    const rawText = data.text
    const text = normalizeText(rawText)

    // ── Analyze Job Description ────────────────────────────
    const jobDescription = req.body?.jobDescription || ""
    const jdAnalysis = extractJDKeywords(jobDescription)

    // ── Run all checks ─────────────────────────────────────
    const sections = detectSections(text)
    const contactInfo = checkContactInfo(rawText)        // use rawText for email/phone regex
    const resumeLength = checkResumeLength(rawText)
    const hasQuantified = checkQuantifiedAchievements(rawText)

    // ── Calculate Score ────────────────────────────────────
    const { totalScore, breakdown } = calculateATSScore(
      text, sections, contactInfo, jdAnalysis, resumeLength, hasQuantified
    )

    // ── Generate Suggestions ───────────────────────────────
    const suggestions = generateSuggestions(
      breakdown, sections, resumeLength, hasQuantified, contactInfo
    )

    // ── Determine Score Label ──────────────────────────────
    let scoreLabel = "Needs Improvement"
    if (totalScore >= 80) scoreLabel = "Excellent"
    else if (totalScore >= 65) scoreLabel = "Good"
    else if (totalScore >= 45) scoreLabel = "Average"

    // ── Persist ────────────────────────────────────────────
    user.resumeScore = totalScore
    await user.save()
    await ATSHistory.create({
    userId: req.user.id,
    score: totalScore,
    resumeFile: req.file.filename,
    matchedSkills: breakdown.keywordMatch.matchedSkills,
    missingSkills: breakdown.keywordMatch.missingSkills,
    suggestions
})

    // ── Response ───────────────────────────────────────────
    res.json({
      message: "Resume analyzed successfully",
      score: totalScore,
      scoreLabel,
      breakdown,
      matchedSkills: breakdown.keywordMatch.matchedSkills,
      missingSkills: breakdown.keywordMatch.missingSkills,
      sections: {
        education:        sections.education,
        experience:       sections.experience,
        projects:         sections.projects,
        skills:           sections.skills,
        certifications:   sections.certifications,
        achievements:     sections.achievements,
        contact:          sections.contact,
        github:           text.includes("github"),
        linkedin:         text.includes("linkedin"),
      },
      contactInfo,
      resumeLength,
      hasQuantifiedAchievements: hasQuantified,
      suggestions,
      jdSkillsFound: jdAnalysis.jdSkills.length > 0,
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getATSHistory = async (req, res) => {
  try {
    const history = await ATSHistory.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}