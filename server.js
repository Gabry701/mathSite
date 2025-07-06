import express from "express";
import path, { join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const app = express();
const port = "3000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, (req,res) => {
    console.log("server running on port " + port);
})

fs.readFile("files")
