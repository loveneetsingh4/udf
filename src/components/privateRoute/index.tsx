// PrivateRoute.js
import  { useEffect, useState } from "react";
import {  Navigate } from "react-router-dom";
import { auth } from "../../firebase/config"; // Import your firebase configuration
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const checkIfAdmin = async (userId: any) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() && userDoc.data().isAdmin === true;
};

const PrivateRoute = ({ element,  }: any) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log(`userriririr`,user)
      if (user) {
        const adminStatus = await checkIfAdmin(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>; // Optional: loading state

  return !isAdmin ? element : <Navigate to="/" />;
};

export default PrivateRoute;
