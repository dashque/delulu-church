import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDZp0d25aINoQAus8mXftPE9O2UErtrJxA',
  authDomain: 'ng-kitty-debug-right.firebaseapp.com',
  projectId: 'ng-kitty-debug-right',
  storageBucket: 'ng-kitty-debug-right.firebasestorage.app',
  messagingSenderId: '398137744473',
  appId: '1:398137744473:web:61280ed4015908ff0da548',
  measurementId: 'G-50CXHH10P1',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
