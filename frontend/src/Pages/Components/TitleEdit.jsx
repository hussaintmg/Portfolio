import React, { useState, useContext } from "react";
import "../SCSS/TitleEdit.scss"; // import SCSS file

import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

export default function TitleEdit({ title, id }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const { fetchProjects } = useContext(MainDataContext);
  const [value, setValue] = useState(title);

  const handleUpdate = async () => {
    if (!value || value === title) {
      return toast.error("Please enter a new value!");
    }

    try {
      await axios.put(
        `${apiUrl}/api/projects/up-title/${id}`,
        { title: value },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Title updated successfully!");
      fetchProjects();
    } catch (err) {
      console.error("Title update error:", err);
      toast.error("Failed to update title!");
    }
  };

  return (
    <div className="title-edit">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={title}
      />
      <button onClick={handleUpdate}>Update Title</button>
    </div>
  );
}
