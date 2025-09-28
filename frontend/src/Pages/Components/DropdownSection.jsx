import React, { useState, useContext } from "react";
import "../SCSS/DropdownSection.scss";

import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

import TitleEdit from "./TitleEdit";
import LinkEdit from "./LinkEdit";
import ImagesEdit from "./ImagesEdit";
import VideosEdit from "./VideosEdit";

export default function DropdownSection({ project }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const { fetchProjects } = useContext(MainDataContext);

  const [open, setOpen] = useState(false);

  const delProject = async (id) => {
    try {
      console.log("Deleting project:", id);
      await axios.delete(`${apiUrl}/api/projects/delete/${id}`);
      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      toast.error("Delete error:", err);
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="dropdown-section">
      {/* Dropdown Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`dropdown-section__header ${open ? "open" : ""}`}
      >
        <span>{project.title}</span>
        <i className="fa-solid fa-caret-down"></i>
      </button>

      {/* Dropdown Body */}
      {open && (
        <div className="dropdown-section__body">
          <div className="section">
            <TitleEdit title={project.title} id={project._id} />
          </div>
          <div className="section">
            <LinkEdit link={project.link} id={project._id} />
          </div>
          <div className="section">
            <ImagesEdit images={project.images} id={project._id} />
          </div>
          <div className="section">
            <VideosEdit videos={project.videos} id={project._id} />
          </div>
          <button
            type="button"
            className="del-project"
            onClick={() => delProject(project._id)}
          >
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
}
