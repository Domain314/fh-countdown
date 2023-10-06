import {
    getFirestore,
    collection,
    query,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    doc,
    writeBatch
} from 'firebase/firestore';
import { getSmallDateString } from './date';

// FIRESTORE
export async function queryAll(col, target) {
    console.log(col, target);
    // SYNCER
    const q = query(collection(getFirestore(), col));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        target.push(doc.data());
    });
}

export async function queryOne(col, name, target) {
    const ref = doc(getFirestore(), col, '' + name);
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) target.push(docSnapshot.data());
}

export async function submitForm(inputObj, col) {
    // SYNCER
    let fileID = randomName();
    inputObj['id'] = fileID;
    inputObj['timestamp'] = serverTimestamp();

    try {
        await setDoc(doc(getFirestore(), col, '' + fileID), inputObj);
    } catch (error) {
        console.log("ERROR occured");
    }
    console.log("done");
}

export async function submitAll(inputObjs, col) {
    const batch = writeBatch(getFirestore());
    console.log(inputObjs.length);

    inputObjs.forEach(input => {
        const inputRef = doc(getFirestore(), col, '' + input.name);
        batch.set(inputRef, input);
    })

    await batch.commit();
}

export async function submitObject(inputObj, col) {
    try {
        await setDoc(doc(getFirestore(), col, '' + inputObj['id']), inputObj);
    } catch (error) {
        console.log("ERROR occured");
    }
}

export async function submitAllObjects(inputObjs) {
    const batch = writeBatch(getFirestore());

    inputObjs.forEach(input => {
        if (input.list !== undefined) {
            input.list.forEach((item, index) => {
                item.position = index;
            });
            console.log(input.list);
        }

        const inputRef = doc(getFirestore(), input.col, '' + input.id);
        batch.set(inputRef, input);
    })

    await batch.commit();
}

// generate random Name 
export function randomName() {
    return Math.random().toString(36).slice(2, 7) +
        Math.random().toString(36).slice(2, 7) +
        Math.random().toString(36).slice(2, 7);
}

// generate random suffix
export function randomNameSuffix() {
    return Math.random().toString(36).slice(2, 7) + '-' +
        Math.random().toString(36).slice(2, 7);
}

// generate random Name with date as prefix
export function randomNameWithDate() {
    const date = new Date();
    return `${getSmallDateString(date)}-${randomNameSuffix()}`;
}


export async function delDoc(col, name) {
    const docSnapshot = await deleteDoc(doc(getFirestore(), col, name));
}

export async function delFromStorage(col, name) {

}