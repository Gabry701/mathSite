/* VARIABLES AND CONSTANTS */

// DOM objects
const inlineMath = document.querySelector(".math-inline")
const blockMath = document.querySelector(".math-block")
const canvasContainer = document.querySelector(".canvas-container")
const writableCanvas = document.querySelector(".write")
const displayCanvas = document.querySelector(".display")
const buttons = document.getElementsByClassName("math-button")
const hide = document.querySelector(".hide-button")
const buttonsSection = document.querySelector(".buttons-container")
const minimizedButtons = document.querySelector(".minimized-buttons")
const maxButton = document.querySelector(".maximise")
const quitPreviewButton = document.querySelector(".quit-preview-button")
const AddMathButton = document.querySelector(".add-math-button")
const newLineButton = document.querySelector(".newline")
const showButton = document.querySelector(".show-buttons")
const minMaxButton = document.querySelector(".min-preview")
const saveButton = document.querySelector(".save-button")
const minSaveButton = document.querySelector(".min-save")
const bold = document.querySelector(".bold")
const italic = document.querySelector(".italic")
const underline = document.querySelector(".underline")
const addImageButton = document.querySelector(".image-adder")

// arrays for the buttons
// maxButton and minMaxButton are the Preview buttons in maximised and minimized view
const previewButtons = [maxButton, minMaxButton]
const formatButtons = [bold, italic, underline]
const saveButtons = [saveButton, minSaveButton]
// constants for latex
const inlineChar = "$"
const blockChar = "$$"
// add the "PREVIEW" string before the text inserted by the user to prevent errors that occurred in the scrolling if the user started writing directly in latex
const previewText = '<span style="display:block; width: 300px; margin: 0 auto; background-color: white; text-align: center; font-weight: 700; z-index:1;">PREVIEW</span>'

// variables
// selects if the latex should be inline or block level
let currentChar = inlineChar
let isActive = false
let activatedButtons = []
// set the cursor element to writable canvas when loading the page
let cursorElement = writableCanvas;
let cleanedValue = '';
// latex symbols
const symbols = {
    "not-equals": "\\neq ",
    "multiply": "\\times ",
    "divide": "\\div ",
    "plus-minus": "\\pm ",
    "dot-product": "\\cdot ",
    "frac": "\\frac{}{}",
    "sqrt": "\\sqrt{}",
    "nth-root": "\\sqrt[]{}",
    "square": "^2 ",
    "power": "^{}",
    "log": "\\log_{}{}",
    "ln": "\\ln{}",
    "union": "\\cup ",
    "abs": "|{}|",
    "percent": "\\% ",
    "intersection": "\\cap ",
    "inf": "\\infty ",
    "deg": "° ",
    "sin": "\\sin{}",
    "cos": "\\cos{}",
    "tan": "\\tan{}",
    "csc": "\\csc{}",
    "sec": "\\sec{}",
    "cot": "\\cot{}",
    "asin": "\\arcsin{}",
    "acos": "\\arccos{}",
    "atan": "\\arctan{}",
    "sinh": "\\sinh{}",
    "cosh": "\\cosh{}",
    "tanh": "\\tanh{}",
    "pi": "\\pi ",
    "tau": "\\tau ",
    "alpha": "\\alpha ",
    "beta": "\\beta ",
    "gamma": "\\gamma ",
    "delta": "\\delta ",
    "Delta": "\\Delta ",
    "theta": "\\theta ",
    "mu": "\\mu ",
    "epsilon": "\\varepsilon ",
    "lambda": "\\lambda ",
    "rho": "\\rho ",
    "sigma": "\\sigma ",
    "ell": "\\ell ",
    "phi": "\\Phi ",
    "omega": "\\omega ",
    "Gamma": "\\Gamma ",
    "Omega": "\\Omega ",
    "system": "\\begin{cases} \n {} \\\\ \n {} \n\\end{cases}",
    "sum": "\\sum_{=}^{}",
    "product": "\\prod_{=}^{}",
    "limit": "\\lim_{x \\to {}}",
    "derivative": "\\frac{d}{dx} ",
    "partial-derivative": "\\frac{\\partial}{\\partial x} ",
    "integral": "\\int ",
    "definite-integral": "\\int_{}^{}",
    "double-integral": "\\iint ",
    "triple-integral": "\\iiint ",
    "nabla": "\\nabla ",
    "contour-integral": "\\oint ",
    "scientific": "10^{}",
    "sub": "_{}",
    "vector-a": "\\vec{}",
    "implies": "\\Rightarrow ",
    "in": "\\in ",
    "not-in": "\\notin ",
    "subset": "\\subset ",
    "superset": "\\supset ",
    "exists": "\\exists ",
    "not-exists": "\\nexists ",
    "forall": "\\forall ",
    "negation": "\\neg ",
    "and": "\\land ",
    "or": "\\lor ",
    "iff": "\\Leftrightarrow ",
    "angle": "\\angle ",
    "right-angle": "\\angle ",
    "choose": "{}\\choose{}",
    "perpendicular": "\\perp ",
    "parallel": "\\parallel ",
    "congruent": "\\equiv ",
    "similar": "\\sim ",
    "segment-ab": "\\overline{}",
    "angle-ab": "\\widehat{}",
    "naturals": "\\mathbb{N} ",
    "integers": "\\mathbb{Z} ",
    "rationals": "\\mathbb{Q} ",
    "real": "\\mathbb{R} ",
    "complex": "\\mathbb{C} ",
    "empty": "\\varnothing "
};



/* FUNCTIONS */



//checks if the text the user is writing is contained inside a latex section ($...$, $$...$$)
// it works by evaluating if the number of "$" or "$$" before the user's cursor is even (is outside math) or odd (is inside a latex section) 
function isInsideMath (beforeText) {
    if (beforeText.length > 0) {
        let beforeArray = beforeText.split('');
        let count = 0;
        for (let i = 0; i < beforeArray.length; i++) {
                if (beforeArray[i] == "$" && beforeArray[i-1] != "$" ) {
                        count += 1;
                }
            }
            return (count % 2);
        }
        return false;
}

// gets the entire text contained in the writable-canvas html element and the user's cursor position
// it returns an array with [starting position of the text selected by the user, text before, text after]
function getCanvasValues() {
    const cursorPosStart = cursorElement.selectionStart
    const cursorPosEnd = cursorElement.selectionEnd;
    const value = cursorElement.value;
    return [
        cursorPosStart, 
        value.substring(0, cursorPosStart),
        value.substring(cursorPosEnd)
    ]
}

//calculates the offset to add to the addToTextArea function for cursor position calculation
function calculateCursorOffset(text) {
    if (text.includes("begin") || text.includes("lim"))
        return text.indexOf("{", 10) + 1
    else if (text.includes("partial x}"))
        return text.lastIndexOf("}") + 2
    else if (text.includes("<>"))
        return text.length
    else if(text.includes("  "))
        return text.lastIndexOf(" ")
    else if (text.indexOf(" ", 1) != -1)
        return text.indexOf(" ", text.length-4) + 1
    else if (text.includes("[["))
        return text.lastIndexOf("[") + 1
    return text.indexOf("{") + 1
}

// it adds a new line to the writable-canvas text the \begin{align} \end{align} latex function if the user is writing inside a latex math scope
// before and after are the values of the text before and after the user's cursor position
function insertNewLine(before, after) {
    // element: the element that is currently selected by the user or the writable-canvas
    let updatedAfter, cursorPos, element = cursorElement != undefined? cursorElement : writableCanvas;
    const toAdd = " \\\\\n   " // three spaces to account for the "<>" length
    // if the begin{align} syntax is already present it only adds "\\" (toAdd)
    if (before.includes("begin{align}")) {
        element.value = before + toAdd + after
        cursorPos = before.length + toAdd.length
    } else {
    // get the positions of the nearest "$" to know where to add the \begin{align}, \end{align} syntax
    const latexStart = before.lastIndexOf("$")
    const latexEnd = after.indexOf("$")
    // add \begin{cases}
    const updatedBefore = `${before.substring(0, latexStart + 1)}\\begin{align}\n   ${before.substring(latexStart + 1, before.length-1)}`
    // add \end{cases} only if the latex section is already closed (always if using buttons, not sure if user is using only keyboard)
    if (latexEnd != -1)
        updatedAfter = `\n\\end{align}${after.substring(latexEnd)}`
    // add the modified syntax + the newline character (\\)
    element.value = updatedBefore + toAdd + updatedAfter
    cursorPos = updatedBefore.length + toAdd.length
    }
    // focus the writable-canvas and set the cursor in the right place
    element.focus();
    element.setSelectionRange(cursorPos, cursorPos);
}

// add any value from the buttons to the writable-canvas (textarea)
// outside math and inside math refer to the values that the value takes if the user is placing it inside or outside of a latex math scope
function addToTextArea(outsideMath, insideMath = null) {
    // get values of the position of the cursor and of the text before and after
    const [cursorPos, textBefore, textAfter] = getCanvasValues()
    // check if text is inside math to see which character to add
    const isTextInsideMath = isInsideMath(textBefore)
    let textToAdd = isTextInsideMath && insideMath != null? insideMath : outsideMath;
    // if the text to add is "newLine" (add a new line inside a latex math scope) call the insertNewLine function to add the \begin{align} syntax
    if (textToAdd == "newLine"){
            insertNewLine(textBefore, textAfter)
            return
    }
    // add a space after the symbols that don't already have it
    if (textBefore.length > 0 && !["\n"," ", "{"].includes(textBefore[textBefore.length-1]) && inlineChar != "")
        textToAdd = " " + textToAdd
    // calculate the final cursor position, replace the textarea value with the one that contains the just added symbol and focus the textarea
    const newCursorPos = cursorPos + calculateCursorOffset(textToAdd)
    cursorElement.value = textBefore + textToAdd + textAfter;
    console.log(textToAdd)
    console.log(textAfter)
    console.log(textBefore)
    
    cursorElement.focus();
    cursorElement.setSelectionRange(newCursorPos, newCursorPos);
    
}
/* HIGHLIGHT FUNCTION REMOVED BECAUSE IT MESSED WITH THE IMAGES SPANS
    // calculate the offset to add to have a precise highlight of the character that has just been written
    function calculateHighlightOffset(index) {
        const value = writableCanvas.value.substring(0, index);
        let times = (toFind) => (value.match(new RegExp(toFind, "g")) || []).length;
        let offset = - (times("\n")) - 2*times(" <>") + times("/B/") + times("/I/") + times("/U/") - (value.match(/\(\[.*?\]\)/g)|| []).length 
        return offset
    }
*/


//manage the display mode of the display-canvas
function manageDisplayCanvasView() {
    setTimeout(() => {
    
        // update the display-canvas every 100ms
            // convert the text written in the writable-canvas language into html code
            cleanedValue = previewText + writableCanvas.value.replaceAll("\n", "").replaceAll(" <>", "\u000a").replaceAll("\\B\\", "<b>").replaceAll("\\I\\", "<i>").replaceAll("\\U\\", "<u>").replaceAll("/B/", "</b>").replaceAll("/I/", "</i>").replaceAll("/U/", "</u>")
            
            //replace [()] with image tag + customize width, height and align
            cleanedValue = cleanedValue.replace(/\[\(([^)]+)\)\]/g, (m, innerText) => {
                const name = innerText.match(/[\w\-]+\.\w+/g)[0]
                const width = (innerText.match(/(?<=\|)[0-9]*/g) || []).join("")
                const height = (innerText.match(/(?<=\*)[0-9]*/g)||[]).join("")
                const align = (innerText.match(/(?<=\:)\w*/g)||[]).join("")
                let alignCode = "";
                if (align == "center") 
                    alignCode = "margin: 0 auto;"
                else if (align == "right") 
                    alignCode = "margin-left:auto; margin-right: 0"
                
                return `<span style="display:block; width: ${width || 640}px; height:${height || "auto"}px; background-image:url('./images/${name}'); border: 10px solid white; background-size: 100% 100%; background-repeat: no-repeat; background-position: center; border-radius: 10px; border: 1px solid transparent; ${alignCode}"></span>`;
            })
            // add text to display-canvas
            displayCanvas.innerHTML = cleanedValue;
            
            /* HIGHLIGHT REMOVED BECAUSE IT MESSED WITH IMAGES SPANS
                let caretIndex = writableCanvas.selectionStart;
                // the index at which to highlight the text changes due to the differences between the writable-canvas language and the html code of the cleaned value
                let offset = calculateHighlightOffset(caretIndex)
                caretIndex += offset + previewText.length;
                displayCanvas.innerHTML = displayCanvas.innerHTML.substring(0, caretIndex -1 ) + `<b>${displayCanvas.innerHTML.substring(caretIndex-1, caretIndex)}</b>` + displayCanvas.innerHTML.substring(caretIndex + 1)
            */

            // toggle MathJaxvisualization only in display-canvas to correctly display laTex
            MathJax.typesetPromise([displayCanvas]);
        }, 100)
}

// save text converted in html code to txt file
function saveToTxtFile() {
        let fileName = prompt("Inserire il nome del file: ") + ".txt"
    if (fileName != "null.txt") {
    const textFile = new Blob([cleanedValue.substring(previewText.length)], {type: 'text/plain'});
    const textFileUrl = URL.createObjectURL(textFile)
    const a = document.createElement('a')
    a.setAttribute('href', textFileUrl)
    a.setAttribute('download', fileName)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(textFileUrl)
    }
}



/* EVENT LISTENERS */

// manage view in display-canvas (have no idea why it has to be the first event listener but if it isn't it breaks)
["focus", "input", "click"].forEach(event => {
    writableCanvas.addEventListener(event, () => {
        manageDisplayCanvasView()
    });
});

// change between inline and block level latex via the buttons (inline adds "$ $", block adds "$$ $$")
blockMath.addEventListener("click", () => {
    blockMath.style.backgroundColor = "var(--azure)";
    inlineMath.style.backgroundColor = "var(--light-cyan)"
    currentChar = blockChar;
})
inlineMath.addEventListener("click", () => {
        inlineMath.style.backgroundColor = "var(--azure)";
        blockMath.style.backgroundColor = "var(--light-cyan)"
        currentChar = inlineChar;
})

// call the addToTextArea function to add a symbol via the buttons
document.addEventListener('focusin', function (event) {
        if (event.target.tagName.toLowerCase() === 'textarea') {
            cursorElement = event.target;
        }
});    
    for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        // the latexOperator is the custom symbol associated with each button inside the math-buttons container
        let latexOperator = symbols[buttons[i].id]
        addToTextArea(`${currentChar}${latexOperator}${currentChar}`, latexOperator)
    }
)}

// toggle minimized view
hide.addEventListener("click", () => {
    buttonsSection.classList.add("hidden")
    minimizedButtons.classList.remove("hidden")
    canvasContainer.classList.add("auto-height")
})
showButton.addEventListener("click", () => {
    buttonsSection.classList.remove("hidden")
    minimizedButtons.classList.add("hidden")
    canvasContainer.classList.remove("auto-height")
})

// toggle preview mode
previewButtons.forEach(maximise => {
    maximise.addEventListener("click", () => {
        displayCanvas.classList.add("maxed");
        quitPreviewButton.classList.remove("hidden");
    });
});
quitPreviewButton.addEventListener("click", () => {
    displayCanvas.classList.remove("maxed")    
    quitPreviewButton.classList.add("hidden")
})

// add the latex start and end symbols (inline: "$ $", block: "$$ $$")
AddMathButton.addEventListener("click", () => {
    addToTextArea(`${currentChar}  ${currentChar}`, "")
})

// shorcut to add a newline via "CTRL + ENTER"
writableCanvas.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.getModifierState("Control")) {
        addToTextArea(" <>\n", "newLine");
    }
    //sync the scrolling between the display and the writable canvases
    displayCanvas.scrollTop = writableCanvas.scrollTop;
});
// add new line via the button
newLineButton.addEventListener("click", function (e) {
        addToTextArea(" <>\n", "newLine");
});
// add symbols to make the text bold, italic or underlined (bold: \B\ /B/, italic: \I\ /I/, underlined: \U\ /U/)
formatButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        addToTextArea(`\\${button.textContent}\\  /${button.textContent}/`)
});
})
// save the text (converted into html code by the )
saveButtons.forEach(button => {
    button.addEventListener("click", () => {
        saveToTxtFile()
    })
})

addImageButton.addEventListener("click", () => {
    addToTextArea("[()]")
})

//load preview text in display canvas on load
window.onload = manageDisplayCanvasView()