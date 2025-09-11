import express from "express";
import path, { join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import dotenv from "dotenv"
import pool from "./db.js"
import multer from "multer"
import { createBrotliCompress } from "zlib";

// Change current problem default value in the future
let currentProblem = "es.22 integrali";
const app = express(); 
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/temporaryImages", express.static(path.join(__dirname, "data/temporaryImages")))
app.use(express.json()); // per leggere JSON nel body
app.use(express.urlencoded({ extended: true }));

dotenv.config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./data/temporaryImages")
    },
    filename: (req, file , cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });



//get the id of the button clicked in the index.html page, that id is the same as the name of the file
app.post("/problem", async (req,res) => {
   currentProblem = req.body.id;
   res.sendStatus(200)
})
//send the current problem name to the page.js file
app.get("/currentId", (req, res) => {
    res.send(currentProblem)
})
// sends the data from the specific txt file to the page.js file to display it
app.get("/takeFile", async (req,res) => {
    const txtPath = path.join(__dirname, "data", "docs", `${currentProblem}.txt`)
    let data = await fs.readFile(txtPath, "utf-8")
    res.send(data)
}) 

//generate buttons in the index.html page. Each button has as id the name of the correspondent file
app.get("/buttons", async (req,res) => {
    const dataPath = path.join(__dirname, "data", "docs");
    const htmlButtons = []
    const files = await fs.readdir(dataPath);
    for (const file of files) {
        let filePreview = await fs.readFile(path.join(dataPath, file), "utf-8")
        //send html to generate the buttons with the name without the .txt extension and set the preview as the equation (that will always be the first part of the file, or the first equation present)
        await htmlButtons.push(`<button class="problem-button" id="${file.substring(0, file.length-4)}">${filePreview.match(/\$\$.*\$\$/)}</button>`)
    }
    res.send(htmlButtons.join("\n"))
})
 
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file); // info about uploaded file
  res.sendStatus(200);
});

app.get("/displayImages", async (req,res) => {
    const images = await fs.readdir(path.join(__dirname, "data", "temporaryImages"))
    const imagesPaths = images.map(image => path.join("/temporaryImages", image))
    res.send(imagesPaths)
})

app.post("/removeImage", (req,res) => {
    fs.unlink(path.join(__dirname, "data", req.body["imageName"]))
    res.sendStatus(200)
})

app.post("/newProblem", async (req,res) => {
    console.log(req.body)
    if (Object.keys(req.body).length > 0) {
        const sourceDir = path.join(__dirname, "data", "temporaryImages");
        const destDir = path.join(__dirname, "public", "images");
        const images = await fs.readdir(sourceDir)
        images.forEach(image => {
            const srcPath = path.join(sourceDir, image);
            const destPath = path.join(destDir, image);
            fs.rename(srcPath, destPath)
        });
        res.sendStatus(200)
        pool.query(`INSERT INTO solutions (exercise, solution, subject) VALUES ($1, $2, $3)`, [req.body.solutionName, req.body.solutionText, req.body.subject])
    }
    else 
        res.sendStatus(500)
})


app.listen(port, () => {
    console.log("server running on port " + port);
})
