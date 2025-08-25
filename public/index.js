const main = document.querySelector("main");

// as soon as it is loaded request the buttons html code to the server
// the server will responde with n buttons, each one with id equal to the name of the .txt file to which it is associated
window.addEventListener("load", async () => {
    const res = await fetch('/buttons')
    const data = await res.text()
    // display the buttons in the html
    main.innerHTML = data;
    // select the buttons after they have been added to the html
    const problemButtons = document.querySelectorAll(".problem-button")
    // display the button's previews in latex
    await MathJax.typesetPromise([problemButtons])

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
            window.location.href = "/page.html"
        })
    });
})