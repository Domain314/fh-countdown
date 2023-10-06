// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from '../firebase-config.js';
const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

import { initBedrock } from './bedrock/bedrock.js'
import { checkUser } from './bedrock/modules/auth.js';

// With Authentication
// (() => { checkUser(initBedrock); })();

// Without Authentication
initBedrock();
