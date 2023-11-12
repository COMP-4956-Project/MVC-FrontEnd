import { LiteralBlock, DummyLiteralBlock, VariableBlock } from "./classes/ValueBlock.js";

let varCon = document.getElementById("variableContainer");

var options = ["string", "number", "boolean", "float"];
var dropdown = document.getElementById("selectType");

for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    option.value = options[i];
    dropdown.add(option);
}

var valueInput = document.getElementById("valueInput");

var textInput = document.getElementById("textInput");


dropdown.addEventListener("change", function() {

    var selected = dropdown.value;
    switch(selected) {
        case "string":
            valueInput.type = "text";
            break;
        case "number":
            valueInput.type = "number";
            break;
        case "boolean":
            valueInput.type = "checkbox";
            break;
        case "float":
            valueInput.type = "number";
            break;
        default:
            valueInput.type = "text";
            break;
    }
})

document.getElementById("createbutton").onclick = function()  {
    if(valueInput.text == "" || textInput.text == "" || dropdown.value == "") {
        var container = document.getElementById("createvariable");
        var message = document.getElementById("error");
        if(!message) {
            var error = document.createElement("p");
            error.id = "error"
            error.textContent = "Please fill out all fields before creating the variable.";
            error.style.color = "red";


            container.appendChild(error);

            setTimeout(function() {
                container.removeChild(error);
            }, 3000)
        }
    } else {
        varCon.appendChild(new VariableBlock(dropdown.value, textInput.value, valueInput.text).element)
    }
}