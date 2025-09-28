import React, { useState, useEffect, useContext } from "react";
import RevealSection from "../Components/RevealSection";

import { toast } from "react-toastify";
import axios from "axios";
import { MainDataContext } from "../../context/MainDataContext";

import "../SCSS/SkillsList.scss"
export default function SkillsIcons({ activeTab1 }) {
    const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    const [currentList, setCurrentList] = useState([])
    const [editIndex, setEditIndex] = useState(null);
    const [editHeading, setEditHeading] = useState(null);
    const [editList, setEditList] = useState(null);
    const [newHeading, setnewHeading] = useState("");
    const [newList, setnewList] = useState("");

    const { skList } = useContext(MainDataContext);
    useEffect(() => {
        if (skList) {
            setCurrentList(skList)
        }
    }, [skList])
    const fetchlist = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/skill/get-data`);
            setCurrentList(res.data.skList);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const uploadList = async () => {
        if (!newHeading || !newList) return toast.error("Please Fill All Fields")

        const formData = new FormData();
        formData.append("heading", newHeading);
        formData.append("list", newList);

        try {
            await axios.post(`${apiUrl}/api/skill/upload-sk-list`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            fetchlist()
            setnewHeading("")
            setnewList("")
            toast.success("Item uploaded successfully!");
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Failed to upload Item");
        }
    }
    const deleteIcon = async (iconPath) => {
        try {
            await axios.delete(`${apiUrl}/api/skill/delete-icon`, {
                data: { iconPath },
            });

            toast.success("Icon deleted successfully!");
            fetchlist()
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete icon");
        }
    };


    // edit
    const handleEdit = (index) => {
        setEditIndex(index);
    };

    const handleCancel = () => {
        setEditIndex(null);
    };

    const handleDone = async (index) => {
        try {
            if (!editHeading || !editList) return toast.error("Please Enter All Values to Update")
            if (editHeading === currentList[index].heading && editList === currentList[index].list) return toast.error("All values are same as previous")

            await axios.put(
                `${apiUrl}/api/skill/skList-update/${index}`,
                { heading: editHeading, list: editList },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            fetchlist()
            const updatedList = [...currentList];
            updatedList[index] = { ...updatedList[index], heading: editHeading, list: editList };
            setCurrentList(updatedList);

            setEditIndex(null);
            setEditHeading(null);
            setEditList(null);
            setEditIndex(null);
            toast.success("Updated successfully");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="icon-up-page" style={{ display: `${activeTab1 === "SkillsList" ? "block" : "none"}` }}>
            <RevealSection trigger="load">
                {currentList.length > 0 ? (<table>
                    <thead>
                        <tr>
                            <th>Heading</th>
                            <th>Additional</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentList.map((list, index) => {
                            return (<tr key={index} className={index % 2 === 0 ? "white" : "aqua"}>
                                {editIndex === index ? (<>
                                    <td >
                                        <div className="input">
                                            <input type="text" value={editHeading} onChange={(e) => {
                                                setEditHeading(e.target.value)
                                            }} placeholder={list.heading} style={{ width: "90%", margin: "0 5%", padding: "0 0.5cm", fontWeight: "700", fontSize: "1.5rem" }} className="editHeading" />
                                        </div>
                                    </td>
                                    <td >
                                        <div className="input">
                                            <textarea type="text" value={editList} onChange={(e) => {
                                                setEditList(e.target.value)
                                            }} placeholder={list.list} style={{ width: "90%", margin: "0 5%", padding: "0 0.5cm" }} className="editList" ></textarea>
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
                                    <td style={{ fontWeight: "700", fontSize: "1.5rem" }}>{list.heading}</td>
                                    <td >{list.list}</td>
                                    <td>
                                        <button type="button"
                                            className="action-btn"
                                            style={{ background: "yellow", color: "black" }}
                                            onClick={() => {
                                                handleEdit(index);
                                                setEditHeading(list.heading)
                                                setEditList(list.list)
                                            }}
                                        >Edit
                                        </button>
                                        <button type="button"
                                            className="action-btn"
                                            style={{ background: "red", color: "white" }}
                                            onClick={() => deleteIcon(list)}
                                        >Delete
                                        </button>
                                    </td></>)}
                            </tr>)
                        })}
                    </tbody>
                </table>) : (
                    <p style={{ color: "red", background: "transparent", fontSize: "2rem", fontWeight: "800", margin: "1cm 30%" }}>No Item Available</p>
                )}
                <div className="new-list">
                    <div className={`input`}>
                        <input style={{ fontWeight: "700" }} type="text" value={newHeading} onChange={(e) => {
                            setnewHeading(e.target.value)
                        }} name="heading" id="heading" placeholder="Heading" />
                        <textarea name="list" id="list" rows={3} value={newList}
                            onChange={(e) => {
                                setnewList(e.target.value)
                            }}
                            placeholder="Additional"></textarea>
                    </div>
                    <button className={`up-btn`} type="button" onClick={uploadList}>
                        Upload List
                    </button>
                </div>
            </RevealSection>
        </div>
    );
}
