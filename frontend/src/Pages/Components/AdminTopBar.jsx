import React from "react";
import "../SCSS/Topbar.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MainDataContext } from "../../context/MainDataContext";
function Topbar(props) {
  const { logo } = useContext(MainDataContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  return (
    <div className="Topbar">
      <button
        type="button"
        className="hamburger"
        onClick={() => props.setOpenMenu(true)}
      >
        ≡
      </button>
      <Link to="/" className="h-btn">
        <img src={`${apiUrl}${logo}`} alt="Logo" />
      </Link>
      <div className="menu">
        <Link
         to="/admin"
          className={`btn ${props.active === "Admin" ? "active" : ""}`}
        >
          Main Page
        </Link>
        <Link
         to="/admin/home"
          className={`btn ${props.active === "AdminHome" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
         to="/admin/skills"
          className={`btn ${props.active === "AdminSkills" ? "active" : ""}`}
        >
          Skills
        </Link>
        <Link
         to="/admin/projects"
          className={`btn ${props.active === "AdminProjects" ? "active" : ""}`}
        >
          My Projects
        </Link>
      </div>
    </div>
  );
}
export default Topbar;
