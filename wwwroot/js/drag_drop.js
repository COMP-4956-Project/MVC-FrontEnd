import { CodeSlot, AssignmentBlock, EqualityBlock, FunctionBlock,ExpressionBlock, LogicBlock, ScopeBlock, isNullOrEmpty } from "./classes/CodeBlock.js";
import { LiteralBlock, DummyLiteralBlock, VariableBlock } from "./classes/ValueBlock.js";
export function allowDrop(ev) 
{
    ev.preventDefault();
}
  
export function drop(ev) 
{
  ev.preventDefault();



  //ensure were only dropping into a code slot
  if(ev.target.className != "code-block-slot")
  {
    return;
  }

  // get the stored element id
  let elementId = ev.dataTransfer.getData("key");
  let draggedBlock = document.getElementById(elementId);

  let rightNeighbor = null;

  // if were pulling from the toolbox we need to make a new block
  let element = draggedBlock;
  if(draggedBlock.className.includes("dummy"))
  {
    element = null;
  }
  else
  {
    rightNeighbor = draggedBlock.nextElementSibling;
  }

  let block = makeIntoAppropriateBlock(draggedBlock.dataset.blockType, draggedBlock.dataset.subType, element);

  try
  {
    // make sure we dot put blocks in the wrong places
    block.hasValidNeighbors(ev.target)
  }
  catch(e)
  {
    let dialog = document.getElementById("okDialog");
    let message = document.getElementById("okDialogMessage");

    message.innerHTML = e.message;
    dialog.showModal();
    return;
  }

    //replace the code slot with the block
  ev.target.replaceWith(block.element);

  //ensure were not creating logic errors in previous location
  while(rightNeighbor != null)
  {
    rightNeighbor = makeIntoAppropriateBlock(rightNeighbor.dataset.blockType, rightNeighbor.dataset.subType, rightNeighbor);
    if(rightNeighbor != null)
    {
      try
      {
        rightNeighbor.hasValidNeighbors(rightNeighbor.element);
        break;
      }
      catch(e)
      {
        let oldNeighbor = rightNeighbor.element;
        rightNeighbor = oldNeighbor.nextElementSibling;
        oldNeighbor.remove();
      }
    }
    else
    {
      break;
    }
  }


  //check to see if we need to put a new code slot after
  if(block.element.nextElementSibling == null && (block.subType != "else" && block.blockType != "function"))
  {
      let newSlot = new CodeSlot();
      block.element.parentElement.appendChild(newSlot.element);
  }

  //handle creating a new line
  let lineContainer = block.element.parentElement.closest(".line-container");
  if(lineContainer == null || lineContainer == undefined)
  {
    lineContainer = document.getElementById("test2");
  }
  
  let lineIndex = Array.prototype.indexOf.call(lineContainer.children, block.element.parentElement);

  // make a whole new space for scopes
  if(block.blockType == "scope")
  {
    newScope(lineContainer, block.element.id);
    lineIndex++;
  }

  //if we are at the end of the line container make a new line
  if(lineIndex == lineContainer.children.length - 1)
  {
      lineMaker(lineContainer);
  }

  removeEmptyLines();

  // responsible for keeping scope blocks the right size
  adjustScopeDividers();
}

function adjustScopeDividers()
{
  let dividers = document.getElementsByClassName("scope-divider");

  for(let divider of dividers)
  {
    let lineContainer = divider.nextElementSibling;

    divider.style.height = lineContainer.clientHeight + "px";
  }
}

function newScope(lineContainer, parentIfId)
{
  let scopeContainer = document.createElement("div");
  scopeContainer.id = parentIfId + "-scope-container";
  scopeContainer.className = "scope-container";

  let scopeDivider = document.createElement("div");
  scopeDivider.className = "scope-divider threequarters";
  scopeContainer.appendChild(scopeDivider);


  let newLineContainer = document.createElement("div");
  newLineContainer.className = "line-container";

  scopeContainer.appendChild(newLineContainer);
  
  lineMaker(newLineContainer);
  lineContainer.appendChild(scopeContainer);
}



function removeEmptyLines()
{
  let lines = document.getElementsByClassName("line"); 

  for(let line of lines)
  {
    if(lineIsEmpty(line) && line.nextElementSibling != null)
    {
      line.remove();
    }
  }
}

function lineIsEmpty(line)
{
  return line.getElementsByClassName("code-block-slot").length == line.children.length;
}

export function lineMaker(lineContainer)
{
    let line = document.createElement("div");
    line.className = "line";

    let blockSlot = new CodeSlot().element;
    line.appendChild(blockSlot);

    lineContainer.appendChild(line);
}

export function drag(ev) 
{
  if(ev.target.className.includes("scope-block"))
  {

  }
  ev.dataTransfer.setData("key", ev.target.id);
}

export function varLitDrop(ev)
{
    ev.preventDefault();

    //ensure were only dropping into a varlit
    if(!(ev.target.className == "varlit" || ev.target.className == "var"))
    {
      alert("You can only drop variables and literals into this slot");
      return;
    }


    // get the stored element id
    let elementId = ev.dataTransfer.getData("key");
    let draggedBlock = document.getElementById(elementId);


    switch(draggedBlock.dataset.blockType)
    {
        case "dummy_literal":
            if(ev.target.className != "varlit")
            {
                return;
            }
            ev.target.replaceWith(new LiteralBlock(draggedBlock.dataset.subType).element);
            break;
        case "variable":
            let variableBlock = new VariableBlock(draggedBlock.dataset.subType, draggedBlock.dataset.name);
            ev.target.replaceWith(variableBlock.element);
            break;
        default:
            return;
            break;
    }
}

export function varDrop(ev)
{
  
}

function deleteDrop(ev)
{
  ev.preventDefault();

  if(ev.target.className == "code-block-slot")
  {
    return;
  }

  let elementId = ev.dataTransfer.getData("key");
  let draggedBlock = document.getElementById(elementId);

  if(draggedBlock.className.includes("dummy"))
  {
    return;
  }
  
  let dialog = document.getElementById("confirmDelete");
  let deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick = function() {doDelete(draggedBlock)};

  if(draggedBlock.className.includes("scope-block"))
  {
    //deleteButton.onclick += function() {doDelete(document.getElementById(draggedBlock.id + "-scope-container"))};
    deleteButton.addEventListener("click", function() {doDelete(document.getElementById(draggedBlock.id + "-scope-container"))});
  }
  
  dialog.showModal();
}

function doDelete(element)
{
  let trashContainer = document.getElementById("trash-container");
  trashContainer.appendChild(element);
  trashContainer.removeChild(trashContainer.children[0]);
  // if(trashContainer.children.length > 4)
  // {
  //   trashContainer.removeChild(trashContainer.children[0]);
  // }
  removeEmptyLines();
  //element.remove();
}

function makeIntoAppropriateBlock(blockType, subType, element)
{
  let block = null;

  switch(blockType)
  {
    case "assignment":
      block = new AssignmentBlock(subType, element);
      break;
    case "equality":
      block = new EqualityBlock(subType, element);
      break;
    case "function":
      block = new FunctionBlock(subType, element);
      break;
    case "expression":
      block = new ExpressionBlock(subType, element);
      break;
    case "logic":
      block = new LogicBlock(subType, element);
      break;
    case "scope":
      block = new ScopeBlock(subType, element);
      break;
    default:
      break;
  }

  return block;
}

window.allowDrop = allowDrop;
window.drop = drop;
window.drag = drag;
window.deleteDrop = deleteDrop;
window.doDelete = doDelete;