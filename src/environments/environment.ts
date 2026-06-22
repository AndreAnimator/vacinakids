// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtGhlzmDpUe_0Ilxske6XQ6mB7w3gm864",
  authDomain: "vacinakids-94853.firebaseapp.com",
  projectId: "vacinakids-94853",
  storageBucket: "vacinakids-94853.firebasestorage.app",
  messagingSenderId: "648347683859",
  appId: "1:648347683859:web:39cf5b7cdc098caebe83e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
