let cleanedValue = "Here is a dog [(dog.png|20*30:center)]!";
const width = cleanedValue.match(/(?<=\|)[0-9]*/g).join("")
const height = cleanedValue.match(/(?<=\*)[0-9]*/g).join("")
const align = cleanedValue.match(/(?<=\:)\w*/g).join("")
console.log(width);
console.log(height);
console.log(align);