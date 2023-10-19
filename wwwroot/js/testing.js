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
let block = new FunctionBlock();
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


