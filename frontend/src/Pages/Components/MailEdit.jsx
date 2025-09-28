import React, { useState} from "react";

import RevealSection from "./RevealSection";
import MailEditI from "./MailEditI";
import MailEditT from "./MailEditT";

export default function MailEdit({ activeTab2 }) {
  const [activeTab3, setActiveTab3] = useState("MailIcon");
  const [indicator3Left, setIndicator3Left] = useState("0%");

  return (
    <div
      className="mail"
      style={{
        display: `${activeTab2 === "Mail" ? "block" : "none"}`,
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
              left: `${indicator3Left}`,
              transition: "all 0.5s ease",
            }}
          ></span>
          <button
            type="button"
            className={`tabs ${activeTab3 === "MailIcon" ? "active" : ""}`}
            onClick={() => {
              setActiveTab3("MailIcon");
              setIndicator3Left("0%")
            }}
          >
            Icon
          </button>

          <button
            type="button"
            className={`tabs ${activeTab3 === "MailText" ? "active" : ""}`}
            onClick={() => {
              setActiveTab3("MailText");
              setIndicator3Left("50%")
            }}
          >
            Email
          </button>
        </div>
      </RevealSection>
      <MailEditI activeTab3={activeTab3} />
      <MailEditT activeTab3={activeTab3} />
    </div>
  );
}
