import React, { useState, useEffect, useContext } from "react";
import TopBar from "../Components/AdminTopBar";
import SideBar from "../Components/AdminSideBar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";

import DropdownSection from "../Components/DropdownSection";
import NewProject from "../Components/NewProject";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MainDataContext } from "../../context/MainDataContext";
import AnimatedLayout from "../Components/AnimatedLayout";

import axios from "axios";

import "./AdminProject.scss";

export default function AdminProject() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { dataLoaded, projects } = useContext(MainDataContext);
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
    document.title = "Hussain Portfolio | Projects Edit";
  }, [user, navigate, apiUrl, setUser]);

  if (loading) {
    return (
      <div className="AdminPage">
        <h2 style={{ textAlign: "center", color: "white" }}>Loading...</h2>
      </div>
    );
  }

  return dataLoaded === true ? (
    <div className="admin-project-edit-page">
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
      <TopBar active={"AdminProjects"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"AdminProject"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>Projects Edit Page</AnimatedTitle>
      </h1>
      {isAdmin ? (
        <div className="main">
          <RevealSection trigger="load">
            {projects?.map((project) => (
              <DropdownSection key={project._id} project={project} />
            ))}
            <p
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "2rem",
                fontWeight: "700",
                display: Array.isArray(projects) && projects.length > 0 ? "none" : "block",
              }}
            >
              No Projects Available
            </p>
          </RevealSection>
          <RevealSection trigger="load">
            <NewProject />
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
