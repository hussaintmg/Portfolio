import React, { useState, useContext } from "react";
import "../SCSS/VideosEdit.scss";

import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

export default function VideosEdit({ videos=[], id }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const { fetchProjects } = useContext(MainDataContext);

  const [videoList, setVideoList] = useState(videos || []);

  const [newVid, setNewVid] = useState([]);
  const [newVidFile, setNewVidFile] = useState([]);

  const [editVid, setEditVid] = useState([]);
  const [editVidFile, setEditVidFile] = useState([]);
  console.log(editVidFile);
  console.log(newVidFile);

  const handleAddVideos = (files) => {
    const fileArray = Array.from(files);

    // Filter out duplicates
    const filteredFiles = fileArray.filter(
      (file) =>
        !newVidFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));

    setNewVidFile((prev) => [...prev, ...filteredFiles]);
    setNewVid((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewVideo = (index) => {
    setNewVid((prev) => prev.filter((_, i) => i !== index));
    setNewVidFile((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUploadNewVideos = async () => {
    if (newVidFile.length === 0)
      return toast.error("Please select images first");

    const formData = new FormData();
    formData.append("projectId", id);

    newVidFile.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/add-videos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Videos uploaded successfully!");
      setNewVid([]);
      setNewVidFile([]);
      if (res.data?.videos) {
        setVideoList(res.data.videos);
      }
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload videos");
    }
  };

  const removeCurrentVideo = async (vidIndex) => {
    try {
      await axios.delete(
        `${apiUrl}/api/projects/delete-video/${id}/${vidIndex}`
      );
      toast.success("Video deleted successfully!");
      setVideoList((prev) => prev.filter((_, i) => i !== vidIndex));
      setEditVid((prev) => prev.filter((_, i) => i !== vidIndex));
      setEditVidFile((prev) => prev.filter((_, i) => i !== vidIndex));
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Video");
    }
  };

  const updateExistingVideo = async (vidIndex) => {
    if (!editVidFile[vidIndex])
      return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("projectId", id);
    formData.append("index", vidIndex);
    formData.append("video", editVidFile[vidIndex]);

    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/update-video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Video updated successfully!");
      if (res.data?.videos) {
        setVideoList(res.data.videos);
        setEditVid((prev) => {
          const copy = [...prev];
          copy[vidIndex] = null;
          return copy;
        });
        setEditVidFile((prev) => {
          const copy = [...prev];
          copy[vidIndex] = null;
          return copy;
        });
      }
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Video");
    }
  };
  return (
    <div className="videos-edit">
      <fieldset>
        <h3>Videos</h3>
        <table>
          <thead>
            <tr>
              <th>Preview & Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {videoList.map((vid, i) => (
              <tr
                key={i}
                style={{
                  background: `${
                    i % 2 === 0 ? "white" : "rgba(232, 232, 232, 1)"
                  }`,
                }}
              >
                <td>
                  <div className="preview-cell">
                    <button
                      onClick={() =>
                        document.getElementById(`vid-${i}`).click()
                      }
                      className="preview-btn"
                    >
                      {editVid[i] ? (
                        <video src={editVid[i]} className="video-preview" />
                      ) : (
                        <video src={apiUrl + vid} className="video-preview" />
                      )}
                    </button>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      name={`vid-${i}`}
                      id={`vid-${i}`}
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditVid((prev) => {
                            const copy = [...prev];
                            copy[i] = URL.createObjectURL(file);
                            return copy;
                          });
                          setEditVidFile((prev) => {
                            const copy = [...prev];
                            copy[i] = file;
                            return copy;
                          });
                        }
                      }}
                    />
                    {editVid[i] && (
                      <button
                        className="update-btn"
                        onClick={() => {
                          updateExistingVideo(i);
                        }}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      removeCurrentVideo(i);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr
          style={{
            margin: "0.5cm 0",
            color: "rgba(104, 101, 101, 1)",
            height: "2px",
            background: "rgba(104, 101, 101, 1)",
          }}
        />

        {/* Upload More Videos */}
        <input
          id="add-videos"
          type="file"
          multiple
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => handleAddVideos(e.target.files)}
        />

        {/* New Uploaded Videos Preview */}
        <div className="new-videos-grid">
          {newVid.map((vid, index) => (
            <div className="new-vid" key={index}>
              <video src={vid} />
              <button
                className="remove-btn"
                onClick={() => handleRemoveNewVideo(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="up-vid-more"
          onClick={() => {
            document.getElementById("add-videos").click();
          }}
        >
          <i className="fa-solid fa-upload" style={{ color: "#000000ff" }}></i>
        </button>

        {newVid.length > 0 && (
          <button
            type="button"
            className="upload-btn"
            onClick={() => {
              handleUploadNewVideos();
            }}
          >
            Upload Videos
          </button>
        )}
      </fieldset>
    </div>
  );
}
