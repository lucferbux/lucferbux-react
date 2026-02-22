import { Navigate } from "react-router-dom";

export default function NotFoundPage() {
  return <Navigate to="/" replace />;
}
