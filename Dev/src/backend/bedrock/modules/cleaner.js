// import { convertStringToDateTime } from "../src/date";
// import { delDoc } from "../src/query";

// export function cleanUpAppointments(allAppoints) {
//     const today = new Date();
//     allAppoints.forEach(appoint => {
//         const date = convertStringToDateTime(appoint.date, appoint.timeStart)
//         if (date.valueOf() < today.valueOf()) {
//             console.log('delete ' + date);
//             delDoc('appointments', appoint.name);
//         }

//     });
// }

