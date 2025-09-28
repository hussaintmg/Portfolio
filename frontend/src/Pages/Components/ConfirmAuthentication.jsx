// Components/TopBar.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function ConfirmAuthentication() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const { user } = useContext(AuthContext);
  const [isClose, setIsCancel] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (location.pathname.startsWith("/confirm-auth")) {
    return null;
  }
  const sendAuthenticationLink = async () => {
    try {
      if (!user?.email) {
        toast.error("No email found for user!");
        return;
      }

      const res = await axios.post(`${apiUrl}/api/auth/send-auth-link`, {
        email: user.email,
      });

      toast.success(
        res.data.message || "Authentication link sent To You Mail!"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send link");
    }
  };

  if (!user || user.authenticated || isClose) return null;

  return (
    <>
      {!user?.authenticated ? (
        <div
          style={{
            display: `${isClose ? "none" : "flex"}`,
            width: "100vw",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 1rem",
            background: "rgba(50, 106, 228, 1)",
            color: "white",
            fontWeight: "600",
            position: `${isScrolled ? "fixed" : "relative"}`,
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <span>Please authenticate yourself</span>

          <span>
            <button
              style={{
                color: "white",
                background: "rgba(40, 201, 72, 1)",
                textDecoration: "none",
                padding: "0.2cm 0.3cm",
                borderRadius: "5px",
              }}
              onClick={sendAuthenticationLink}
            >
              Send Authentication Link
            </button>
            <button
              type="button"
              style={{
                width: "30px",
                cursor: "pointer",
                background: "transparent",
                fontSize: "1.5rem",
                fontWeight: "600",
                border: "none",
              }}
              onClick={() => {
                setIsCancel(true);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </span>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
