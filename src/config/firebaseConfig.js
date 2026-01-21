import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQ5cnQnL3ristHqKgLiQhMBYip_w2XkdE",
  authDomain: "casa-kriola-ce4a9.firebaseapp.com",
  projectId: "casa-kriola-ce4a9",
  storageBucket: "casa-kriola-ce4a9.appspot.com",
  messagingSenderId: "993985966692",
  appId: "1:993985966692:web:4502bf4a0375590c51e571",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
//export const storage = getStorage();
