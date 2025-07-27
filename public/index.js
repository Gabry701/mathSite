let problemButtons
const main = document.querySelector("main");

// as soon as it is loaded request the buttons html code to the server
// the server will responde with n buttons, each one with id equal to the name of the .txt file to which it is associated
window.addEventListener("load", async () => {
    await fetch('/buttons')
    .then(res => res.text())
    // display the buttons in the html
    .then(htmlButtons => {main.innerHTML = htmlButtons})
    // select the buttons after they have been added to the html
    .then(() => problemButtons = document.querySelectorAll(".problem-button"))
    problemButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
            // when clicked, send the id to the server that will save it into a variable to know which problem to display in the page.html file
            const buttonId = e.currentTarget.id;
            await fetch("/problem", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: buttonId })
            })
            // redirect the user to the /page.html url
            // idk why tf this syntax works, without .then it doesn't, if i wrap it in a function neither, fuck asynchronous js >:(
            .then(window.location.href = "/page.html")
        })
    });
    // display the button's previews in latex
    MathJax.typesetPromise([problemButtons])
}) 