// const fs = require('fs')
const canvas = document.querySelector(".canvas")
const pageName = document.querySelector('title')
// let filename;
// let file = fs.readFile("./files/" + fileName);

window.addEventListener("load", async () => {
    await fetch("/currentId")
    .then(res => res.text())
     .then(currentProblem => {
        pageName.innerHTML = currentProblem
    })
    .then(getDataFromTxt())
})
async function getDataFromTxt() {
    await fetch("/takeFile")
    .then(res => res.text())
    .then(data => {
        canvas.innerHTML = data
        MathJax.typesetPromise([canvas]);
    })
}
