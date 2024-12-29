import { auth } from "./config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const checkIfAdmin = async (userId:any) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() && userDoc.data().isAdmin === true;
};

export default checkIfAdmin;
