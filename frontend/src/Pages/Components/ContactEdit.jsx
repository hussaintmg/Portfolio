import React, { useState } from "react";

import RevealSection from "./RevealSection";
import MailEdit from "./MailEdit";
import PhoneEdit from "./PhoneEdit";
import AddressEdit from "./AddressEdit";

export default function ContactEdit({ activeTab1 }) {
  const [indicator2Left, setIndicator2Left] = useState("0%");
  const [activeTab2, setActiveTab2] = useState("Mail");

  return (
    <div
      className="contacts"
      style={{
        display: `${activeTab1 === "Contacts" ? "block" : "none"}`,
        margin: "1cm 0",
      }}
    >
      <RevealSection trigger="scroll">
        <div className="tab">
          <span
            className="indicator"
            style={{
              width: "33.34%",
              position: "absolute",
              bottom: "0",
              height: "100%",
              background: "red",
              borderRadius: "10px",
              left: `${indicator2Left}`,
              transition: "all 0.5s ease",
            }}
          ></span>
          <button
            type="button"
            className={`tabs ${activeTab2 === "Mail" ? "active" : ""}`}
            onClick={() => {
              setActiveTab2("Mail");
              setIndicator2Left("0%");
            }}
          >
            Mail
          </button>

          <button
            type="button"
            className={`tabs ${activeTab2 === "Phone" ? "active" : ""}`}
            onClick={() => {
              setActiveTab2("Phone");
              setIndicator2Left("33.34%");
            }}
          >
            Phone
          </button>
          <button
            type="button"
            className={`tabs ${activeTab2 === "Address" ? "active" : ""}`}
            onClick={() => {
              setActiveTab2("Address");
              setIndicator2Left("66.68%");
            }}
          >
            Address
          </button>
        </div>
      </RevealSection>
      <MailEdit activeTab2={activeTab2} />
      <PhoneEdit activeTab2={activeTab2} />
      <AddressEdit activeTab2={activeTab2} />
    </div>
  );
}
