
const popupParent = document.getElementById('popup-parent');
const popupBackground = document.getElementById('popup-background');
const popupContainer = document.getElementById('popup-container');
popupBackground.onclick = () => { hidePopup(); };
popupContainer.onclick = () => { console.log("na") }

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hidePopup();
})

export function hidePopup() {
    popupParent.style.display = "none";
}

export function showPopup() {
    popupParent.style.display = "flex";
}

hidePopup();


// function showConfirmPopup(conAppObj) {
//     console.log(conAppObj);

//     popupContainer.innerHTML = createConfirmPopup(conAppObj);
//     showPopup()
//     setTimeout(() => {
//         setButtonEvent(`confirm-button-submit`, confirmStatusWithMail, conAppObj.contact);
//         setButtonEvent(`confirm-button-no-submit`, confirmStatusNoMail, conAppObj.contact);
//     }, 500);
// }

// function createConfirmPopup(conAppObj) {
//     return `<h3>E-Mail Bestätigung</h3>
//             <input id='confirm-subject-input' type='text' placeholder='Subject' value='LBC-Coaching Termin Bestätigung'>
//             <textarea id='confirm-text-input' name='confirm-text-input' cols='60' rows='30'>${constructEMailBody(conAppObj)}</textarea>
//             <button id='confirm-button-submit'>E-Mail senden</button>
//             <button id='confirm-button-no-submit'>Nur bestätigen, keine E-Mail senden</button>`;
// }

