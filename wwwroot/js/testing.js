import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";
import { lineMaker } from "./drag_drop.js";
import { VariableBlock, LiteralBlock, DummyLiteralBlock } from "./classes/ValueBlock.js";

function test(){
    alert("Testing");
}

let expressionCon = document.getElementById("expressionContainer");
let varCon = document.getElementById("variableContainer");
let logicCon = document.getElementById("logicContainer");
let scopeCon = document.getElementById("scopeContainer");
let equalityCon = document.getElementById("equalityContainer");
let functionCon = document.getElementById("functionContainer");
let assCon = document.getElementById("assignmentContainer");

for(let i = 0; i < DummyLiteralBlock.subTypes.length; i++)
{
    let block = new DummyLiteralBlock(DummyLiteralBlock.subTypes[i]);
    varCon.appendChild(block.element);
}

// iterate through all the subtypes in assignment block

for (let i = 0; i < AssignmentBlock.subTypes.length; i++) 
{
    let block = new AssignmentBlock(AssignmentBlock.subTypes[i]);
    block.element.className += " dummy";
    assCon.appendChild(block.element);
}

// iterate through all the subtypes in equality block

for (let i = 0; i < EqualityBlock.subTypes.length; i++)
{
    let block = new EqualityBlock(EqualityBlock.subTypes[i]);
    block.element.className += " dummy";
    equalityCon.appendChild(block.element);
}

// iterate through all the subtypes in expression block

for (let i = 0; i < ExpressionBlock.subTypes.length; i++)
{
    let block = new ExpressionBlock(ExpressionBlock.subTypes[i]);
    block.element.className += " dummy";
    expressionCon.appendChild(block.element);
}

// iterate through all the subtypes in function block
let block = new FunctionBlock("print");
block.element.className += " dummy";
functionCon.appendChild(block.element);

// iterate through all the subtypes in logic block

for (let i = 0; i < LogicBlock.subTypes.length; i++)
{
    let block = new LogicBlock(LogicBlock.subTypes[i]);
    block.element.className += " dummy";
    logicCon.appendChild(block.element);
}

// iterate through all the subtypes in scope block

for (let i = 0; i < ScopeBlock.subTypes.length; i++)
{
    let block = new ScopeBlock(ScopeBlock.subTypes[i]);
    block.element.className += " dummy";
    scopeCon.appendChild(block.element);
}


lineMaker(document.getElementById("test2"));

function matchType(block) {

    // get the type of block
    let value = block.dataset.blockType;

    if (!block.classList.contains("global") && value === "variable" ) {

        // get the variable name
        return {"type": "variable", "name": block.dataset.name};
    } else {

        // match the type of value for literals and global variables
        let type = block.dataset.subType;

        // create the block object
        switch (type) {
            case "number":
                return {"type": "value", 
                        "field": "num", 
                        "num": block.getElementsByClassName('number-input')[0].value};
            case "string":
                return {"type": "value", 
                        "field": "text", 
                        "text": block.getElementsByClassName('string-input')[0].value};
            case "boolean":
                return {"type": "value", 
                        "field": "boolean", 
                        "boolean": block.getElementsByClassName('boolean-input')[0].checked};
            case "float":
                return {"type": "value", 
                        "field": "float", 
                        "float_num": block.getElementsByClassName('float-input')[0].value};
            default:
                return null;
        }
    }
}

function getValue(blockObject, codeBlock) {

    // get the type of block
    let type = blockObject["type"];

    // check the block if there are any values
    let input = codeBlock.getElementsByClassName('value');

    // add the values to the object
    if (input) {

        // match the inputs needed for the block
        switch (type) {
            case "function":
                if ("operation" in blockObject) {
                    // assignment has A and B
                    blockObject["A"] = {"type": "variable", "name": input[0].dataset.name};
                    blockObject["B"] = matchType(input[1]);
                } else {
                    // print has input
                    blockObject["input"] = matchType(input[0]);
                }
                break;
            case "value":
                // math has A
                blockObject["A"] = matchType(input[0]);
                break;
            case "logic":
                if (input[0].dataset.subType === "single") {
                    // single has A
                    blockObject["A"] = matchType(input[0]);
                } else {
                    // logic has A and B
                    blockObject["A"] = matchType(input[0]);
                    blockObject["B"] = matchType(input[1]);
                }
                break;
            default:
                break;
        }
    }    
}

function getInput(block, line) {

    // use a temp variable to chain blocks
    let reference = block;
    // get the next block in the line
    let inputIndex = 1;
    // get the block type
    let type = line[inputIndex].dataset.blockType === "equality" ? "logic" : "value";

    // match the type
    if (type === "logic") {
        
        // go through all the blocks in the line
        while (inputIndex < line.length) {

            // create the object
            reference["input"] = {"type": type};

            // match the type of logic block
            let logic = line[inputIndex].dataset.subType;

            // add the logic type to the object
            switch (logic) {
                case "single":
                    reference["input"]["logic"] = "single_chain";
                    break;
                case "==":
                    reference["input"]["logic"] = "equals_chain";
                    break;
                case "!=":
                    reference["input"]["logic"] = "not_equals_chain";
                    break;
                case "<":
                    reference["input"]["logic"] = "less_chain";
                    break;
                case ">":
                    reference["input"]["logic"] = "greater_chain";
                    break;
                case "<=":
                    reference["input"]["logic"] = "less_equals_chain";
                    break;
                case "<=":
                    reference["input"]["logic"] = "greater_equals_chain";
                    break; 
                case "and":
                    reference["input"]["logic"] = "and_chain";
                    break;
                case "or":
                    reference["input"]["logic"] = "or_chain";
                    break;
                default:
                    break;
            }

            // get the left and right values
            if (reference["input"]["logic"] != "and_chain" && reference["input"]["logic"] != "or chain") {
                getValue(reference["input"], line[inputIndex]);
            }

            // check the next block that was chained
            reference = reference["input"];
            inputIndex++;
        }

    } else {

        // go through all the blocks in the line
        while (inputIndex < line.length) {

            // create the object
            reference["input"] = {"type": type, "field": "operation"};

            // match the type of operation block
            let operation = line[inputIndex].dataset.subType;

            // add the operation type to the object
            switch (operation) {
                case "+":
                    reference["input"]["operation"] = "add_chain";
                    break;
                case "-":
                    reference["input"]["operation"] = "subtract_chain";
                    break;
                case "*":
                    reference["input"]["operation"] = "multiply_chain";
                    break;
                case "/":
                    reference["input"]["operation"] = "divide_chain";
                    break;
                case "%":
                    reference["input"]["operation"] = "modulo_chain";
                    break;
                default:
                    break;
            }

            // get the single value
            getValue(reference["input"], line[inputIndex]);

            // check the next block that was chained
            reference = reference["input"];
            inputIndex++;
        }
    }
}

function parseLines (container, scoped) {

    // build the list of lines
    let list = [];

    // filter the container
    let lines = scoped ? container.children[1].children 
                       : container.children 
    
    // get the lines in container
    lines = Array.prototype.slice.call( lines )
        .filter((x) => x.className === "line" || x.className === "scope-container");

    // go through all the lines
    for (let i = 0; i < lines.length; i++) {

        // get the blocks in line
        let blocksInLine = lines[i].getElementsByClassName("code-block");
        
        // create
        if (blocksInLine.length) {

            // create the object
            let block = { "type": blocksInLine[0].dataset.blockType };

            // add the values for the block
            switch (block["type"]) {
                case "function":
                    
                    // print
                    block["instruction"] =  blocksInLine[0].dataset.subType;
                    getValue(block, blocksInLine[0]);
                    break;

                case "scope":
                    
                    // if elif else while
                    block = {"type": "control", "instruction": blocksInLine[0].dataset.subType};

                    // chain equality and logic blocks
                    if (blocksInLine.length > 1) {
                        getInput(block, blocksInLine);
                    }

                    // go inside scope container
                    i++;

                    // get the lines inside the scope container
                    block["children"] = parseLines(lines[i], true);;
                    break;
                case "assignment":
                    
                    // = += -= *= /=
                    block = {"type": "function", "field": "operation"};

                    // match the operation block
                    let operation = blocksInLine[0].dataset.subType;

                    // add the operation type to the object
                    switch(operation) {
                        case "=":
                            block["operation"] = "assign_variable";
                            break;
                        case "+=":
                            block["operation"] = "assign_add";
                            break;
                        case "-=":
                            block["operation"] = "assign_subtract";
                            break;
                        case "*=":
                            block["operation"] = "assign_multiply";
                            break;
                        case "/=":
                            block["operation"] = "assign_divide";
                            break;
                        default:
                            break;
                    }

                    getValue(block, blocksInLine[0]);

                    // chain math blocks
                    if (blocksInLine.length > 1) {
                        getInput(block, blocksInLine);
                    }
                    break;
                default:
                    break;
            }

            // add the block to the list
            list.push(block);
        }
    }
    return list;
}

function runCode () {
    let list = [];

    // get the variables first
    let vars = document.getElementById("variableContainer").getElementsByClassName("variable-block");
    
    // go through all the variables
    for (let i = 0; i < vars.length; i++) {

        // add them to the list
        list.push({
            "type": "function",
            "field": "operation",
            "operation": "assign_variable",
            "A": {
                "type": "variable",
                "name": vars[i].dataset.name
            },
            "B": matchType(vars[i])
        })
    }
    
    // get the code container
    let container = document.getElementsByClassName("tab-contents")[0]
        .getElementsByClassName("active")[0];

    // add all the lines to the list
    list = list.concat(parseLines(container, false));
    
    // create the block list
    let blockList = {"blocks": list};
    console.log(blockList);

    // send it to the server to be compiled
    let clone;
    fetch("http://localhost:5215/api/runPython", {
      method: "POST",
      body: JSON.stringify(blockList),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then((res) => {
        // clone if you only have text
        clone = res.clone();
        return res.json();
    }).then((json) => {
        // put it in the console
        document.getElementById("console-textarea").value = json;
        consoleOutput = document.getElementById("console-textarea");
        console.log(json);
    }, (rej) => {
        clone.text().then((text) => {
            // put it in the console if there is only text
            document.getElementById("console-textarea").value = text;
            consoleOutput = document.getElementById("console-textarea");
            console.log(text);
        }).then(() => checkAnswer());
    }).then(() => checkAnswer());
};


let answerIsCorrect = false;
    let consoleOutput = document.getElementById("console-textarea").value;
    let answer = "hello world"; // for question 1
    const checkmarkImage = document.getElementById('checkmark');
    const checkmarkContainer = document.querySelector('.checkmark-image');
    const incorrectAnswerMessageContainer = document.querySelector('.wrong-answer-message');

function checkAnswer()
    {
    consoleOutput = document.getElementById("console-textarea").value;
      console.log("run button clicked");
      console.log("consoleOutput: ", consoleOutput);
      console.log("answer: ", answer);

      if (consoleOutput.trim() === answer)
      {
        answerIsCorrect = true;
      } else
      {
        answerIsCorrect = false;
      }

      console.log("answerIsCorrect: ", answerIsCorrect);

      if (answerIsCorrect)
      {
        incorrectAnswerMessageContainer.innerHTML = '';
        checkmarkContainer.innerHTML = '<img src="/images/checkMark.png" alt="check mark image" id="checkmark">';
        console.log("IF checkmarkContainer: ", checkmarkContainer);
      } else
      {
        // Clear previous content in checkmarkContainer
        checkmarkContainer.innerHTML = '';

        incorrectAnswerMessageContainer.innerHTML = 'Oops! Let us try again :) ';
      }
}


    

function compileAndCheck() {
    runCode();
    //checkAnswer();
}

document.getElementsByClassName("run-button")[0].onclick = function() {compileAndCheck();}

console.log("here");
