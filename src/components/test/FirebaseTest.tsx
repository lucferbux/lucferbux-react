import { db } from "../../firebase";

export default function FirebaseTest() {
  let status: "ok" | "error" = "ok";
  let errorMessage = "";

  try {
    console.log("Firestore initialized successfully:", db);
  } catch (error) {
    console.error("Firebase error:", error);
    status = "error";
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  if (status === "error") {
    return <div>Firebase connection: ERROR - {errorMessage}</div>;
  }

  return <div>Firebase connection: OK</div>;
}
