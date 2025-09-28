import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function PhoneEditI({ activeTab4 }) {
  const { PhoneIcon } = useContext(MainDataContext);
  const [selectedPhoneIcon, setSelectedPhoneIcon] = useState(null);
  const [selectedPhoneIconFile, setSelectedPhoneIconFile] = useState(null);
    const [currentPhoneIcon, setCurrentPhoneIcon] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    useEffect(() => {
      if (PhoneIcon) {
        setCurrentPhoneIcon(PhoneIcon);
      }
    }, [PhoneIcon, setCurrentPhoneIcon]);

  const uploadPhoneIcon = async () => {
    if (!selectedPhoneIconFile)
      return toast.error("Please select a Icon first!");

    const formData = new FormData();
    formData.append("PMI", selectedPhoneIconFile);

    try {
      const res = await axios.post(`${apiUrl}/api/home/upload-pmi`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentPhoneIcon(res.data.PhoneI);
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
          display: `${activeTab4 === "PhoneIcon" ? "flex" : "none"}`,
        }}
      >
        <RevealSection trigger="scroll">
          <input
            type="file"
            id="PhoneIconI"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedPhoneIcon(URL.createObjectURL(file));
                setSelectedPhoneIconFile(file);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              document.getElementById("PhoneIconI").click();
            }}
          >
            {selectedPhoneIcon ? (
              <img
                src={selectedPhoneIcon}
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
          <img src={`${apiUrl}${currentPhoneIcon}`} alt="currentLogo"  style={{background:"rgba(255, 255, 255, 0.4)"}}/>
        </RevealSection>
      </div>
      {selectedPhoneIcon ? (
        <RevealSection trigger="scroll">
          <button type="button" className="d-changes" onClick={uploadPhoneIcon}>
            Confirm Changes
          </button>
        </RevealSection>
      ) : (
        <></>
      )}{" "}
    </div>
  );
}
