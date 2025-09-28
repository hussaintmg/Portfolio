import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function MailEditI({ activeTab3 }) {
  const { EmailIcon } = useContext(MainDataContext);
  const [selectedEmailIcon, setSelectedEmailIcon] = useState(null);
  const [selectedEmailIconFile, setSelectedEmailIconFile] = useState(null);
    const [currentEmailIcon, setCurrentEmailIcon] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    useEffect(() => {
      if (EmailIcon) {
        setCurrentEmailIcon(EmailIcon);
      }
    }, [EmailIcon, setCurrentEmailIcon]);

  const uploadEmailIcon = async () => {
    if (!selectedEmailIconFile)
      return toast.error("Please select a Icon first!");

    const formData = new FormData();
    formData.append("EMI", selectedEmailIconFile);

    try {
      const res = await axios.post(`${apiUrl}/api/home/upload-emi`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentEmailIcon(res.data.EmailIcon);
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Icon");
    }
  };

  return (
    <div>
      <div
        className="input"
        style={{
          display: `${activeTab3 === "MailIcon" ? "flex" : "none"}`,
        }}
      >
        <RevealSection trigger="scroll">
          <input
            type="file"
            id="EmailIconI"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedEmailIcon(URL.createObjectURL(file));
                setSelectedEmailIconFile(file);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              document.getElementById("EmailIconI").click();
            }}
          >
            {selectedEmailIcon ? (
              <img
                src={selectedEmailIcon}
                alt="Logo Preview"
                className="logo-preview"
              />
            ) : (
              <i
                className="fa-solid fa-upload"
                style={{ color: "#000000ff" }}
              ></i>
            )}
          </button>
          <img src={`${apiUrl}${currentEmailIcon}`} alt="currentLogo"  style={{background:"rgba(255, 255, 255, 0.4)"}}/>
        </RevealSection>
      </div>
      {selectedEmailIcon ? (
        <RevealSection trigger="scroll">
          <button type="button" className="d-changes" onClick={uploadEmailIcon}>
            Confirm Changes
          </button>
        </RevealSection>
      ) : (
        <></>
      )}{" "}
    </div>
  );
}
