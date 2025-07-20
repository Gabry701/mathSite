const inlineMath = document.querySelector(".math-inline")
const blockMath = document.querySelector(".math-block")
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





const maximiseButtons = [maxButton, minMaxButton]
const formatButtons = [bold, italic, underline]
const saveButtons = [saveButton, minSaveButton]
const inlineChar = "$"
const blockChar = "$$"
let currentChar = inlineChar
let isActive = false
let activatedButtons = []
let cursorElement;

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

function calculateCursorOffset(text) {
    if (text.includes("begin") || text.includes("lim"))
        return text.indexOf("{", 10) + 1
    else if (text.includes("<>"))
        return text.length
    else if(text.includes("  "))
        return text.lastIndexOf(" ")
    else if (text.indexOf(" ", 3) != -1)
        return text.indexOf(" ", text.length - 4 ) + 1
    return text.indexOf("{") + 1

}

function insertNewLine(before, after) {
    let updatedAfter, cursorPos, element = cursorElement != undefined? cursorElement : writableCanvas;
    const toAdd = " \\\\\n   "
    if (before.includes("begin{align}")) {
        element.value = before + toAdd + after
        cursorPos = before.length + toAdd.length
    } else {
    const latexStart = before.lastIndexOf("$")
    const latexEnd = after.indexOf("$")
    const updatedBefore = `${before.substring(0, latexStart + 1)}\\begin{align}\n   ${before.substring(latexStart + 1, before.length-1)}`
    if (latexEnd != -1)
        updatedAfter = `\n\\end{align}${after.substring(latexEnd)}`
    element.value = updatedBefore + toAdd + updatedAfter
    cursorPos = updatedBefore.length + toAdd.length
    }   
    element.focus();
    element.setSelectionRange(cursorPos, cursorPos);
}

function addToTextArea(outsideMath, insideMath = null) {
    if (cursorElement == undefined)
        {
            writableCanvas.innerHTML = writableCanvas.innerHTML + outsideMath
            writableCanvas.focus()
            const cursorIfUndefined = calculateCursorOffset(outsideMath)
            writableCanvas.setSelectionRange(cursorIfUndefined, cursorIfUndefined)
            return
        }
        const [cursorPos, textBefore, textAfter] = getCanvasValues()
        const isTextInsideMath = isInsideMath(textBefore)
        let textToAdd = isTextInsideMath && insideMath != null? insideMath : outsideMath;
        if (textToAdd == "newLine"){
                insertNewLine(textBefore, textAfter)
                return
        }
        if (textBefore.length > 0 && !["\n"," ", "{"].includes(textBefore[textBefore.length-1]))
            textToAdd = " " + textToAdd
        const newCursorPos = cursorPos + calculateCursorOffset(textToAdd)
        // const newCursorPos = cursorPos + cursorOffset;
        cursorElement.value = textBefore + textToAdd + textAfter;
        cursorElement.focus();
        cursorElement.setSelectionRange(newCursorPos, newCursorPos);
      
}   
function calculateHighlightOffset(index) {
    const value = writableCanvas.value.substring(0, index);
    let times = (toFind) => (value.match(new RegExp(toFind, "g")) || []).length;
    let offset = - (times("\n")) - 2*times(" <>") + times("/B/") + times("/I/") + times("/U/")
    console.log("offse:" + offset)
    return offset
}

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
document.addEventListener('focusin', function (event) {
        if (event.target.tagName.toLowerCase() === 'textarea') {
            cursorElement = event.target;
        }
});    
    for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        let latexOperator = symbols[buttons[i].id]
        addToTextArea(`${currentChar}${latexOperator}${currentChar}`, latexOperator)
    }
)}
hide.addEventListener("click", () => {
    buttonsSection.classList.add("hidden")
    minimizedButtons.classList.remove("hidden")
    displayCanvas.classList.add("auto-height")
    writableCanvas.classList.add("auto-height")
})
showButton.addEventListener("click", () => {
    buttonsSection.classList.remove("hidden")
    minimizedButtons.classList.add("hidden")
    displayCanvas.classList.remove("auto-height")
    writableCanvas.classList.remove("auto-height")
})
maximiseButtons.forEach(maximise => {
    maximise.addEventListener("click", () => {
        displayCanvas.classList.add("maxed");
        quitPreviewButton.classList.remove("hidden");
        
    });
});
quitPreviewButton.addEventListener("click", () => {
    displayCanvas.classList.remove("maxed")    
    quitPreviewButton.classList.add("hidden")
})
AddMathButton.addEventListener("click", () => {
    addToTextArea(`${currentChar}  ${currentChar}`, "")
})
let timeout, cleanedValue = '';
["focus", "input", "click"].forEach(event => {
    writableCanvas.addEventListener(event, () => {
        let caretIndex = writableCanvas.selectionStart;
        console.log("initial caret: "+ caretIndex)
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            // You can decide whether to remove line breaks here or not
            cleanedValue = "PREVIEW\n" + writableCanvas.value.replaceAll("\n", "").replaceAll(" <>", "\u000a").replaceAll("\\B\\", "<b>").replaceAll("\\I\\", "<i>").replaceAll("\\U\\", "<u>").replaceAll("/B/", "</b>").replaceAll("/I/", "</i>").replaceAll("/U/", "</u>");
            // let cleanedValue = writableCanvas.value.replaceAll("\n", "");
            let offset = calculateHighlightOffset(caretIndex)
            caretIndex += offset + 8;
            displayCanvas.innerHTML = cleanedValue;
            console.log("new caret: " + (caretIndex - 8))
            displayCanvas.innerHTML = displayCanvas.innerHTML.substring(0, caretIndex -1 ) + `<b><span style="color:red">${displayCanvas.innerHTML.substring(caretIndex-1, caretIndex)}</span></b>` + displayCanvas.innerHTML.substring(caretIndex + 1)
            MathJax.typesetPromise([displayCanvas]);
        }, 100);
    });
});
writableCanvas.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.getModifierState("Control")) {
        addToTextArea(" <>\n", "newLine");
        // addToTextArea("\n")
    }
            displayCanvas.scrollTop = writableCanvas.scrollTop;
});
newLineButton.addEventListener("click", function (e) {
        addToTextArea(" <>\n", "newLine");
        // addToTextArea("\n")
});
formatButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        addToTextArea(`\\${button.textContent}\\  /${button.textContent}/`)
});
})
saveButtons.forEach(button => {
    button.addEventListener("click", () => {
    let fileName = prompt("Inserire il nome del file: ") + ".txt"
    if (fileName != "null.txt") {
    const textFile = new Blob([cleanedValue], {type: 'text/plain'});
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
})
})