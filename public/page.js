const fs = require('fs')
const canvas = document.querySelector(".canvas")
const pageName = document.querySelector('title')
let filename;
let file = fs.readFile("./files/" + fileName);

filename = pageName + '.txt';
file = fs.readFile("./files/" + fileName)


canvas.innerHTML = file;