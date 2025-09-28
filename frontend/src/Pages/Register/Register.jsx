import React, { useState, useEffect } from "react";
import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import "./Register.scss";

export default function Register() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [remember, setRemember] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "user") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Register";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (cPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (password === cPassword || password.slice(6) === cPassword) {
        const res = await axios.post(
          `${apiUrl}/api/auth/register`,
          { username, email, password, remember },
          { withCredentials: true }
        );
        toast.success(res.data.message);
        setUser(res.data);
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Passwords do not match");
      }
    } catch (err) {
      console.log("Page" + err);
      toast.error(err.response?.data?.message || "Registeration failed");
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
      <Topbar active={"Register"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"Register"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>Register</AnimatedTitle>
      </h1>
      <RevealSection trigger="load">
        <form action="register" method="post">
          <div className="input">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              autoFocus={true}
              required={true}
            />
            <label className={username ? "active" : ""}>Username</label>
          </div>
          <div className="input">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <label className={username ? "active" : ""}>Email</label>
          </div>
          <div className="input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordBtn(true)}
              onBlur={() => setShowPasswordBtn(false)}
              required={true}
            />
            <label className={password ? "active" : ""}>Password</label>

            <button
              type="button"
              className="show-password"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              style={{ visibility: showPasswordBtn ? "visible" : "hidden" }}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye" style={{ color: "#ffffff" }}></i>
              ) : (
                <i
                  className="fa-solid fa-eye-slash"
                  style={{ color: "#ffffff" }}
                ></i>
              )}
            </button>
          </div>
          <div className="input">
            <input
              type={showPassword ? "text" : "password"}
              name="confirm-password"
              id="confirm-password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              required={true}
            />
            <label className={cPassword ? "active" : ""}>
              Confirm Password
            </label>
          </div>
          <div
            style={{
              color: "white",
              fontSize: "1.2rem",
              textAlign: "left",
              left: "23%",
              position: "absolute",
            }}
          >
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              style={{ marginRight: "2mm" }}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button type="button" className="submit" onClick={handleRegister}>
            Register
          </button>
        </form>
        <div className="login">
          <button type="button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </RevealSection>
      <Footer />
    </div>
  );
}
