import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function PhoneEditT({ activeTab4 }) {
  const { PhoneNumber } = useContext(MainDataContext);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

    useEffect(() => {
      if (PhoneNumber) {
        setCurrentPhoneNumber(PhoneNumber);
      }
    }, [PhoneNumber, setCurrentPhoneNumber]);

  const uploadPhoneT = async () => {
    if (!selectedPhoneNumber)
      return toast.error("Please Enter Something!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-pmt`,
        { selectedPhoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      setCurrentPhoneNumber(res.data.selectedPhoneNumber);
      setSelectedPhoneNumber("");
      toast.success(res.data.message || "Phone Number update successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div
          className="input"
          style={{
            display: activeTab4 === "PhoneText" ? "flex" : "none",
            gap: "2cm",
          }}
        >
          <RevealSection trigger="scroll">
            <input
              type="text"
              name="UPNumber"
              id="UPNumber"
              placeholder={currentPhoneNumber}
              value={selectedPhoneNumber}
              onChange={(e) => setSelectedPhoneNumber(e.target.value)}
              style={{ width: "50%", height: "1.5cm", fontSize: "1.2cm" }}
            />
            <button
              type="button"
              className="d-changes"
              style={{ margin: " 0 0 0 10%" }}
              onClick={uploadPhoneT}
            >
              Update Number
            </button>
          </RevealSection>
        </div>
  );
}