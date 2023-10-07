const config = {
    apiKey: "AIzaSyA1fJJJ1unae0bh_Z7oB7a08h6kb8iJX4Y",

    authDomain: "fh-countdown.firebaseapp.com",

    projectId: "fh-countdown",

    storageBucket: "fh-countdown.appspot.com",

    messagingSenderId: "914140207530",

    appId: "1:914140207530:web:af1bfc3394dd96840973d3"


};

export function getFirebaseConfig() {
    if (!config || !config.apiKey) {
        throw new Error('No Firebase configuration object provided.' + '\n' +
            'Add your web app\'s configuration object to firebase-config.js');
    } else {
        return config;
    }
}
