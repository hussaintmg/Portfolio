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
import SkillsEdit from "../Components/SkillsEdit"
import ServicesEdit from "../Components/ServicesEdit"

import "./AdminSkills.scss";
import axios from "axios";

export default function Admin() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { dataLoaded } = useContext(MainDataContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const [openMenu, setOpenMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
    document.title = "Hussain Portfolio | Skills Edit";
  }, [user, navigate, apiUrl, setUser]);

  if (loading) {
    return (
      <div className="AdminPage">
        <h2 style={{ textAlign: "center", color: "white" }}>Loading...</h2>
      </div>
    );
  }

  return dataLoaded === true ? (
    <div className="AdminSkillsPage">
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
      <Topbar active={"AdminSkills"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"AdminHome"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>Skills Page Edit</AnimatedTitle>
      </h1>
      {isAdmin ? (
        <div className="main">
          <RevealSection trigger="load">
            <SkillsEdit/>
          </RevealSection>
          <RevealSection trigger="load">
            <ServicesEdit/>
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
