import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function AddressEditI({ activeTab4 }) {
  const { AddressIcon } = useContext(MainDataContext);
  const [selectedAddressIcon, setSelectedAddressIcon] = useState(null);
  const [selectedAddressIconFile, setSelectedAddressIconFile] = useState(null);
    const [currentAddressIcon, setCurrentAddressIcon] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    useEffect(() => {
      if (AddressIcon) {
        setCurrentAddressIcon(AddressIcon);
      }
    }, [AddressIcon, setCurrentAddressIcon]);

  const uploadAddressIcon = async () => {
    if (!selectedAddressIconFile)
      return toast.error("Please select a Icon first!");

    const formData = new FormData();
    formData.append("AMI", selectedAddressIconFile);

    try {
      const res = await axios.post(`${apiUrl}/api/home/upload-ami`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentAddressIcon(res.data.AddressI);
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
          display: `${activeTab4 === "AddressIcon" ? "flex" : "none"}`,
        }}
      >
        <RevealSection trigger="scroll">
          <input
            type="file"
            id="AddressIconI"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedAddressIcon(URL.createObjectURL(file));
                setSelectedAddressIconFile(file);
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              document.getElementById("AddressIconI").click();
            }}
          >
            {selectedAddressIcon ? (
              <img
                src={selectedAddressIcon}
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
          <img src={`${apiUrl}${currentAddressIcon}`} alt="currentLogo"  style={{background:"rgba(255, 255, 255, 0.4)"}}/>
        </RevealSection>
      </div>
      {selectedAddressIcon ? (
        <RevealSection trigger="scroll">
          <button type="button" className="d-changes" onClick={uploadAddressIcon}>
            Confirm Changes
          </button>
        </RevealSection>
      ) : (
        <></>
      )}{" "}
    </div>
  );
}
