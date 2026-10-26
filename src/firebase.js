import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

// Firebase web configuration is public client metadata; access is enforced by Auth and security rules.
const firebaseConfig = {
  apiKey: 'AIzaSyB6ROcGJfw6tVf2D8RT_ifbzqCkLVeRlJk',
  authDomain: 'new-website-50b26.firebaseapp.com',
  projectId: 'new-website-50b26',
  storageBucket: 'new-website-50b26.firebasestorage.app',
  messagingSenderId: '292149224393',
  appId: '1:292149224393:web:a8fcb5a46c83e2a322fe18',
  measurementId: 'G-XYH4XXF469',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export async function saveUserProfile(user) {
  const profileRef = doc(db, 'users', user.uid);
  const existingProfile = await getDoc(profileRef);
  const profile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    lastLoginAt: serverTimestamp(),
  };
  if (!existingProfile.exists()) profile.createdAt = serverTimestamp();
  await setDoc(profileRef, profile, { merge: true });
}

export async function saveGameResult(uid, gameId, gameTitle, result) {
  const resultRef = collection(db, 'users', uid, 'gameResults');
  await addDoc(resultRef, {
    gameId,
    gameTitle,
    score: Number(result.score) || 0,
    total: Number.isFinite(result.total) ? result.total : null,
    metric: result.metric || 'score',
    details: result.details || {},
    createdAt: serverTimestamp(),
  });
}
