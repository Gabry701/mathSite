import express from "express";
import path, { join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Change current problem default value in the future
let currentProblem = "es.22 integrali";
const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // per leggere JSON nel body
app.use(express.urlencoded({ extended: true }));

//get the id of the button clicked in the index.html page, that id is the same as the name of the file
app.post("/problem", async (req,res) => {
   currentProblem = req.body.id;
})
//send the current problem name to the page.js file
app.get("/currentId", (req, res) => {
    res.send(currentProblem)
})
// sends the data from the specific txt file to the page.js file to display it
app.get("/takeFile", async (req,res) => {
    const txtPath = path.join(__dirname, "data", `${currentProblem}.txt`)
    let data = await fs.readFile(txtPath, "utf-8")
    res.send(data)
}) 

//generate buttons in the index.html page. Each button has as id the name of the correspondent file
app.get("/buttons", async (req,res) => {
    const dataPath = path.join(__dirname, "data");
    const htmlButtons = []
    const files = await fs.readdir(dataPath);
    for (const file of files) {
        let filePreview = await fs.readFile(path.join(__dirname, "data", file), "utf-8")
        //send html to generate the buttons with the name without the .txt extension and set the preview as the equation (that will always be the first part of the file, or the first equation present)
        await htmlButtons.push(`<button class="problem-button" id="${file.substring(0, file.length-4)}">${filePreview.match(/\$\$.*\$\$/)}</button>`)
    }
    res.send(htmlButtons.join("\n"))
})
 
app.listen(port, () => {
    console.log("server running on port " + port);
})


