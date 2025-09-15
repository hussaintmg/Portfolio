import React, { useState, useEffect } from "react";
import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ResetPassword.scss";

export default function ResetPassword() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const navigate = useNavigate();
  const { token } = useParams();

  const [openMenu, setOpenMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    axios
      .post(
        `${apiUrl}/api/auth/verify-token`,
        { token },
        { withCredentials: true }
      )
      .then((res) => {
        setTokenValid(res.isValid);
      })
      .catch(() => setTokenValid(false));
  }, [apiUrl, token]);

  useEffect(() => {
    document.title = "Hussain Portfolio | ResetPassword";
  }, []);

  const handleRP = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/reset-password`,
        { password, token },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      if (res.data.passwordChanges) {
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password Reset failed");
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
      <Topbar active={"ResetPassword"} setOpenMenu={setOpenMenu} />
      <SideBar active={"ResetPassword"} setOpenMenu={setOpenMenu} openMenu={openMenu} />
      <h1 className="heading">
        <AnimatedTitle>Reset Password</AnimatedTitle>
      </h1>
      <RevealSection trigger="load">
        {tokenValid === null ? (
          <p>Loading...</p>
        ) : tokenValid === false ? (
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            Invalid or Expired Token
          </p>
        ) : (
          <form>
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
                  <i
                    className="fa-solid fa-eye"
                    style={{ color: "#ffffff" }}
                  ></i>
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
            <button type="button" className="submit" onClick={handleRP}>
              Reset Password
            </button>
          </form>
        )}
      </RevealSection>
      <Footer />
    </div>
  );
}
