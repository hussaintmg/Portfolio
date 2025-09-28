// Pages/ConfirmAuthPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmAuthPage() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const { token } = useParams();
  const [status, setStatus] = useState("waiting"); // waiting | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setStatus("success");
        const res = await axios.get(`${apiUrl}/api/auth/confirm-auth/${token}`);
        console.log(res.data);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    verifyToken();
  }, [token, navigate, apiUrl]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4ff",
        flexDirection: "column",
      }}
    >
      {status === "waiting" && (
        <>
          <div className="spinner"></div>
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            Waiting for confirmation...
          </p>
        </>
      )}
      {status === "success" && (
        <p style={{ color: "green", fontSize: "1.5rem" }}>
          ✅ Authentication Successful! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "red", fontSize: "1.5rem" }}>
          ❌ Invalid or Expired Token!
        </p>
      )}

      {/* spinner style */}
      <style>
        {`
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #ccc;
            border-top: 5px solid #326ae4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
