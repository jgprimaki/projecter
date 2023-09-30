import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-FUYspBoYZirjX4OTRxMtBvcoV5liIfw',
  authDomain: 'portfolio-todo-5def5.firebaseapp.com',
  projectId: 'portfolio-todo-5def5',
  storageBucket: 'portfolio-todo-5def5.appspot.com',
  messagingSenderId: '562101135291',
  appId: '1:562101135291:web:2aaeb0d5b374219166069e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
