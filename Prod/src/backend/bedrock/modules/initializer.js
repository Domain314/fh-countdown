import { deepCopy } from '../src/stringMan.js';
import { createForm } from './form.js';
import { initPreview } from './preview.js';

var lastConfig;

export async function initModule(allEntries, config) {
    lastConfig = Object.assign(config);
    initPreview(allEntries.list, allEntries.col);
}

export function initForm() {
    createForm(lastConfig);
}

export function initEditForm(editableContent) {
    const config = deepCopy(lastConfig);
    config.inputs.forEach((input) => {


        input.inputValue = editableContent[input.name];
        console.log(input);
    })
    console.log(config);
    console.log(editableContent);

    createForm(config);
}


