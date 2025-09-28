import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function AddressEditT({ activeTab4 }) {
  const { Address } = useContext(MainDataContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  useEffect(() => {
    if (Address) {
      setCurrentAddress(Address);
    }
  }, [Address, setCurrentAddress]);

  const uploadAddressT = async () => {
    if (!selectedAddress) return toast.error("Please Enter Some Text!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-amt`,
        { selectedAddress },
        { headers: { "Content-Type": "application/json" } }
      );

      setCurrentAddress(res.data.selectedAddress);
      setSelectedAddress("");
      toast.success(res.data.message || "Address update successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div
      className="input"
      style={{
        display: activeTab4 === "AddressText" ? "flex" : "none",
        gap: "2cm",
      }}
    >
      <RevealSection trigger="scroll">
        <input
          type="text"
          name="UAT"
          id="UAT"
          placeholder={currentAddress}
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          style={{ width: "50%", height: "1.5cm", fontSize: "1.2cm" }}
        />
        <button
          type="button"
          className="d-changes"
          style={{ margin: " 0 0 0 10%" }}
          onClick={uploadAddressT}
        >
          Update Address
        </button>
      </RevealSection>
    </div>
  );
}
