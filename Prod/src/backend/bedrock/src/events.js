export function setButtonEvent(name, callback, arg) {
    // console.log(name);
    // console.log(arg);
    // console.log(document.getElementById(name));
    document.getElementById(name).onclick = (e) => {
        console.log("click");

        e.stopPropagation();
        callback(arg);
    }
    // console.log(document.getElementById(name));
}

export function setInputOnChange(name, callback, arg) {
    try {
        document.getElementById(name).onchange = (e) => {
            console.log(name);
            console.log(e);
            callback(arg, e);
        }
    } catch (error) {
        console.error(error);
        console.log(document.getElementById(name));
        console.log(name);
        console.log(callback);
        console.log(arg);
    }

}