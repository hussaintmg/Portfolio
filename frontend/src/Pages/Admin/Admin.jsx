import React, { useState, useEffect, useContext } from "react";
import Topbar from "../Components/AdminTopBar";
import SideBar from "../Components/AdminSideBar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MainDataContext } from "../../context/MainDataContext";
import AnimatedLayout from "../Components/AnimatedLayout";

import "./Admin.scss";
import axios from "axios";

export default function Admin() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const [openMenu, setOpenMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const {dataLoaded } = useContext(MainDataContext);


  useEffect(() => {
    const checkUser = async () => {
      if (user?.role) {
        setIsAdmin(user.role === "admin");
        setLoading(false);
      } else {
        try {
          const res = await axios.get(`${apiUrl}/api/auth/user`, {
            withCredentials: true,
          });
          setUser(res.data);
          setIsAdmin(res.data.role === "admin");
        } catch (err) {
          setUser(null);
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    };

    checkUser();
    document.title = "Hussain Portfolio | Admin";
  }, [user, navigate, apiUrl, setUser]);

  if (loading) {
    return (
      <div className="AdminPage">
        <h2 style={{ textAlign: "center", color: "white" }}>Loading...</h2>
      </div>
    );
  }

  return dataLoaded === true ? (
    <div className="AdminPage">
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
      <Topbar active={"Admin"} setOpenMenu={setOpenMenu} />
      <SideBar active={"Admin"} setOpenMenu={setOpenMenu} openMenu={openMenu} />

      <h1 className="heading">
        <AnimatedTitle>Admin</AnimatedTitle>
      </h1>
      {isAdmin ? (
        <div className="main">
          <h2 className="wel">Welcome , {user?.username}</h2>
          <h2 className="edit-head">Edit</h2>
          <RevealSection>
            <div className="btns">
              <button type="button" onClick={() => navigate("/admin/home")}>
                Home
              </button>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="btns">
              <button type="button" onClick={() => navigate("/admin/skills")}>
                Skills
              </button>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="btns">
              <button type="button" onClick={() => navigate("/admin/projects")}>
                Projects
              </button>
            </div>
          </RevealSection>
        </div>
      ) : (
        <p style={{ color: "red", paddingLeft: "1cm", fontSize: "1.2rem" }}>
          You are not an Admin
        </p>
      )}

      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}
