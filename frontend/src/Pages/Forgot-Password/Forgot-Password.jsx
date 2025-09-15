import React, { useState, useEffect } from "react";
import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Forgot-Password.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ForgotPassword() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [stateAsU, setStateAsU] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "user") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Forgot Password";
  }, []);
  const handleFP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        { username, stateAsU },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed To Send Link");
    }
  };
  return (
    <div className="log-page">
      <Particles
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
      />
      <Topbar active={"ForgotPassword"} setOpenMenu={setOpenMenu} />
      <SideBar active={"ForgotPassword"} setOpenMenu={setOpenMenu} openMenu={openMenu} />

      <h1 className="heading">
        <AnimatedTitle>Forgot Password</AnimatedTitle>
      </h1>
      <RevealSection trigger="load">
        <form action="login" method="post">
          <div className="input">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={true}
              autoComplete="off"
              autoFocus={true}
            />
            <label className={username ? "active" : ""}>
              {stateAsU ? "Username" : "Email"}
            </label>
          </div>
          <div
            style={{
              textAlign: "left",
              left: "23%",
              position: "absolute",
            }}
          >
            <button
              type="button"
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgb(52, 128, 235)",
                background: "transparent",
                color: "rgb(52, 128, 235)",
                fontSize: "1.2rem",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/forgot-password");
                setStateAsU(!stateAsU);
              }}
            >
              {stateAsU ? "Forgot Username" : "Continue with Username"}
            </button>
          </div>
          <button type="button" className="submit" onClick={handleFP}>
            Submit
          </button>
        </form>
        <div className="login">
          <button type="button" onClick={() => navigate("/login")}>
            Back
          </button>
        </div>
      </RevealSection>
      <Footer />
    </div>
  );
}
