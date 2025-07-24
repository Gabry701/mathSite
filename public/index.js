let problemButtons
const main = document.querySelector("main");


window.addEventListener("load", async () => {
    await fetch('/buttons')
    .then(res => res.text())
    .then(htmlButtons => {main.innerHTML = htmlButtons})
    .then(() => problemButtons = document.querySelectorAll(".problem-button"))
    problemButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
            const buttonId = e.currentTarget.id;
            // console.log(buttonId)
            await fetch("/problem", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: buttonId })
            })
            .then(window.location.href = "/page.html")
        })
    });
    MathJax.typesetPromise([problemButtons])
}) 