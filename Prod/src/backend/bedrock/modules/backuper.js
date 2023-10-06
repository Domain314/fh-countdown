import { convertStringToDate, getPrettyDateString } from "../src/date";
import { queryAll, queryOne, randomNameWithDate, submitAllObjects, submitObject } from "../src/query";
import { sortByVersion } from "../src/sort";
import { deepCopy } from "../src/stringMan";
import { delOnlySyncer, delSyncer, getDBSpecificObject, getSyncerObject, setSyncerObject } from "./syncer";


// one day: 1000 * 60 * 60 * 24
const BACKUP_TIME = 1000 * 60 * 60;
export function getBackupTime() {
    return BACKUP_TIME;
}

const ALL_SYNCER = { list: [] }

export async function initBackuper() {
    ALL_SYNCER.list.length = 0
    await queryAll('syncer', ALL_SYNCER.list);

    ALL_SYNCER.list.sort(sortByVersion);
    document.getElementById('container').innerHTML = constructTableBase();
    createDatesFromName(ALL_SYNCER.list)
    fillTable(ALL_SYNCER.list);
    setTableButtonEvents(ALL_SYNCER.list);
}

function fillTable(allSyncer) {
    let table = document.getElementsByTagName('table')[0];
    allSyncer.forEach((syncer) => {
        table.innerHTML += constructTableRow(syncer)
    })
}

function constructTableRow(syncer) {
    return `<tr>${constructTableData(syncer)}</tr>`;
}

function constructTableData(syncer) {
    // const dateField = syncer.date === 'Aktiv' ? 'Aktiv' : 
    return syncer.date === 'Aktiv' ? constructTableDataActiveSyncer(syncer) : constructTableDataBackupSyncer(syncer)
}

function constructTableDataActiveSyncer(syncer) {

    return `
        <th class='syncer-amount'>Aktiv</th>
        ${constructColAmounts(getDBSpecificObject('dbs'), syncer.id)}
        <td class='syncer-amount'>${syncer.version}</td>
        <td><div class='syncer-amount' >Aktiv</div></td>
        <td><div class='syncer-amount' >Aktiv</div></td>
    `
}

function constructTableDataBackupSyncer(syncer) {
    return `
        <td class='syncer-amount'>${getPrettyDateString(syncer.date)}</th>
        ${constructAllColButtons(getDBSpecificObject('dbs'), syncer.id)}
        <td class='syncer-amount'>${syncer.version}</td>
        <td><div id='syncer-choose-${syncer.id}'class='syncer-button' >AUSWÄHLEN</div></td>
        <td><div id='syncer-delete-${syncer.id}'class='syncer-button-delete syncer-button' >Löschen</div></td>`;
}

function constructAllColButtons(cols, id) {
    let str = '';
    cols.forEach((col) => {
        str += constructColButton(col, id);
    });
    return str;
}

function constructColButton(col, id) {
    return `<td><div id='syncer-${col}-${id}' class='syncer-button' >Abrufen</div></td>`
}

function constructColAmounts(cols, id) {
    let str = '';
    cols.forEach((col) => {
        str += constructColAmount(col, id);
    })
    return str;
}

function constructColAmount(col, id) {
    return `<td><div id='syncer-${col}-${id}' class='syncer-amount' >${calcColAmount(col)}</div></td>`
}

function calcColAmount(col) {
    return getDBSpecificObject(col).list.length
}


function setTableButtonEvents(listOfSyncer) {
    listOfSyncer.forEach((syncer) => {
        if (syncer.date === 'Aktiv') return;

        getDBSpecificObject('dbs').forEach((col) => {
            const element = document.getElementById(`syncer-${col}-${syncer.id}`)
            element.onclick = async () => {
                const result = [];
                await queryOne(col, syncer[col], result);
                console.log(result);
                console.log(result[0].list.length);
                element.classList.replace('syncer-button', 'syncer-amount');
                element.innerHTML = result[0].list.length;
            }
        });

        const restoreButton = document.getElementById(`syncer-choose-${syncer.id}`);
        restoreButton.onclick = async () => {
            if (confirm("You sure?")) {
                restoreBackup(syncer)
                restoreButton.classList.replace('syncer-button', 'syncer-amount');
                restoreButton.innerHTML = 'Aktiv, bei reload';
            }
        }

        const deleteButton = document.getElementById(`syncer-delete-${syncer.id}`);
        deleteButton.onclick = async () => {
            if (confirm("You sure?")) {
                delSyncer(syncer);
                deleteButton.classList.replace('syncer-button', 'syncer-amount');
                deleteButton.innerHTML = 'Gelöscht';
            }

        }
    });

    document.getElementById(`man-backup`).onclick = async () => {
        await runBackup();
        window.location.reload();
    };
}

async function restoreBackup(syncer) {

    const oldSyncer = deepCopy(getSyncerObject());

    oldSyncer.id = randomNameWithDate();
    // console.log("delete", syncer);

    await delOnlySyncer(syncer);
    syncer.id = 'syncer-v1';
    syncer.version = parseInt(oldSyncer.version) + 1;
    syncer.nextBackup = parseInt(oldSyncer.nextBackup);

    console.log("submit", oldSyncer);
    console.log("submit", syncer);
    await submitObject(oldSyncer, 'syncer');
    await submitObject(syncer, 'syncer');

    console.log('submit', syncer);

}


function constructTableBase() {
    return `<table>
    <tr>
        <th>Date</th>
        <th>Customers</th>
        <th>Employees</th>
        <th>Photos</th>
        <th>Version</th>
        <th>Restore</th>
        <th>Delete</th>
    </tr>
</table><button id='man-backup'>Backup erstellen</button>`
}

function createDatesFromName(list) {
    list.forEach((syncer) => {
        if (syncer.id === 'syncer-v1') {
            syncer.date = 'Aktiv'
        } else {

            syncer.date = extractDateFromName(syncer.id)
        }
    });
}

function extractDateFromName(name) {
    const dateAsString = name.slice(0, 10);
    return convertStringToDate(dateAsString);

}

export async function runBackup() {
    const backups = [];
    const syncer = Object.assign({}, getSyncerObject());
    syncer.id = randomNameWithDate();
    getDBSpecificObject('dbs').forEach((db) => {
        const id = randomNameWithDate();
        syncer[db] = id;
        backups.push({
            col: db,
            id: id,
            list: getDBSpecificObject(db).list
        })
        console.log(id);

    });
    backups.push(syncer);

    const newSyncer = getSyncerObject();
    newSyncer.nextBackup = Date.now() + BACKUP_TIME;
    setSyncerObject(newSyncer)
    backups.push(newSyncer);
    await submitAllObjects(backups);
}