import { delDoc, queryOne, randomNameWithDate, submitAllObjects, submitObject } from "../src/query";
import { getBackupTime, runBackup } from "./backuper";

import config from "../configs/syncer.json"
import { deletePhotoById } from "../src/photo";


const DBObject = new Object(config);

export function getDBObject() { return DBObject; }
export function getSyncerObject() { return DBObject.syncer; }
export function getDBSpecificObject(name) { return DBObject[name]; }

export function setSyncerObject(obj) { DBObject.syncer = obj; localStorage.setItem("syncer", JSON.stringify(obj)); }
export function setDBSpecificObject(obj, name) { DBObject[name] = obj; localStorage.setItem(name, JSON.stringify(obj)); }


export async function initSyncerBackend() {
    // console.log("INIT SYNCER");
    const newSyncer = await loadSyncerFromDB(getSyncerObject()['col'], getSyncerObject()['id']);

    // only for backend
    if (newSyncer === undefined) {
        console.log("CREATE NEW SETUP");
        await createNewSetup();
        return true;
    }

    await checkOldSyncer(newSyncer);

    // console.log("done", getDBObject());

    // console.log(getSyncerObject().nextBackup, Date.now());
    // console.log(getSyncerObject().nextBackup < Date.now());

    if (getSyncerObject().nextBackup < Date.now()) {
        // console.log("BACKUP");
        runBackup();
    }
}

export async function initSyncerFrontend() {
    // console.log("INIT SYNCER");
    const newSyncer = await loadSyncerFromDB(getSyncerObject()['col'], getSyncerObject()['id']);

    // console.log("newSyncer", newSyncer);

    // only for backend
    if (newSyncer === undefined) {
        // console.log("ERROR: No syncer");
        return false;
    }

    await checkOldSyncer(newSyncer);

    // console.log("done", getDBObject());

    // console.log(getSyncerObject().nextBackup, Date.now());
    // console.log(getSyncerObject().nextBackup < Date.now());

    // if (getSyncerObject().nextBackup < Date.now()) {
    //     console.log("BACKUP");
    //     runBackup();
    // }
}

async function checkOldSyncer(newSyncer) {
    const oldSyncer = JSON.parse(localStorage.getItem("syncer"));
    if (oldSyncer !== null) {
        // console.log("oldSyncer", oldSyncer);
        if (oldSyncer.version === newSyncer.version) {
            // console.log("SYNCER IS THE SAME");
            setSyncerObject(newSyncer);
            loadFromLocalStorage();
            return;
        }
    }
    // console.log("no old syncer");
    setSyncerObject(newSyncer);
    await loadFromDB();

}

async function loadSyncerFromDB(col, id) {
    const dbEntry = [];
    await queryOne(col, id, dbEntry);
    return dbEntry[0];
}

function loadFromLocalStorage() {
    DBObject['dbs'].forEach((db) => {
        const data = JSON.parse(localStorage.getItem(db))
        setDBSpecificObject(data, db);
    });
}

async function loadFromDB() {
    for (const db of DBObject['dbs']) {
        const temp = [];
        await queryOne(db, getSyncerObject()[db], temp);
        if (temp[0] === undefined) continue;
        localStorage.setItem(db, JSON.stringify(temp[0]));
        setDBSpecificObject(temp[0], db);
    }
}

async function createNewSetup() {
    DBObject['syncer'].nextBackup = Date.now() + getBackupTime();

    const newSetup = [
        getSyncerObject()
    ];
    DBObject['dbs'].forEach((db) => {
        const id = randomNameWithDate();
        newSetup.push({
            col: db,
            id: id,
            list: []
        })
        DBObject['syncer'][db] = id;
    });
    newSetup.forEach((db) => {
        localStorage.setItem(db.col, JSON.stringify(db));
    })

    await submitAllObjects(newSetup);
}

export async function addToCol(obj, col) {
    DBObject[col].list.push(obj);
    await updateCol(col);
}

export async function delFromCol(entry, col) {
    const entryID = entry.id !== undefined ? entry.id : entry;
    getCollection(col).forEach((item, index) => {

        if (item.id == entryID) {
            DBObject[col].list.splice(index, 1);
        }
    })
    await updateCol(col);
}

export async function editCol(newList, col) {
    DBObject[col].list = newList;
    updateCol(col)
}

export async function editUpdatedCol(entry, col) {
    DBObject[col].list.forEach((el, index) => {
        if (entry.id === el.id) {

            if (entry.photo === "") entry.photo = el.photo;
            if (entry.photo !== el.photo) deletePhoto(el.photo);

            entry.position = el.position;
            DBObject[col].list[index] = entry;

        }
    });
    await updateCol(col)
}

async function deletePhoto(id) {
    //console.log("NEW PIC INSTEAD OF OLD");
    await delFromCol(id, "photos");
    await deletePhotoById(id);

}

export async function updateCol(col) {
    // console.log(obj);

    await submitAllObjects([getDBSpecificObject(col)]);
    await updateVersion();
}

export async function updateVersion() {
    // console.log("UPDATE SYNCED VERSION");
    const newSyncer = new Object(getSyncerObject());
    newSyncer.version++;
    await submitObject(newSyncer, newSyncer.col);
    // await initSyncerBackend();
}

export function getCollection(col) {
    return getDBSpecificObject(col).list;
}

export async function delSyncer(syncer) {
    for (let i = 0; i < getDBSpecificObject('dbs').length; i++) {
        const col = getDBSpecificObject('dbs')[i];
        await delDoc(col, syncer[col]);
    }
    await delDoc('syncer', syncer.id)
}

export async function delOnlySyncer(syncer) {
    await delDoc('syncer', syncer.id)
}