import express from "express";
import path, { join } from "path";
import { fileURLToPath } from "url";
// import fs from "fs";
import fs from "fs/promises";

let currentProblem = "es.22 integrali";
const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // per leggere JSON nel body
app.use(express.urlencoded({ extended: true }));

app.post("/problem", async (req,res) => {
   currentProblem = req.body.id;
//    console.log(currentProblem)
})

app.get("/currentId", (req, res) => {
    // console.log("currentproblem:" + currentProblem)
    res.send(currentProblem)
})
app.get("/takeFile", async (req,res) => {
    const txtPath = path.join(__dirname, "data", `${currentProblem}.txt`)
    let data = await fs.readFile(txtPath, "utf-8")
    // console.log(data) 
    res.send(data)
}) 

app.get("/buttons", async (req,res) => {
    const dataPath = path.join(__dirname, "data");
    const htmlButtons = []
    const files = await fs.readdir(dataPath);
    for (const file of files) {
        let filePreview = await fs.readFile(path.join(__dirname, "data", file), "utf-8")
        await htmlButtons.push(`<button class="problem-button" id="${file.substring(0, file.length-4)}">${filePreview.match(/\$\$.*\$\$/)}</button>`)
    }
    res.send(htmlButtons.join("\n"))
})
 
app.listen(port, () => {
    console.log("server running on port " + port);
})


