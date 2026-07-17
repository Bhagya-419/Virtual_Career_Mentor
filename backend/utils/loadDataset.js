const fs = require("fs")
const csv=require("csv-parser")

let dataset = []

const loadDataset = () => {
    fs.createReadStream("ml/candidate_job_role_dataset.csv")
    .pipe(csv())
    .on("data", (row) => {
        dataset.push({
            skills: row["skills"],
            qualification: row["qualification"],
            experience_level: row["experience_level"],
            job_role: row["job_role"],
        })
    })
    .on("end", () => {
        console.log("Dataset loaded successfully")
    })
}
const getDataset = ()=>dataset
module.exports={loadDataset,getDataset}