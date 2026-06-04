import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    fetch("/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) setIsValid(true);
        else setIsValid(false);
      })
      .catch(() => setIsValid(false));
  }, []);

  if (isValid === null) return <div>Loading...</div>;

  if (!isValid) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
