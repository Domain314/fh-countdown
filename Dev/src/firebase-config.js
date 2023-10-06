const config = {
    apiKey: "AIzaSyBp1FqsTcv1l1Vp06rviJkGw50QU17GGk4",

    authDomain: "testing-ground-274.firebaseapp.com",

    projectId: "testing-ground-274",

    storageBucket: "testing-ground-274.appspot.com",

    messagingSenderId: "587702661573",

    appId: "1:587702661573:web:5deffa964ddc828e7a5bac"

};

export function getFirebaseConfig() {
    if (!config || !config.apiKey) {
        throw new Error('No Firebase configuration object provided.' + '\n' +
            'Add your web app\'s configuration object to firebase-config.js');
    } else {
        return config;
    }
}
