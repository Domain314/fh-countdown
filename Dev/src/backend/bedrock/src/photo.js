import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { addToCol, getDBSpecificObject } from '../modules/syncer';
import { randomName } from './query';
import loading from '../assets/loading/infinity.gif';

const RESIZING_WAIT_TIME = 5000;

const MESSAGE_CONFIRM_RELOAD_AFTER_UPLOAD = "Uploading done";
const ERROR_MESSAGE_UPLOAD_FAILED = "There was an error uploading a file to Cloud Storage:";
const ERROR_MESSAGE_TIMEOUT = "Timeout reached. Aborting upload.";
const ERROR_MESSAGE_WRONG_FORMAT = "Please upload only images";

const uploads = [];
var countTimeOuts = 0;

export async function uploadPhoto(arg, e) {
    const inputField = document.getElementById('photo');
    countTimeOuts = 0;
    inputField.hidden = true;
    inputField.parentElement.innerHTML += `<img src=${loading} id='loadingPlaceholder' width='300px'alt='loading...' />`;
    document.getElementById('submit').disabled = true;

    const photoFile = e.target.files[0];

    try {
        let fileName = randomName();
        // let fileID = randomID();
        let filePath = `upload/${fileName}.${getImageType(photoFile.type)}`;
        let filePathThumbnail = `upload/thumbnails/${fileName}_1024x768.webp`;
        let filePathFullHD = `upload/fullHD/${fileName}_1920x1080.webp`;
        let imageRef = ref(getStorage(), filePath);
        let uploadPhoto = await uploadBytesResumable(imageRef, photoFile);
        console.log('uploaded');

        uploads.push({
            success: false,
            data: {
                id: fileName,
                thumbnailRef: ref(getStorage(), filePathThumbnail),
                fullHDRef: ref(getStorage(), filePathFullHD),
                thumbnailUrl: '',
                fullHDUrl: ''
            },
        });

        awaitThumbnailFullHDGeneration();

        return fileName;

    } catch (error) {
        console.error(ERROR_MESSAGE_UPLOAD_FAILED, error);
        return;
    }
}

export async function deletePhotoById(fileName) {
    const imageRefThumbnail = ref(getStorage(), `upload/thumbnails/${fileName}_1024x768.webp`);
    const imageRefFullHD = ref(getStorage(), `upload/fullHD/${fileName}_1920x1080.webp`);

    deleteObject(imageRefThumbnail)
    deleteObject(imageRefFullHD)

    try {
        const imageRefOriginal = ref(getStorage(), `upload/${fileName}.webp`)
        await deleteObject(imageRefOriginal)
    } catch (error) {
        try {
            const imageRefOriginal = ref(getStorage(), `upload/${fileName}.jpg`)
            await deleteObject(imageRefOriginal)
        } catch (error) {
            try {
                const imageRefOriginal = ref(getStorage(), `upload/${fileName}.jpeg`)
                await deleteObject(imageRefOriginal)
            } catch (error) {
                try {
                    const imageRefOriginal = ref(getStorage(), `upload/${fileName}.png`)
                    await deleteObject(imageRefOriginal)
                } catch (error) {
                    console.warn("Pic not found", error.message)
                }
            }
        }
    }
}


// Wait for RESIZING_WAIT_TIME, then check if uploaded photos got resized by Firebase Functions
function awaitThumbnailFullHDGeneration() {
    countTimeOuts++;
    if (countTimeOuts >= 12) { alert(ERROR_MESSAGE_TIMEOUT); return; }

    window.setTimeout(() => {
        if (!checkForFinishedGeneration()) {
            awaitThumbnailFullHDGeneration();
        }

    }, RESIZING_WAIT_TIME)
}

// Check if all uploads got URLs for resized versions.
// If not, try to get them.
function checkForFinishedGeneration() {
    if (uploads.length == 0) return false;

    let allDone = true;
    for (let i = 0; i < uploads.length; i++) {
        const data = uploads[i].data;
        if (data.thumbnailUrl == '' || data.fullHDUrl == '') {
            allDone = false;
            tryToGetURL(i);
        }
    }
    return allDone;
}

// Try to create DownloadURLs for resized photos. 
async function tryToGetURL(index) {
    try {
        let lock = 0;
        getDownloadURL(uploads[index].data.thumbnailRef).then(url => {
            uploads[index].data.thumbnailUrl = url;
            if (++lock == 2) {
                updateURLs(uploads[index].data.id, uploads[index].data.thumbnailUrl, uploads[index].data.fullHDUrl);
            }
        });
        getDownloadURL(uploads[index].data.fullHDRef).then(url => {
            uploads[index].data.fullHDUrl = url;
            if (++lock == 2) {
                updateURLs(uploads[index].data.id, uploads[index].data.thumbnailUrl, uploads[index].data.fullHDUrl);
            }
        });

    } catch (e) {
        // console.log("e");
    }
}

// Update URLs for uploaded photos
async function updateURLs(id, thumbnailUrl, fullHDUrl, repairedURL = false) {

    addToCol({
        "id": id,
        "thumbnailUrl": thumbnailUrl,
        "fullHDUrl": fullHDUrl
    }, 'photos');

    document.getElementById('loadingPlaceholder').src = fullHDUrl;
    document.getElementById('submit').disabled = false;
    const photoInputField = document.getElementById('photo');
    photoInputField.type = 'text';
    photoInputField.value = id;

    countTimeOuts = 0;
    return;

    // const docRef = doc(getFirestore(), 'photos', '' + id)

    // const updateUrls = await updateDoc(docRef, {
    //     "thumbnailUrl": thumbnailUrl,
    //     "fullHDUrl": fullHDUrl
    // }).then(() => {
    //     if (repairedURL) {
    //         reloadPage();
    //         return;
    //     }
    //     if (files.length > 0 && countUploads++ >= files.length - 1) {
    //         blendOutLoading();
    //         if (confirm(MESSAGE_CONFIRM_RELOAD_AFTER_UPLOAD)) {
    //             // reloadPage();
    //         } else {
    //             if (confirm("Gonna reload anyway :P")) { reloadPage(); }
    //         }
    //         console.log("Uploading done.");
    //     }

    // });
}

export function getPhotoArrayById() {
    return getDBSpecificObject('photos').list;
}

export function getPhotoThumbnailById(id) {
    return getPhotoObjById(id).thumbnailUrl;
}

export function getPhotoFullHDById(id) {
    return getPhotoObjById(id).fullHDUrl;
}

export function getPhotoObjById(id) {
    const photoArray = getPhotoArrayById(id);
    for (let i = 0; i < photoArray.length; i++) {
        const photo = photoArray[i];
        if (photo.id == id) {
            return photo;
        }
    }
    return '';
}

// convert HTML-image-type to string
function getImageType(type) {
    switch (type) {
        case 'image/png': return 'png'; break;
        case 'image/jpeg': return 'jpg'; break;
        case 'image/webp': return 'webp'; break;

        default: alert("wrong image type"); return 'jpg'; break;
    }
}