export function getPrettyDateString(inputDate) {
    if (inputDate === undefined) return "";
    let dateObj = new Date(inputDate);
    return `${dateObj.getDate()}. ${convertMonthNumberToString(dateObj.getMonth())} ${dateObj.getFullYear()}`;
}

// export function getBeautifulDateString(inputDate) {
//     if (inputDate === undefined) return "";
//     let dateObj = new Date(inputDate);
//     return `${convertWeekDayToString(dateObj.getDay())}<br>${dateObj.getDate()}.${convertMonthNumberToString(dateObj.getMonth())} ${dateObj.getFullYear()}`;
// }

// export function getOkDateString(inputDate) {
//     if (inputDate === undefined) return "";
//     let dateObj = new Date(inputDate);
//     return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()} ${dateObj.getHours()}:${getMinutesWithZero(dateObj.getMinutes())}`;
// }

export function getSmallDateString(inputDate) {
    if (inputDate === undefined) return "";
    let dateObj = new Date(inputDate);
    const month = dateObj.getMonth() + 1;
    return `${dateObj.getFullYear()}-${month > 9 ? month : '0' + month}-${dateObj.getDate()}`;
}

// export function getTinyDateString(inputDate) {
//     if (inputDate === undefined) return "";
//     let dateObj = new Date(inputDate);
//     return `${dateObj.getDate()}.${dateObj.getMonth() + 1}`;
// }

// export function getIdDateString(inputDate) {
//     if (inputDate === undefined) return "";
//     let dateObj = new Date(inputDate);
//     return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
// }

// export function getDBDateString(appointmentDate) {
//     const temp = appointmentDate.split('-');
//     return `${temp[2]}-${temp[1]}-${temp[0]}`
// }

// export function getStringFromDateTimeTime(inputDate, inputTimeStart, inputTimeEnd) {
//     return `${getSmallDateString(inputDate)}<br>${inputTimeStart} - ${inputTimeEnd}min`;
// }

// export function getTimeString(inputHours, inputMinutes) {
//     return `${inputHours}:${getMinutesWithZero(inputMinutes)}`;
// }

// export function convertDateObjToString(dateObj) {
//     return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDay()}`
// }

// export function convertWeekDayToString(weekDay) {
//     switch (weekDay) {
//         case 0: return 'So';
//         case 1: return 'Mo';
//         case 2: return 'Di';
//         case 3: return 'Mi';
//         case 4: return 'Do';
//         case 5: return 'Fr';
//         case 6: return 'Sa';
//     }
// }

export function convertMonthNumberToString(month) {
    switch (month) {
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'Mär';
        case 3: return 'Apr';
        case 4: return 'Mai';
        case 5: return 'Jun';
        case 6: return 'Jul';
        case 7: return 'Aug';
        case 8: return 'Sept';
        case 9: return 'Okt';
        case 10: return 'Nov';
        case 11: return 'Dez';
        default: return 'Spooktober';
    }
}

// export function getMinutesWithZero(min) {
//     min = Math.floor(min);
//     return min < 10 ? `0${min}` : `${min}`;
// }

// export function isSameDay(a, b) {
//     return (a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear());
// }

// export function getFirstDayOfWeek(today = new Date()) {
//     console.log(today);

//     if (today.getDay() == 1) {
//         today.setHours(0, 0, 0, 0);
//         return today;
//     }

//     let newDay = new Date(today);
//     newDay.setDate(today.getDate() - today.getDay() - 2)
//     newDay.setHours(0, 0, 0, 0);
//     console.log(newDay);

//     return newDay;
// }

// export function getLastDayOfWeek(today = new Date()) {
//     let newDay = new Date(today);
//     newDay.setDate(newDay.getDate() - newDay.getDay() + 7)
//     newDay.setHours(23, 59, 59);
//     return newDay;
// }

// export function getEuropeanWeekDay(day) {
//     return day == 0 ? 6 : (day - 1);
// }

export function convertStringToDate(strDate) {
    const arr = strDate.split('-');
    return new Date(`${arr[0]}, ${arr[1]}, ${arr[2]}`);
}

// export function convertStringToDateTime(strDate, strTime) {
//     if (typeof strDate == "string") {
//         const arrDate = strDate.split('-');
//         const arrTime = strTime.split(':');
//         return new Date(arrDate[0], arrDate[1] - 1, arrDate[2], arrTime[0], arrTime[1]);
//     } else {
//         const date = new Date(strDate);
//         const arrTime = strTime.split(':');
//         date.setHours(parseInt(arrTime[0]), parseInt(arrTime[1]));
//         return date;
//     }
// }