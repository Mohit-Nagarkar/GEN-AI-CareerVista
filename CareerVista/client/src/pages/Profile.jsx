import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Profile(){
  const [userDoc, setUserDoc] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return nav('/login');
      const docRef = doc(db, 'users', u.uid);
      const snap = await getDoc(docRef);
      setUserDoc(snap.exists() ? snap.data() : null);
    });
    return () => unsub();
  }, [nav]);

  if (!userDoc) return <div>Loading profile...</div>;
  return (
    <div style={{maxWidth:900, margin:'40px auto'}}>
      <h2>{userDoc.name || 'Your profile'}</h2>
      <p><strong>Email:</strong> {userDoc.email}</p>
      {userDoc.resumeUrl && <p><a href={userDoc.resumeUrl} target="_blank" rel="noreferrer">View resume</a></p>}
      <p>Next: continue onboarding → collect academic info, quizzes, skills sliders</p>
    </div>
  );
}
