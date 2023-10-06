import { randomName, submitForm } from "../src/query";
import { setButtonEvent, setInputOnChange } from "../src/events";
import { addToMessageQueue, initPreview } from "./preview";
import { addToCol, editUpdatedCol, getCollection, initSyncerBackend } from "./syncer";
import { hidePopup } from "./popup";
import { uploadPhoto } from "../src/photo";

export class Form {
    constructor(name) {
        this.name = name;
        this.inputs = [];
    }

    addInput(input) {
        this.inputs.push(input);
    }
}

export class Input {
    constructor(name, labelContent = '', labelClasses = [], inputClasses = [], inputId = '', inputType = 'text', inputPlaceholder = '', inputValue = '') {
        this.name = name;
        this.labelContent = labelContent;
        this.labelClasses = labelClasses;
        this.inputClasses = inputClasses;
        this.inputId = inputId;
        this.inputType = inputType;
        this.inputPlaceholder = inputPlaceholder;
        this.inputValue = inputValue;
    }
}

export function createForm(form) {
    let container = document.getElementById('popup-container');
    container.innerHTML = form.htmlBefore;
    form.inputs.forEach((input) => {
        container.innerHTML += baseElement(createInput(input, '<br>', true), 'div', ['div-class1', 'div-class2'], 'div-id');
    });
    container.innerHTML += form.htmlAfter;
    setTimeout(() => {
        setButtonEvent('submit', submitInput, form);
        setInputOnChange('photo', uploadPhoto, form);
    }, 500);
}

async function submitInput(form) {
    hidePopup();
    if (form.inputs[form.inputs.length - 1].inputValue !== undefined) {
        await editUpdatedCol(constructDBObj(form.inputs), form.collection);
    } else {
        await addToCol(constructDBObj(form.inputs), form.collection);
    }

    await initSyncerBackend();
    initPreview(getCollection(form.collection), form.collection);
}

function constructDBObj(inputs) {
    const dbObj = {};
    inputs.forEach((input) => {
        dbObj[input.inputId] = extractInput(input.inputId);
    })

    dbObj['id'] = dbObj['id'] == 'undefined' ? randomName() : dbObj['id'];
    // addToMessageQueue(`${getSmallDateString(dbObj.date)} - ${dbObj.timeStart} hinzugefügt.`);
    return dbObj;
}

function extractInput(id) {
    let val = document.getElementById(id).value;
    document.getElementById(id).value = '';
    return val;
}

function createInput(input, seperatorContent, isLabelFirst) {
    if (input.inputType === 'hidden') return `${baseInput(input)}`
    return isLabelFirst ? `${baseLabel(input)}${seperatorContent}${baseInput(input)}` : `${baseInput(input)}${seperatorContent}${baseLabel(input)}`;
}

function baseInput(input) {
    let inputClassStr = constructStringFromArray(input.inputClasses);
    if (input.inputType === 'textarea') {
        return `<textarea id='${input.inputId}' name='${input.name}' class='${inputClassStr}' placeholder='${input.inputPlaceholder}' >${input.inputValue}</textarea>`;
    } else {
        return `<input type='${input.inputType}' id='${input.inputId}' name='${input.name}' class='${inputClassStr}' placeholder='${input.inputPlaceholder}' value='${input.inputValue}'>`;
    }
}

function baseLabel(input) {
    let labelClassStr = constructStringFromArray(input.labelClasses);
    return `<label for='${input.name}' class='${labelClassStr}'>${input.labelContent}</label>`;
}

export function baseElement(content, tag, classes, id) {
    let classStr = constructStringFromArray(classes);
    return `<${tag} class='${constructStringFromArray(classStr)}' id='${id}'>${content}</${tag}>`;
}

function constructStringFromArray(arr) {
    let str = '';
    // console.log(arr);
    if (typeof arr === 'string') return arr;
    arr.forEach(el => {
        str += el + ' ';
    });
    return str;
}


