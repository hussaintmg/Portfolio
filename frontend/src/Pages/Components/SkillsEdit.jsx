import React, { useState } from "react";
import SkillsIcon from "../Components/SkillsIcons";
import SkillsList from "../Components/SkillsList";
import "../SCSS/FooterEdit.scss";

export default function SkillsEdit() {
  const [activeTab1, setActiveTab1] = useState("SkillsIcon");
  const [indicator1Left, setIndicator1Left] = useState("0%");
  return (
    <div>
      <h2 className="section">Skills And Technologies Section</h2>
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
          className={`tabs ${activeTab1 === "SkillsIcon" ? "active" : ""}`}
          onClick={() => {
            setActiveTab1("SkillsIcon");
            setIndicator1Left("0%");
          }}
        >
          Icons 
        </button>

        <button
          type="button"
          className={`tabs ${activeTab1 === "SkillsList" ? "active" : ""}`}
          onClick={() => {
            setActiveTab1("SkillsList");
            setIndicator1Left("50%");
          }}
        >
          Lists
        </button>
      </div>
      <SkillsIcon activeTab1={activeTab1} />
      <SkillsList activeTab1={activeTab1} />
    </div>
  );
}
