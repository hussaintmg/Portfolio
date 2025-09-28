import React, { useState} from "react";

import RevealSection from "./RevealSection";
import AddressEditI from "./AddressEditI";
import AddressEditT from "./AddressEditT";

export default function AddressEdit({ activeTab2 }) {
  const [activeTab4, setActiveTab4] = useState("AddressIcon");
  const [indicator4Left, setIndicator4Left] = useState("0%");

  return (
    <div
      className="Address"
      style={{
        display: `${activeTab2 === "Address" ? "block" : "none"}`,
        margin: "1cm 0",
      }}
    >
      <RevealSection trigger="scroll">
        <div className="tab">
          <span
            className="indicator"
            style={{
              width: "50%",
              position: "absolute",
              bottom: "0",
              height: "100%",
              background: "red",
              borderRadius: "10px",
              left: `${indicator4Left}`,
              transition: "all 0.5s ease",
            }}
          ></span>
          <button
            type="button"
            className={`tabs ${activeTab4 === "AddressIcon" ? "active" : ""}`}
            onClick={() => {
              setIndicator4Left("0%");
              setActiveTab4("AddressIcon");
            }}
          >
            Icon
          </button>

          <button
            type="button"
            className={`tabs ${activeTab4 === "AddressText" ? "active" : ""}`}
            onClick={() => {
              setIndicator4Left("50%");
              setActiveTab4("AddressText");
            }}
          >
            Address
          </button>
        </div>
      </RevealSection>
      <AddressEditI activeTab4={activeTab4} />
      <AddressEditT activeTab4={activeTab4} />
    </div>
  );
}
