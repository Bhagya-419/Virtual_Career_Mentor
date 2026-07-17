from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os

app = Flask(__name__)

model = joblib.load("model.pkl")

def normalize_skills(skills_text):
    skill_aliases = {
        # --- React / Frontend ---
        "react.js": "react", "reactjs": "react", "react native": "react",
        "react js": "react",
        "node.js": "node", "nodejs": "node", "node js": "node",
        "vue.js": "vue", "vuejs": "vue", "vue js": "vue",
        "angular.js": "angular", "angularjs": "angular",
        "javascript": "javascript", "js": "javascript", "java script": "javascript",
        "typescript": "typescript", "ts": "typescript",
        "html5": "html", "html 5": "html",
        "css3": "css", "css 3": "css",
        "rest api": "rest apis", "restful api": "rest apis",
        "restful apis": "rest apis", "rest": "rest apis",
        "asp.net": "asp.net", "aspnet": "asp.net",
        ".net core": ".net core", "dotnet core": ".net core",
        ".net": ".net", "dotnet": ".net",

        # --- Python / Backend ---
        "python3": "python", "py": "python",
        "django rest": "django",
        "flask api": "flask",
        "php8": "php",
        "laravel framework": "laravel",
        "symfony framework": "symfony",
        "express.js": "express", "expressjs": "express",
        "hibernate orm": "hibernate",
        "spring framework": "spring",
        "spring boot framework": "spring boot",

        # --- Data & ML ---
        "ml": "machine learning", "machine-learning": "machine learning",
        "dl": "deep learning", "deep-learning": "deep learning",
        "natural language processing": "nlp",
        "natural-language-processing": "nlp",
        "tf": "tensorflow", "tensor flow": "tensorflow",
        "keras api": "keras",
        "data viz": "data visualization",
        "data-visualization": "data visualization",
        "data analysis": "data analysis",
        "data-analysis": "data analysis",
        "data science": "data science",
        "pandas library": "pandas",
        "statistics": "statistics", "stats": "statistics",
        "r language": "r", "r programming": "r",

        # --- Databases ---
        "mongo": "mongodb", "mongo db": "mongodb",
        "mysql db": "mysql", "my sql": "mysql",
        "postgres": "postgresql", "postgre sql": "postgresql",
        "sql server": "sql server", "mssql": "sql server",
        "dbms": "sql", "structured query language": "sql",

        # --- Cloud & DevOps ---
        "amazon web services": "aws", "amazon aws": "aws",
        "microsoft azure": "azure", "az": "azure",
        "google cloud": "gcp", "google cloud platform": "gcp",
        "docker container": "docker", "dockerfile": "docker",
        "k8s": "kubernetes", "kube": "kubernetes",
        "terraform iac": "terraform",
        "ansible automation": "ansible",
        "helm chart": "helm", "helm charts": "helm",
        "cicd": "ci/cd", "ci cd": "ci/cd",
        "continuous integration": "ci/cd",
        "jenkins pipeline": "jenkins",
        "linux os": "linux", "ubuntu": "linux", "unix": "linux",
        "microservice": "microservices", "micro services": "microservices",

        # --- Mobile ---
        "ios development": "ios", "ios dev": "ios",
        "android development": "android development",
        "android sdk": "android sdk",
        "objective c": "objective-c", "objc": "objective-c",
        "swift language": "swift",
        "kotlin lang": "kotlin",
        "xcode ide": "xcode",
        "core data framework": "core data",

        # --- Cybersecurity ---
        "ethical hacking": "ethical hacking", "ethicalhacking": "ethical hacking",
        "pen testing": "penetration testing", "pentest": "penetration testing",
        "pentesting": "penetration testing",
        "network sec": "network security",
        "firewall": "firewalls",
        "siem tools": "siem",

        # --- Design & UI/UX ---
        "ui ux": "ui/ux", "ui/ux design": "ui/ux", "uiux": "ui/ux",
        "ux design": "ui/ux", "ui design": "ui/ux",
        "adobe xd": "adobe xd", "xd": "adobe xd",
        "adobe illustrator": "adobe illustrator", "illustrator": "adobe illustrator",
        "figma design": "figma",
        "sketch app": "sketch",
        "wire frame": "wireframing", "wireframe": "wireframing",
        "prototype": "prototyping",
        "photoshop": "photoshop", "ps": "photoshop",
        "3d modelling": "3d modeling",

        # --- Blockchain ---
        "solidity lang": "solidity",
        "smart contract": "smart contracts",
        "web 3": "web3", "web3.js": "web3", "web3 js": "web3",
        "web3js": "web3js",
        "eth": "ethereum",

        # --- Project Management / Soft Skills ---
        "agile methodology": "agile",
        "scrum methodology": "scrum",
        "jira tool": "jira",
        "project mgmt": "project management",
        "stakeholder mgmt": "stakeholder management",
        "hr management": "hr management",
        "hr policies": "hr policies",
        "employee relation": "employee relations",

        # --- Marketing / Analytics ---
        "seo optimization": "seo",
        "search engine optimization": "seo",
        "ppc ads": "ppc", "pay per click": "ppc",
        "google analytics tool": "google analytics", "ga": "google analytics",
        "digital marketing": "digital marketing",
        "social media marketing": "social media",
        "content marketing": "content creation",
        "marketing campaign": "marketing campaigns",

        # --- Finance ---
        "financial model": "financial modeling",
        "risk mgmt": "risk analysis", "risk management": "risk analysis",
        "ms excel": "excel", "microsoft excel": "excel",
        "tableau software": "tableau",

        # --- Game Dev ---
        "unity engine": "unity", "unity3d": "unity",
        "unreal": "unreal engine", "ue5": "unreal engine",
        "vr dev": "vr development", "virtual reality": "vr",
        "game physics engine": "game physics",
    }

    skills_text = skills_text.lower().strip()
    
    # Sort by length (longest first) to avoid partial replacements
    sorted_aliases = sorted(skill_aliases.items(), key=lambda x: len(x[0]), reverse=True)
    
    for alias, canonical in sorted_aliases:
        skills_text = skills_text.replace(alias, canonical)
    
    return skills_text
@app.route("/predict", methods=["POST"])
def predict():
    print("PREDICT API HIT")
    try:
        
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.json

        # Validate required fields
        required = ["skills", "qualification", "experience_level"]
        missing = [f for f in required if f not in data or not data[f]]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Validate types
        for field in required:
            if not isinstance(data[field], str):
                return jsonify({"error": f"'{field}' must be a string"}), 400

        skills = normalize_skills(data["skills"])
        qualification = data["qualification"].strip()
        experience_level = data["experience_level"].strip()

        input_df = pd.DataFrame([{
            "skills": skills,
            "qualification": qualification,
            "experience_level": experience_level
        }])

        probabilities = model.predict_proba(input_df)[0]
        classes = model.classes_

        # Top 3 predictions with scores
        top3_idx = probabilities.argsort()[::-1][:3]
        top3 = [
            {
                "role": classes[i],
                "match_score": round(probabilities[i] * 100, 2)
            }
            for i in top3_idx
        ]

        return jsonify({
            "predicted_role": top3[0]["role"],
            "match_score": top3[0]["match_score"],
            "top_matches": top3
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/")
def home():
    return "Flask Job Prediction API Running"

if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5001, debug=debug_mode)
