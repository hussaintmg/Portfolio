import React, { useState, useEffect, useContext } from "react";

import RevealSection from "./RevealSection";
import { MainDataContext } from "../../context/MainDataContext";

import { toast } from "react-toastify";
import axios from "axios";

export default function MailEditT({ activeTab3 }) {
  const { EmailT: savedEmailT } = useContext(MainDataContext);
  const [currentEmailT, setCurrentEmailT] = useState("");
  const [EmailT, setEmailT] = useState("");

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  useEffect(() => {
    if (savedEmailT) {
      setCurrentEmailT(savedEmailT);
    }
  }, [savedEmailT, setCurrentEmailT]);

  const updateEmail = async () => {
    if (!EmailT) return toast.error("Please Enter an Email!");
    console.log(EmailT);

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-emt`,
        { EmailT },
        { headers: { "Content-Type": "application/json" } }
      );

      setCurrentEmailT(res.data.EmailT);
      setEmailT("");
      toast.success(res.data.message || "Email update successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };
  return (
    <div
      className="input"
      style={{
        display: activeTab3 === "MailText" ? "flex" : "none",
        gap: "2cm",
      }}
    >
      <RevealSection trigger="scroll">
        <input
          type="text"
          name="UPEmail"
          id="UPEmail"
          placeholder={currentEmailT}
          value={EmailT}
          onChange={(e) => setEmailT(e.target.value)}
          style={{ width: "50%", height: "1.5cm", fontSize: "1.2cm" }}
        />
        <button
          type="button"
          className="d-changes"
          style={{ margin: " 0 0 0 10%" }}
          onClick={updateEmail}
        >
          Update Email
        </button>
      </RevealSection>
    </div>
  );
}
