const canvas = document.querySelector(".canvas")
const pageName = document.querySelector('title')

//get data from txt file sent by the server and display it in the canvas
async function getDataFromTxt() {
    await fetch("/takeFile")
    .then(res => res.text())
    .then(data => {
        canvas.innerHTML = data
        MathJax.typesetPromise([canvas]);
    })
}


//on load fetch the current problem html via it's id and display the contents of the .txt file in the page
window.addEventListener("load", async () => {
    await fetch("/currentId")
    .then(res => res.text())
     .then(currentProblem => {
        pageName.innerHTML = currentProblem
    })
    .then(getDataFromTxt())
})

