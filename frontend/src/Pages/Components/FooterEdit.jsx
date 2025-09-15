import React, { useState } from "react";

import Contact from "./ContactEdit";
import SocialMediaAdmin from "./SocialMediaAdmin";
import "../SCSS/FooterEdit.scss";

export default function FooterEdit({ savedEmailT }) {
  const [activeTab1, setActiveTab1] = useState("Contacts");
  const [indicator1Left, setIndicator1Left] = useState("0%");
  return (
    <div>
      <h2 className="section">Footer</h2>
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
            left: `${indicator1Left}`,
            transition: "all 0.5s ease",
          }}
        ></span>
        <button
          type="button"
          className={`tabs ${activeTab1 === "Contacts" ? "active" : ""}`}
          onClick={() => {
            setActiveTab1("Contacts");
            setIndicator1Left("0%");
          }}
        >
          Contacts
        </button>

        <button
          type="button"
          className={`tabs ${activeTab1 === "SM" ? "active" : ""}`}
          onClick={() => {
            setActiveTab1("SM");
            setIndicator1Left("50%");
          }}
        >
          Social Media
        </button>
      </div>
      <Contact activeTab1={activeTab1} />
      <SocialMediaAdmin activeTab1={activeTab1} />
    </div>
  );
}
