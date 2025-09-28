import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../SCSS/SocialMediaAdmin.scss";
import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

export default function SocialMediaAdmin({ activeTab1 }) {
  const { socials: savedSocials } = useContext(MainDataContext);

  const [socials, setSocials] = useState([]);
  const [newData, setNewData] = useState({
    title: "",
    link: "",
    icon: null,
    colour: "",
    shape: "",
  });
  const [newPreview, setNewPreview] = useState(null);

  const [editIndex, setEditIndex] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editRow, setEditRow] = useState({});

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  useEffect(() => {
    if (savedSocials) {
      setSocials(savedSocials);
    }
  }, [savedSocials, setSocials]);

  const handleUpload = async () => {
    console.log(newData);
    if (
      !newData.title ||
      !newData.link ||
      !newData.icon ||
      !newData.colour ||
      !newData.shape
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      const formData = new FormData();
      formData.append("title", newData.title);
      formData.append("link", newData.link);
      formData.append("icon", newData.icon);
      formData.append("colour", newData.colour);
      formData.append("shape", newData.shape);

      const res = await axios.post(
        `${apiUrl}/api/home/social-upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSocials(res.data.socials);
      setNewData({ title: "", link: "", icon: null, colour: "", shape: "" });
      setNewPreview(null);
      toast.success("Uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  //   delete
  const handleDelete = async (index) => {
    try {
      const res = await axios.delete(
        `${apiUrl}/api/home/social-delete/${index}`
      );
      setSocials(res.data.socials);
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditRow(socials[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditRow({});
    setEditPreview(null)
  };

  const handleDone = async (index) => {
    try {
      const formData = new FormData();
      formData.append("title", editRow.title);
      formData.append("link", editRow.link);
      if (editRow.icon instanceof File) {
        formData.append("icon", editRow.icon);
      }
      formData.append("colour", editRow.colour);
      formData.append("shape", editRow.shape);

      const res = await axios.put(
        `${apiUrl}/api/home/social-update/${index}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSocials(res.data.socials);
      setEditIndex(null);
      setEditPreview(null);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div
      className="SM-page"
      style={{ display: `${activeTab1 === "SM" ? "block" : "none"}` }}
    >
      <RevealSection trigger="scroll">
        {socials.length === 0 ? (
          <p style={{ color: "red", fontSize: "1.5rem", textAlign: "center" }}>
            No data available
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Link</th>
                <th>Icon</th>
                <th>Colour</th>
                <th>Shape</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {socials.map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "row-white" : "row-blue"}`}
                >
                  {editIndex === index ? (
                    <>
                      <td style={{ background: "yellow" }}>
                        <input
                          type="text"
                          value={editRow.title}
                          placeholder={item.title}
                          onChange={(e) =>
                            setEditRow({ ...editRow, title: e.target.value })
                          }
                          className="border p-1"
                        />
                      </td>
                      <td style={{ background: "yellow" }}>
                        <input
                          type="text"
                          value={editRow.link}
                          placeholder={item.link}
                          onChange={(e) =>
                            setEditRow({ ...editRow, link: e.target.value })
                          }
                          className="border p-1"
                        />
                      </td>
                      <td style={{ background: "yellow" }}>
                        <div className="input">
                          <input
                            type="file"
                            id={`editIcon-${index}`}
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setEditPreview(URL.createObjectURL(file));
                                setEditRow({ ...editRow, icon: file });
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById(`editIcon-${index}`).click();
                            }}
                          >
                            {editPreview ? (
                              <img
                                src={editPreview}
                                alt="Logo Preview"
                                className="logo-preview"
                                width="70px"
                                height="70px"
                              />
                            ) : (
                              <img
                                src={apiUrl + item.icon}
                                alt="Logo Preview"
                                className="logo-preview"
                                width="70px"
                                height="70px"
                              />
                            )}
                          </button>
                        </div>
                      </td>
                      <td style={{ background: "yellow" }}>
                        <input
                          type="text"
                          value={editRow.colour}
                          placeholder={item.colour}
                          onChange={(e) =>
                            setEditRow({ ...editRow, colour: e.target.value })
                          }
                          className="border p-1"
                        />
                      </td>
                      <td style={{ background: "yellow" }}>
                        <input
                          type="text"
                          value={editRow.shape}
                          placeholder={item.shape}
                          onChange={(e) =>
                            setEditRow({ ...editRow, shape: e.target.value })
                          }
                          className="border p-1"
                        />
                      </td>
                      <td style={{ background: "yellow" }}>
                        <button
                          onClick={() => handleDone(index)}
                          style={{
                            padding: "0.2cm 0.7cm",
                            cursor: "pointer",
                            margin: "0.2cm 0.45cm",
                            fontSize: "1.3rem",
                            color: "white",
                            background: "rgba(14, 117, 19, 1)",
                            fontWeight: "700",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          Done
                        </button>
                        <button
                          onClick={handleCancel}
                          style={{
                            padding: "0.2cm 0.7cm",
                            cursor: "pointer",
                            margin: "0.2cm 0.45cm",
                            fontSize: "1.3rem",
                            color: "white",
                            background: "orange",
                            fontWeight: "700",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.title}</td>
                      <td>{item.link}</td>
                      <td>
                        <img
                          src={apiUrl + item.icon}
                          alt="icon"
                          width="70px"
                          height="70px"
                          style={{ objectFit: "contain" }}
                        />
                      </td>
                      <td
                        style={{ background: item.colour, fontWeight: "700" }}
                      >
                        {item.colour}
                      </td>
                      <td>{item.shape}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(index)}
                          style={{
                            padding: "0.2cm 0.7cm",
                            cursor: "pointer",
                            margin: "0.2cm 0.45cm",
                            fontSize: "1.3rem",
                            color: "black",
                            background: "yellow",
                            fontWeight: "700",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          style={{
                            padding: "0.2cm 0.7cm",
                            cursor: "pointer",
                            margin: "0.2cm 0.45cm",
                            fontSize: "1.3rem",
                            color: "white",
                            background: "red",
                            fontWeight: "700",
                            border: "none",
                            borderRadius: "7px",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* New Data Inputs */}
        <div className="New-data-entry">
          <input
            type="text"
            placeholder="Title"
            id="Title"
            value={newData.title}
            onChange={(e) => setNewData({ ...newData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Link"
            id="Link"
            value={newData.link}
            onChange={(e) => setNewData({ ...newData, link: e.target.value })}
          />
          <div className="input" style={{ justifyContent: "start" }}>
            <h2
              style={{
                margin: "0.2cm 0.5cm",
                color: "white",
                fontWeight: "800",
              }}
            >
              Icon
            </h2>
            <input
              type="file"
              id="newIconInput"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewPreview(URL.createObjectURL(file));
                  setNewData({ ...newData, icon: file });
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                document.getElementById("newIconInput").click();
              }}
            >
              {newPreview ? (
                <img
                  src={newPreview}
                  alt="Logo Preview"
                  width="100px"
                  height="100px"
                />
              ) : (
                <i
                  className="fa-solid fa-upload"
                  style={{ color: "#000000ff" }}
                ></i>
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Colour"
            id="Colour"
            value={newData.colour}
            onChange={(e) => setNewData({ ...newData, colour: e.target.value })}
          />
          <input
            type="text"
            placeholder="Shape"
            id="Shape"
            value={newData.shape}
            onChange={(e) => setNewData({ ...newData, shape: e.target.value })}
          />
        </div>
        <button className="New-data-btn" onClick={handleUpload}>
          Upload Item
        </button>
      </RevealSection>
    </div>
  );
}
