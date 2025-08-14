import React from "react";
import { useFirestore } from "reactfire";

const FirebaseTest = () => {
  try {
    const firestore = useFirestore();
    console.log("Firestore initialized successfully:", firestore);
    return <div>Firebase connection: OK</div>;
  } catch (error) {
    console.error("Firebase error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <div>Firebase connection: ERROR - {errorMessage}</div>;
  }
};

export default FirebaseTest;
