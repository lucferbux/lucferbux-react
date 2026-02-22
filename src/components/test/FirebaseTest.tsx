import { db } from "../../firebase";

export default function FirebaseTest() {
  try {
    console.log("Firestore initialized successfully:", db);
    return <div>Firebase connection: OK</div>;
  } catch (error) {
    console.error("Firebase error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <div>Firebase connection: ERROR - {errorMessage}</div>;
  }
}
