import React, { useState, useContext } from "react";
import "../SCSS/TitleEdit.scss"; // import SCSS file

import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

export default function LinkEdit({ link, id }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const { fetchProjects } = useContext(MainDataContext);
  const [value, setValue] = useState(link);

  const handleUpdate = async () => {
    if (!value || value === link) {
      return toast.error("Please enter a new value!");
    }

    try {
      await axios.put(
        `${apiUrl}/api/projects/up-link/${id}`,
        { link: value },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Link updated successfully!");
      fetchProjects();
    } catch (err) {
      console.error("Link update error:", err);
      toast.error("Failed to update link!");
    }
  };

  return (
    <div className="link-edit title-edit">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={link}
      />
      <button onClick={handleUpdate}>Update Link</button>
    </div>
  );
}
