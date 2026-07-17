const axios = require("axios");
const User = require("../models/User");
const ATSHistory = require("../models/ATSHistory");
const QuizAttempt = require("../models/QuizAttempt");
const ChatHistory = require("../models/ChatHistory");
const getResources = require("../utils/resourceHelper")

// Builds a better search query when the user's message is too generic
// (e.g. "give youtube links") by pulling topic context from recent
// chat history or the user's profile.
const buildSearchQuery = (message, user, history, isVideoRequest) => {
    const genericPhrases = [
        "give link",
        "give links",
        "give youtube link",
        "give youtube links",
        "share link",
        "share links",
        "send link",
        "send links",
        "give resource",
        "give resources",
        "share resource",
        "share resources",
        "free youtube",
        "youtube resources",
        "youtube playlist"
    ];

    const isGeneric =
        genericPhrases.some(p => message.toLowerCase().includes(p)) &&
        message.split(" ").length < 10;

    let topic = message;

    if (isGeneric) {
        const lastUserMsg = [...history]
            .reverse()
            .find(h => h.role === "user" && h.content && h.content.length > 10);

        const topicFromHistory = lastUserMsg ? lastUserMsg.content : "";
        const fallbackTopic = user?.latestCareer || (user?.skills || [])[0] || "";

        topic = `${message} ${topicFromHistory} ${fallbackTopic}`.trim();
    }

    // For video requests, steer toward playlists from well-known channels
    if (isVideoRequest) {
        return `best free ${topic} playlist tutorial full course`;
    }

    return topic;
};

exports.chatWithAI = async (req, res) => {

    try {

        const { message, history = [] } = req.body;

        // Fetch user (needed early for buildSearchQuery)
        const user = await User.findById(req.user.id);

        // Get verified resources only if needed
        let resources = [];

        const keywords = [
            "resource",
            "resources",
            "course",
            "courses",
            "learn",
            "tutorial",
            "roadmap",
            "documentation",
            "docs",
            "link",
            "links",
            "video",
            "videos",
            "playlist"
        ];

        const needResources = keywords.some(keyword =>
            message.toLowerCase().includes(keyword)
        );

        const videoKeywords = ["youtube", "video", "videos", "playlist"];
        const isVideoRequest = videoKeywords.some(keyword =>
            message.toLowerCase().includes(keyword)
        );

        if (needResources) {
            const searchQuery = buildSearchQuery(message, user, history, isVideoRequest);
            console.log("Search query used:", searchQuery);

            resources = await getResources(searchQuery, isVideoRequest);

            console.log("Resources:", resources);
            console.log("Is Array:", Array.isArray(resources));
        }

        // Latest Resume
        const latestResume = await ATSHistory
            .findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        // Latest Quiz
        const latestQuiz = await QuizAttempt
            .findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        const context = `
You are an intelligent AI Career Mentor.

Use ONLY the student's latest profile.

=========================
STUDENT PROFILE
=========================

Name:
${user.name || "Not Available"}

Qualification:
${user.qualification || "Not Available"}

Experience Level:
${user.experienceLevel || "Entry"}

Current Skills:
${(user.skills || []).join(", ") || "Not Available"}

Resume ATS Score:
${user.resumeScore || 0}

Latest Quiz Score:
${latestQuiz?.percentage || 0}%

Latest Career Prediction:
${user.latestCareer || "Not Available"}

Top Career Matches:
${(user.topPredictions || [])
    .map(c => `${c.role} (${c.score}%)`)
    .join(", ") || "Not Available"}

Matched Skills:
${(latestResume?.matchedSkills || []).join(", ") || "Not Available"}

Missing Skills:
${(latestResume?.missingSkills || []).join(", ") || "Not Available"}

Resume Suggestions:
${(latestResume?.suggestions || [])
    .map(s => typeof s === "string" ? s : s.text)
    .join(", ") || "Not Available"}

Saved Jobs:
${(user.savedJobs || []).join(", ") || "None"}

Verified Resources:

${resources.length > 0
    ? resources.map((r, i) => `
${i + 1}.

Title:
${r.title}

URL:
${r.url}
`).join("\n")
    : "None found for this request."}

=========================
RESOURCE RESPONSE RULES (apply ONLY when the user asks for resources/links/videos)
=========================

When resources are provided above, your ENTIRE reply must look EXACTLY like this
example (copy this structure precisely, just swap in the real titles/URLs):

- [Python Full Course - Beginners](https://youtube.com/watch?v=xxxx)
- [Python Tutorial](https://youtube.com/watch?v=yyyy)
- [Learn Python in 4 Hours](https://youtube.com/watch?v=zzzz)

Hard rules:
- ONLY the title and the link. Nothing else — no subscriber counts, no likes,
  no view counts, no channel name, no description, no reason, no extra words.
- NOTHING before the first bullet. No greeting, no "Here are some resources", no heading.
- NOTHING after the last bullet. No summary, no closing line, no "happy learning".
- Exactly one line per resource, in the format "- [Title](URL)" and nothing more on that line.
- Never wrap the list in a paragraph or explanation.
- Use ONLY the URLs listed above. Never modify, guess, or invent a URL.
- If the list above says "None found for this request", output exactly one line and nothing else:
  "Couldn't find a verified link for that — try rephrasing with the specific topic (e.g. 'Java for beginners')."
- Do NOT say "I cannot provide direct links" or any similar refusal.

=========================
GENERAL RULES (for all other questions)
=========================

1. Personalize every answer.
2. Use ATS Score, Quiz Score, Missing Skills where relevant.
3. Keep answers short — use headings and bullet points.
4. Never invent information.
5. Maximum 150 words for non-resource answers.
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: context
                    },
                    ...history,
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: needResources ? 120 : 350,
                temperature: 0.4
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let reply =
            response.data?.choices?.[0]?.message?.content ||
            "No response from AI.";

        // For resource requests, don't trust the LLM to correctly report
        // whether resources were found — build the reply directly from
        // the verified resources array instead. This guarantees the text
        // always matches reality and stays short and clean.
        if (needResources) {
            if (resources.length > 0) {
                reply = "Here are some resources for you:";
            } else {
                reply = "Couldn't find a verified link for that — try rephrasing with the specific topic (e.g. 'Java for beginners').";
            }
        }

        await ChatHistory.create({
            userId: req.user.id,
            question: message,
            answer: reply,
            resources
        });

        const totalChats = await ChatHistory.countDocuments({
            userId: req.user.id
        });

        if (totalChats > 100) {

            const oldChats = await ChatHistory.find({
                userId: req.user.id
            })
            .sort({ createdAt: 1 })
            .limit(totalChats - 100);

            await ChatHistory.deleteMany({
                _id: {
                    $in: oldChats.map(chat => chat._id)
                }
            });

        }

        res.json({
            reply,
            resources
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "AI service error",
            details: error.message
        });

    }

};

exports.getChatHistory = async (req, res) => {

    try {

        const chats = await ChatHistory
            .find({
                userId: req.user.id
            })
            .sort({
                createdAt: -1
            });

        res.json(chats);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteChat = async (req, res) => {

    try {

        await ChatHistory.findOneAndDelete({

            _id: req.params.id,

            userId: req.user.id

        });

        res.json({

            message: "Chat deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });
    }
};

exports.clearChatHistory = async (req, res) => {

    try {

        await ChatHistory.deleteMany({

            userId: req.user.id

        });

        res.json({

            message: "Chat history cleared"

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });
    }
};