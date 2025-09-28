import React, { useState, useContext } from "react";
import "../SCSS/ImagesEdit.scss";

import { toast } from "react-toastify";
import axios from "axios";

import { MainDataContext } from "../../context/MainDataContext";

export default function ImagesEdit({ images, id }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const { fetchProjects } = useContext(MainDataContext);
  const [imageList, setImageList] = useState(images || []);

  // 🔹 Arrays for row-wise editing
  const [editIcons, setEditIcons] = useState(Array(images.length).fill(null));
  const [editIconFiles, setEditIconFiles] = useState(
    Array(images.length).fill(null)
  );

  const [newImg, setNewImg] = useState([]);
  const [newImgFile, setNewImgfile] = useState([]);

  const handleAddImages = (files) => {
    const fileArray = Array.from(files);

    // Filter out duplicates
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

  const handleFileChange = (file, index) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setEditIcons((prev) => {
      const copy = [...prev];
      copy[index] = preview;
      return copy;
    });

    setEditIconFiles((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  const handleUploadNewImages = async () => {
    if (newImgFile.length === 0)
      return toast.error("Please select images first");

    const formData = new FormData();
    formData.append("projectId", id);

    newImgFile.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/add-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Images uploaded successfully!");
      setNewImg([]);
      setNewImgfile([]);
      if (res.data?.images) {
        setImageList(res.data.images);
      }
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    }
  };

  const removeCurrentImg = async (imgIndex) => {
    try {
      await axios.delete(
        `${apiUrl}/api/projects/delete-image/${id}/${imgIndex}`
      );
      toast.success("Image deleted successfully!");
      setImageList((prev) => prev.filter((_, i) => i !== imgIndex));
      setEditIcons((prev) => prev.filter((_, i) => i !== imgIndex));
      setEditIconFiles((prev) => prev.filter((_, i) => i !== imgIndex));
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  const updateExistingImg = async (imgIndex) => {
    if (!editIconFiles[imgIndex])
      return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("projectId", id);
    formData.append("index", imgIndex);
    formData.append("image", editIconFiles[imgIndex]);

    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/update-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Image updated successfully!");
      if (res.data?.images) {
        setImageList(res.data.images);
        setEditIcons((prev) => {
          const copy = [...prev];
          copy[imgIndex] = null; // reset preview after update
          return copy;
        });
        setEditIconFiles((prev) => {
          const copy = [...prev];
          copy[imgIndex] = null;
          return copy;
        });
      }
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image");
    }
  };

  return (
    <div className="images-edit">
      <fieldset>
        <h3>Images</h3>
        <table>
          <thead>
            <tr>
              <th>Preview & Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {imageList.map((img, i) => (
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
                        document.getElementById(`img-${i}`).click()
                      }
                      className="preview-btn"
                    >
                      {editIcons[i] ? (
                        <img
                          src={editIcons[i]}
                          alt="Preview"
                          className="logo-preview"
                        />
                      ) : (
                        <img src={apiUrl + img} alt="" />
                      )}
                    </button>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      name={`img-${i}`}
                      id={`img-${i}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files[0], i)}
                    />
                    {editIcons[i] ? (
                      <button
                        className="update-btn"
                        onClick={() => {
                          updateExistingImg(i);
                        }}
                      >
                        Update
                      </button>
                    ) : null}
                  </div>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      removeCurrentImg(i);
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
        {/* Upload More Images */}
        <input
          id="add-images"
          type="file"
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
        <button
          type="button"
          className="up-img-more"
          onClick={() => {
            document.getElementById("add-images").click();
          }}
        >
          <i className="fa-solid fa-upload" style={{ color: "#000000ff" }}></i>
        </button>
        {newImg.length > 0 ? (
          <button
            type="button"
            className="upload-btn"
            onClick={() => {
              handleUploadNewImages();
            }}
          >
            Upload Images
          </button>
        ) : null}
      </fieldset>
    </div>
  );
}
