import { Form, Input, createForm, baseElement } from './modules/form.js'
import { setButtonEvent } from "./src/events";
import { initModule } from './modules/initializer.js';
import { getDBSpecificObject, initSyncerBackend } from './modules/syncer.js';
import { capitalizeFirstLetter } from './src/stringMan.js';

import empConfig from './configs/employees.json';
import customerConfig from './configs/customers.json';
import { initBackuper } from './modules/backuper.js';

const CONFIGS = [customerConfig, empConfig]

const MODULE_CONTAINER = document.getElementById('modules');


export async function initBedrock() {
    initSyncerBackend();

    CONFIGS.forEach((config) => {
        initModuleButton(config.collection);
    });
    initModuleButton('backup');

    CONFIGS.forEach((config) => {
        console.log(config);
        setButtonEvent(config.collection, initBackendModule, config);
    });
    setButtonEvent('backup', initBackuper);
}

function initBackendModule(config) {
    console.log(config);

    initModule(getDBSpecificObject(config.collection), config);
}

function initModuleButton(id) {
    MODULE_CONTAINER.innerHTML += baseElement(capitalizeFirstLetter(id), 'div', ['module'], id);
}


// function checkURL() {
//     const hash = document.location.hash.split('=');
//     switch (hash[0]) {
//         // case '#confirm': console.log("con"); updateStatus(hash[1], { free: 2 }); break;
//         // case '#decline': console.log("dec"); updateStatus(hash[1], { free: 0, contactID: "", contactMail: "", contactPhone: "" }); break;
//         // default: console.log("def"); break;
//     }
// }
