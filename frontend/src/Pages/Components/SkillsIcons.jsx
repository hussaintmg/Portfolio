import React, { useState, useEffect, useContext } from "react";
import RevealSection from "../Components/RevealSection";

import { toast } from "react-toastify";
import axios from "axios";
import { MainDataContext } from "../../context/MainDataContext";

import "../SCSS/SkillsIcons.scss"
export default function SkillsIcons({ activeTab1 }) {
    const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedIconFile, setSelectedIconFile] = useState(null);
    const [currentIcons, setCurrentIcons] = useState([])
    const [editIndex, setEditIndex] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [editRow, setEditRow] = useState({});

    const { skIcons: icons } = useContext(MainDataContext);
    useEffect(() => {
        if (icons) {
            setCurrentIcons(icons)
        }
    }, [icons, setCurrentIcons])
    const fetchIcons = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/skill/get-data`);
            setCurrentIcons(res.data.icons);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const uploadIcon = async () => {
        if (!selectedIconFile) return toast.error("Please select an icon first!")

        const formData = new FormData();
        formData.append("icon", selectedIconFile);

        try {
            await axios.post(`${apiUrl}/api/skill/upload-icon`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchIcons()
            setSelectedIcon(null);
            setSelectedIconFile(null)
            toast.success("Icon uploaded successfully!");
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Failed to upload icon");
        }
    }

    const deleteIcon = async (iconPath) => {
        try {
            await axios.delete(`${apiUrl}/api/skill/delete-icon`, {
                data: { iconPath },
            });

            toast.success("Icon deleted successfully!");
            fetchIcons()
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete icon");
        }
    };


    // edit
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditRow(currentIcons[index]);
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditRow({});
        setEditPreview(null);
    };

    const handleDone = async (index) => {
        try {
            const formData = new FormData();
            if (editRow.icon instanceof File) {
                formData.append("icon", editRow.icon);
            }

            const res = await axios.put(
                `${apiUrl}/api/skill/skIcon-update/${index}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(res.data.icons)
            fetchIcons()
            setEditIndex(null);
            setEditPreview(null);
            toast.success("Updated successfully");
        } catch (err) {
            toast.error("Update failed");
        }
    };
    return (
        <div className="icon-up-page" style={{ display: `${activeTab1 === "SkillsIcon" ? "block" : "none"}` }}>
            <RevealSection trigger="load">
                {currentIcons.length > 0 ? (<table>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIcons.map((icon, index) => {
                            return (<tr key={index} className={index % 2 === 0 ? "white" : "aqua"}>
                                {editIndex === index ? (<>
                                    <td >
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
                                                        src={apiUrl + icon}
                                                        alt="Logo Preview"
                                                        className="logo-preview"
                                                        width="70px"
                                                        height="70px"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDone(index)}
                                            className="action-btn"
                                            style={{
                                                color: "white",
                                                background: "rgba(14, 117, 19, 1)",
                                            }}
                                        >
                                            Done
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="action-btn"
                                            style={{
                                                color: "white",
                                                background: "orange",
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </>) : (<>
                                    <td><img src={apiUrl + icon} alt="" /></td>
                                    <td>
                                        <button type="button"
                                            className="action-btn"
                                            style={{ background: "yellow", color: "black" }}
                                            onClick={() => handleEdit(index)}
                                        >Edit
                                        </button>
                                        <button type="button"
                                            className="action-btn"
                                            style={{ background: "red", color: "white" }}
                                            onClick={() => deleteIcon(icon)}
                                        >Delete
                                        </button>
                                    </td></>)}
                            </tr>)
                        })}
                    </tbody>
                </table>) : (
                    <p style={{ color: "red", background: "transparent", fontSize: "2rem", fontWeight: "800", margin: "1cm 30%" }}>No Icon Available</p>
                )}
                <div className="new-icon">
                    <div className={`input`}><input type="file" name="sk-icon" id="sk-icon" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setSelectedIcon(URL.createObjectURL(file));
                            setSelectedIconFile(file);
                        }
                    }} />
                        <button
                            type="button"
                            onClick={() => {
                                document.getElementById("sk-icon").click();
                            }}
                        >
                            {selectedIcon ? (
                                <img
                                    src={selectedIcon}
                                    alt="Icon Preview"
                                    className="Icon-preview"
                                />
                            ) : (
                                <i
                                    className="fa-solid fa-upload"
                                    style={{ color: "#000000ff" }}
                                ></i>
                            )}
                        </button></div>
                    <div className={`up-btn`}><button type="button" onClick={uploadIcon}>
                        Upload Icon
                    </button></div>
                </div>
            </RevealSection>
        </div>
    );
}
