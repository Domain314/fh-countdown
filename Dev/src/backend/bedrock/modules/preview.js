import blueprint from '../configs/preview.json'
import { setButtonEvent } from '../src/events';
import { getPhotoThumbnailById } from '../src/photo';
import { sortByPosition } from '../src/sort';
import { replaceWithString } from '../src/stringMan';
import { initEditForm, initForm } from './initializer';
import { showPopup } from './popup';
import { delFromCol, editCol, getCollection } from './syncer';

var display = {};

// const messageQueue = [];
// var isQueueRunning = false;
var ALL;
var lastCol;

export function initPreview(allEntries, col) {
    lastCol = col;
    setPositions(allEntries);
    ALL = allEntries;
    createPreview(allEntries);
    setAllPreviewEvents(allEntries);
    // display = document.getElementById('status-display');
}

function createPreview(allEntries) {
    let str = `<div style='display:flex;'><h1>Previews</h1><h1 id='status-display' style=''>test..</h1></div><div class='previews-main-container'><div class='preview-main' id='add-new-entry'>Neu</div>`;
    allEntries.forEach((entry) => {
        str += constructPreview(entry);
    });
    str += `</div>`;
    document.getElementById('container').innerHTML = str;
}

function constructPreview(entry) {
    return `${replaceWithString(blueprint['preview'].start, entry.id)}
            ${constructPreviewBar(entry)}
            ${constructPreviewContent(entry)}
            ${blueprint['preview'].end}`;
}

function constructPreviewBar(entry) {
    return `${blueprint['preview-bar'].start}
            ${constructPreviewButtons(entry)}
            ${blueprint['preview-bar'].end}`;
}

function constructPreviewButtons(entry) {
    return `${replaceWithString(blueprint['buttons']['button-l'], entry.id)}
            ${replaceWithString(blueprint['buttons']['button-r'], entry.id)}
            ${replaceWithString(blueprint['buttons']['button-x'], entry.id)}`;
}

function constructPreviewContent(entry) {
    const thumbnailUrl = getPhotoThumbnailById(entry.photo);

    return `${blueprint['content'].start}
            ${replaceWithString(blueprint['content']['title'], entry.title)}
            ${replaceWithString(blueprint['content']['text'], entry.text)}
            ${replaceWithString(blueprint['content']['photo'], thumbnailUrl === undefined ? '' : thumbnailUrl)}
            ${blueprint['content'].end}`;
}

function setAllPreviewEvents(allEntries) {
    document.getElementById('add-new-entry').onclick = () => {
        initForm();
        showPopup();
    }
    allEntries.forEach((entry) => {
        setMoveLeftEvent(entry);
        setMoveRightEvent(entry);
        setEditEvent(entry);
        setDeleteEvent(entry);
    })
}



function setMoveLeftEvent(entry) {
    setButtonEvent(`preview-move-left-${entry.id}`, moveLeft, entry);
}

function setMoveRightEvent(entry) {
    setButtonEvent(`preview-move-right-${entry.id}`, moveRight, entry);
}

function setEditEvent(entry) {
    setButtonEvent(`preview-${entry.id}`, editEntry, entry);
}

function setDeleteEvent(entry) {
    setButtonEvent(`preview-delete-${entry.id}`, deleteEntry, entry);
}


function moveLeft(entry) {
    console.log("Move Left");
    if (entry.position <= 0) { alert('Cannot move left'); return; }
    const pos = entry.position;
    const temp = ALL[pos - 1];
    ALL[pos - 1] = entry;
    ALL[pos] = temp;
    setPositions(ALL);
    editCol(ALL, lastCol);
    initPreview(getCollection(lastCol), lastCol);
}

function moveRight(entry) {
    console.log("Move Right");
    if (entry.position >= ALL.length - 1) { alert('Cannot move right'); return; }
    const pos = entry.position;
    const temp = ALL[pos + 1];
    ALL[pos + 1] = entry;
    ALL[pos] = temp;
    setPositions(ALL);
    editCol(ALL, lastCol);
    initPreview(getCollection(lastCol), lastCol);
}

function editEntry(entry) {
    console.log("EDIT ENTRY");
    initEditForm(entry)
    showPopup();
}

function deleteEntry(entry) {
    console.log("DELETE ENTRY");
    delFromCol(entry, lastCol);
    initPreview(getCollection(lastCol), lastCol);
}

function setPositions(allEntries) {
    allEntries.forEach((entry, index) => {
        entry.position = index;
    })
}



// function setStatusEvents(id, status) {
//     setInputOnChange(`preview-free-${id}`, updateStatus, [id, '0']);
//     setInputOnChange(`preview-pending-${id}`, updateStatus, [id, '1']);
//     setInputOnChange(`preview-reserved-${id}`, updateStatus, [id, '2']);
//     setStatusChecked(id, status);
// }

// function updateStatus(statusArr) {
//     if (statusArr[1] != '0') {
//         document.getElementById(`preview-free-${statusArr[0]}`).checked = false;
//     }
//     if (statusArr[1] != '1') {
//         document.getElementById(`preview-pending-${statusArr[0]}`).checked = false;
//     }
//     if (statusArr[1] != '2') {
//         document.getElementById(`preview-reserved-${statusArr[0]}`).checked = false;
//     }
//     console.log(`UPDATE STATUS: ${statusArr[0]} to ${statusArr[1]}`);
// }

// function setStatusChecked(id, status) {
//     switch (status) {
//         case 0: document.getElementById(`preview-free-${id}`).checked = true; break;
//         case 1: document.getElementById(`preview-pending-${id}`).checked = true; break;
//         case 2: document.getElementById(`preview-reserved-${id}`).checked = true; break;
//         default: console.log('no status'); return;
//     }
// }

// function deleteAppointment(id) {
//     console.log(`DELETE PREVIEW: ${id}`);
//     delDoc('appointments', id);
//     document.getElementById(`preview-delete-${id}`).style.opacity = 0;
//     const appoint = getAppointment(id);
//     const date = convertStringToDate(appoint.date);
//     addToMessageQueue(`${getSmallDateString(date)} - ${appoint.timeStart} gelöscht.`);
// }

// export function addToMessageQueue(string) {
//     messageQueue.push(string);
//     startMessageQueue();
// }

// function startMessageQueue() {
//     console.log(isQueueRunning);
//     if (!isQueueRunning) {
//         isQueueRunning = true;
//         runMessageQueue()
//     };

// }


// function runMessageQueue() {
//     if (messageQueue.length == 0) return;

//     display.innerHTML = messageQueue.pop();
//     display.style.opacity = 1;
//     setTimeout(() => {
//         display.style.opacity = 0;
//         setTimeout(() => {
//             if (messageQueue.length != 0) runMessageQueue();
//             else isQueueRunning = false;
//         }, 500);
//     }, 2000);
// }

// function getAppointment(id) {
//     let app;
//     ALL.forEach(appoint => {
//         if (appoint.name == id) app = appoint;
//     })
//     if (app != undefined) return app;
// }