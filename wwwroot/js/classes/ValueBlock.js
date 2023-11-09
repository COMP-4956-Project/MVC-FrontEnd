import { drag, allowDrop} from "../drag_drop.js";

export class DummyLiteralBlock
{

    static subTypes = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type)
    {
        if (!DummyLiteralBlock.subTypes.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        this.element = document.createElement("div");
        this.element.id = "dummy_literal" + type;
        if(document.getElementById(this.element.id) != null)
        {
            throw new Error("Duplicate id for dummy literal block, only one dummy literal block of each type is allowed");
        }
        this.element.className = "dummy lit";
        this.element.dataset.blockType = "dummy_literal";
        this.element.dataset.subType = type;

        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});

        let typeLabel = document.createElement("p");
        typeLabel.className = "type-label";
        typeLabel.innerText = type;

        this.element.appendChild(typeLabel);
    }

}

export class LiteralBlock
{
    static subTypes = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type, element = null)
    {
        if (!LiteralBlock.subTypes.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        if(element != null)
        {
            this.element = element;

            return;
        }

        this.element = document.createElement("div");
        //generate random id for the element
        this.element.id =  "literal-" + type + "-" + Math.floor(Math.random() * 1000000);

        while(document.getElementById(this.element.id) != null)
        {
            this.element.id =   "literal-" + type + "-" + Math.floor(Math.random() * 1000000);
        }

        this.element.className = "literal-block value";
        this.element.dataset.blockType = "literal";
        this.element.dataset.subType = type;
        this.element.setAttribute("draggable", "true");

        let valueInput = null;

        switch(type)
        {
            case "string":
                valueInput = this.getStringInput();
                break;
            case "number":
                valueInput = this.getNumberInput();
                break;
            case "boolean":
                valueInput = this.getBooleanInput();
                break;
            case "float":
                valueInput = this.getFloatInput();
                break;
        }

        this.element.appendChild(valueInput);
    }

    getNumberInput()
    {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "number-input";
        input.value = 0;
        input.step = "1";
        input.placeholder = "0";
        input.oninput = function() { this.value=(parseInt(this.value))}
        return input;
    }

    getBooleanInput()
    {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "boolean-input";
        return input;
    }

    getStringInput()
    {
        let input = document.createElement("input");
        input.type = "text";
        input.className = "string-input";
        return input;
    }

    getFloatInput()
    {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "float-input";
        input.step = "0.1";
        input.placeholder = "0.0";
        return input;
    }
}


export class VariableBlock
{

    constructor(type, name, value = null)
    {


        this.element = document.createElement("div");
        this.element.className += "variable-block value";
        //generate random id for the element
        this.element.id =  "variable-" + type + "-" + Math.floor(Math.random() * 1000000);

        while(document.getElementById(this.element.id) != null)
        {
            this.element.id =   "variable-" + type + "-" + Math.floor(Math.random() * 1000000);
        }

        this.element.dataset.blockType = "variable";
        this.element.dataset.name = name;
        this.element.dataset.subType = type;
        
        

        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});

        let variableName = document.createElement("p");
        variableName.className = "variable-name";
        variableName.innerText = name;

        this.element.appendChild(variableName);

        if(value != null)
        {
            let _value = document.createElement("p");
            _value.innerText = value;
            this.element.appendChild(_value);
            this.element.dataset.value = value;
            this.element.className += " dummy";
        }
        
    }
}
