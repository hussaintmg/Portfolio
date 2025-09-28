import React, { useState, useContext } from "react";
import "../SCSS/NewProject.scss";
import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

export default function NewProject() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const { fetchProjects } = useContext(MainDataContext);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const [newImg, setNewImg] = useState([]);
  const [newImgFile, setNewImgfile] = useState([]);

  const [newVideo, setNewVideo] = useState([]);
  const [newVideoFile, setNewVideoFile] = useState([]);

  // ------------------ IMAGE HANDLERS ------------------
  const handleAddImages = (files) => {
    const fileArray = Array.from(files);

    const filteredFiles = fileArray.filter(
      (file) =>
        !newImgFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));

    setNewImgfile((prev) => [...prev, ...filteredFiles]);
    setNewImg((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImg((prev) => prev.filter((_, i) => i !== index));
    setNewImgfile((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------ VIDEO HANDLERS ------------------
  const handleAddVideos = (files) => {
    const fileArray = Array.from(files);

    const filteredFiles = fileArray.filter(
      (file) =>
        !newVideoFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));

    setNewVideoFile((prev) => [...prev, ...filteredFiles]);
    setNewVideo((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewVideo = (index) => {
    setNewVideo((prev) => prev.filter((_, i) => i !== index));
    setNewVideoFile((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------ UPLOAD PROJECT ------------------
  const uploadProject = async () => {
    if (!title) return toast.error("Please Enter Some Title!");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);

      newImgFile.forEach((file) => {
        formData.append("images[]", file);
      });

      newVideoFile.forEach((file) => {
        formData.append("videos[]", file);
      });

      if (newImgFile.length === 0) {
        formData.append("images[]", "");
      }
      if (newVideoFile.length === 0) {
        formData.append("videos[]", "");
      }

      const res = await axios.post(
        `${apiUrl}/api/projects/upload-new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);

      toast.success("Project uploaded successfully!");

      setTitle("");
      setNewImg([]);
      setNewImgfile([]);
      setNewVideo([]);
      setNewVideoFile([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Error uploading project!");
    }
  };

  return (
    <div className="new-project">
      <h2>Upload New</h2>
      <input
        type="text"
        name="title"
        required
        id="title"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        name="link"
        required
        id="link"
        placeholder="link"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
        }}
      />

      {/* ---------- IMAGES ---------- */}
      <fieldset>
        <legend>Images</legend>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleAddImages(e.target.files)}
        />
        <div className="new-images-container">
          {newImg.map((img, index) => (
            <div className="new-img" key={index}>
              <img src={img} alt={`new-${index}`} />
              <button
                className="remove-btn"
                onClick={() => handleRemoveNewImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="actions-btn">
          <button
            type="button"
            className="sel-img-btn"
            onClick={() => document.getElementById("images").click()}
          >
            <i
              className="fa-solid fa-upload"
              style={{ color: "#000000ff" }}
            ></i>
          </button>
        </div>
      </fieldset>

      {/* ---------- VIDEOS ---------- */}
      <fieldset>
        <legend>Videos</legend>
        <input
          type="file"
          name="videos"
          id="videos"
          multiple
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => handleAddVideos(e.target.files)}
        />
        <div className="new-videos-container">
          {newVideo.map((video, index) => (
            <div className="new-video" key={index}>
              <video src={video} width="150" />
              <button
                className="remove-btn"
                onClick={() => handleRemoveNewVideo(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="actions-btn">
          <button
            type="button"
            className="sel-img-btn"
            onClick={() => document.getElementById("videos").click()}
          >
            <i
              className="fa-solid fa-upload"
              style={{ color: "#000000ff" }}
            ></i>
          </button>
        </div>
      </fieldset>

      {/* ---------- UPLOAD BUTTON ---------- */}
      {title !== "" && link!==""&&(
        <button type="button" className="up-project" onClick={uploadProject}>
          Upload Project
        </button>
      )}
    </div>
  );
}
