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

function parseScope() {

}

document.getElementById("test-button").onclick = function () {
    console.log("clicked");
    let lines = document.getElementsByClassName("tab-contents")[0].getElementsByClassName("line");
    let list = [];
    for (let i = 0; i < lines.length; i++) {
        let blocks = lines[i].getElementsByClassName("code-block");
        if (blocks.length) {
            console.log(blocks[0].dataset.blockType + " : " + blocks[0].dataset.subType);
            let blockObject = {"type": blocks[0].dataset.blockType, "field": blocks[0].dataset.subType};
            if (blocks.length > 1) {
                blockObject["input"] = [];
                for (let j = 1; j < blocks.length; j++) {
                    console.log("input: " + blocks[j].dataset.blockType + " : " + blocks[j].dataset.subType);
                    blockObject["input"].push({"type": blocks[j].dataset.blockType, "field": blocks[0].dataset.subType});
                }
            }



            if (blockObject.type === "scope") {

                // go to next child
                i++;
                // make a list of children
                blockObject["children"] = [];

                // let stack = 

                // go through all the block's children
                if (lines[i].parentNode.parentNode.className === "scope-container") {
                    console.log("child: " + blocks[i].dataset.blockType + " : " + blocks[0].dataset.subType);
                    blockObject["children"].push({"type": blocks[i].dataset.blockType, "field": blocks[i].dataset.subType});
                }

                // add the block after getting all children
                list.push(blockObject);
            }
            
        }
        
        // if (blocks) {
        //     
        // }
        
    }
    console.log(list);
};

console.log("here");
