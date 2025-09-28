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
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Login.scss";

export default function Login() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [remember, setRemember] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

useEffect(() => {
  console.log(user)
  if (user?.role === "admin") {
    navigate("/admin");
  } else if (user?.role === "user") {
    navigate("/");
  }
}, [user, navigate]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Login";
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        { username, password ,remember},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setUser(res.data);
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
      <Topbar active={"Login"} setOpenMenu={setOpenMenu} />
      <SideBar active={"Login"} setOpenMenu={setOpenMenu} openMenu={openMenu} />

      <h1 className="heading">
        <AnimatedTitle>Login</AnimatedTitle>
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
            <label className={username ? "active" : ""}>Username</label>
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
          <button type="button" className="submit" onClick={handleLogin}>
            Login
          </button>
        </form>
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
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </button>
        </div>
        <div className="register">
          <button type="button" onClick={() => navigate("/register")}>
            Go to Register
          </button>
        </div>
      </RevealSection>
      <Footer />
    </div>
  );
}
