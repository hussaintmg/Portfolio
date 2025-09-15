import React, { useState} from "react";

import RevealSection from "./RevealSection";
import PhoneEditI from "./PhoneEditI";
import PhoneEditT from "./PhoneEditT";

export default function PhoneEdit({ activeTab2 }) {
  const [activeTab4, setActiveTab4] = useState("PhoneIcon");
  const [indicator4Left, setIndicator4Left] = useState("0%");

  return (
    <div
      className="phone"
      style={{
        display: `${activeTab2 === "Phone" ? "block" : "none"}`,
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
            className={`tabs ${activeTab4 === "PhoneIcon" ? "active" : ""}`}
            onClick={() => {
              setIndicator4Left("0%");
              setActiveTab4("PhoneIcon");
            }}
          >
            Icon
          </button>

          <button
            type="button"
            className={`tabs ${activeTab4 === "PhoneText" ? "active" : ""}`}
            onClick={() => {
              setIndicator4Left("50%");
              setActiveTab4("PhoneText");
            }}
          >
            Number
          </button>
        </div>
      </RevealSection>
      <PhoneEditI activeTab4={activeTab4} />
      <PhoneEditT activeTab4={activeTab4} />
    </div>
  );
}
