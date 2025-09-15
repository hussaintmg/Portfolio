import React from "react";
import "../SCSS/Sidebar.scss";
import { useNavigate } from "react-router-dom";

function SideBar(props) {
  const navigate = useNavigate();

  return (
    <div className={`side-over ${props.openMenu ? "show" : ""}`}>
      <div className={`side-menu ${props.openMenu ? "show" : ""}`}>
        <button
          type="button"
          className={`s-btn ${props.active === "Home" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <div></div>
        <button
          type="button"
          className={`s-btn ${props.active === "Skills" ? "active" : ""}`}
          onClick={() => navigate("/skills")}
        >
          Skills
        </button>
        <div></div>
        <button
          type="button"
          className={`s-btn ${props.active === "Projects" ? "active" : ""}`}
          onClick={() => navigate("/projects")}
        >
          My Projects
        </button>
      </div>

      <div
        className={`overlay ${props.openMenu ? "show" : ""}`}
        onClick={() => props.setOpenMenu(false)}
      ></div>
    </div>
  );
}
export default SideBar;
