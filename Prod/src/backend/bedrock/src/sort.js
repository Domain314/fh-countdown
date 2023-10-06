export function sortByPosition(b, a) {
    return b.pos < a.pos ? -1 : (b.pos > a.pos ? 1 : 0);
}

export function sortByVersion(b, a) {
    return b.version < a.version ? -1 : (b.version > a.version ? 1 : 0);
}

// export function sortByDate(b, a) {
//     if (typeof b == "string") {
//         const [ayear, amonth, aday] = a.date.split('-')
//             , [ahours, amins] = a.timeStart.split(':')
//             , [byear, bmonth, bday] = b.date.split('-')
//             , [bhours, bmins] = b.timeStart.split(':');
//         console.log(`${ayear} - ${amonth} - ${aday}   ${ahours} : ${amins}`);

//         let aD = new Date(ayear, amonth - 1, aday, ahours, amins);
//         let bD = new Date(byear, bmonth - 1, bday, bhours, bmins);
//         console.log(aD);
//         // console.log(bD);
//         return bD < aD ? -1 : (bD > aD ? 1 : 0);
//     } else {
//         return b < a ? -1 : (b > a ? 1 : 0);
//     }
// }

// export function sortByDateObj(b, a) {
//     const aa = a.date.getTime(), bb = b.date.getTime();
//     return bb < aa ? -1 : (bb > aa ? 1 : 0);
// }

// export function sortByTimeStamp(a, b) {
//     let aa = a.timestamp.seconds;
//     let bb = b.timestamp.seconds;
//     return bb < aa ? -1 : (bb > aa ? 1 : 0);
// }

// export function findByName(arr, key) {
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i].name == key) {
//             return arr[i];
//         }
//     }
//     return null;
// }