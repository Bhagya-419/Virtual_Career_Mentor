const sw = require("stopword")

function cleanText(text) {
    if (!text) return ""

    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)

    const filtered = sw.removeStopwords(words)

    return filtered.join(" ")
}

function cosineSimilarity(a, b) {

    const setA = new Set(a.split(" "))
    const setB = new Set(b.split(" "))

    const intersection =
        [...setA].filter(word => setB.has(word)).length

    return intersection / Math.sqrt(setA.size * setB.size)
}

exports.getBestMatch = (userProfile, dataset) => {

    const userText = cleanText(
        (userProfile.skills || []).join(" ") + " " +
        (userProfile.bio || "") + " " +
        (userProfile.interests || "")
    )

    let bestMatch = null
    let bestScore = 0

    dataset.forEach(row => {

        const jobText = cleanText(
            row.skills + " " +
            row.qualification + " " +
            row.experience_level + " " +
            row.job_role
        )

        let score = cosineSimilarity(userText, jobText)
        score+=(userProfile.resumeScore ||0)/100
        score+=(userProfile.quizScore||0)/100

        if (score > bestScore) {
            bestScore = score
            bestMatch = row
        }
    })

    return {
        role: bestMatch ? bestMatch.job_role : "No match found",
        score: bestScore.toFixed(2)
    }
}