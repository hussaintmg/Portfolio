import React, { useState, useEffect, useContext } from "react";
import Topbar from "../Components/AdminTopBar";
import SideBar from "../Components/AdminSideBar";
import FooterEdit from "../Components/FooterEdit";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MainDataContext } from "../../context/MainDataContext";
import AnimatedLayout from "../Components/AnimatedLayout";

import "./AdminHome.scss";
import axios from "axios";
import { toast } from "react-toastify";

export default function Admin() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const {
    logo,
    welText: contextWelText,
    MS: contextMS,
    MSB: contextMSB,
    Prof,
    FO: savedFO,
    EmailIcon: savedEmailIcon,
    EmailT: savedEmailT,
    dataLoaded,
  } = useContext(MainDataContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const [mainEditActive, setMainEditActive] = useState("GT");
  const [indicatorLeft, setIndicatorLeft] = useState("0%");
  const [openMenu, setOpenMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [selectedProf, setSelectedProf] = useState(null);
  const [currentProf, setCurrentProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [selectedProfFile, setSelectedProfFile] = useState(null);
  const [currentWel, setCurrentWel] = useState(null);
  const [welText, setWelText] = useState(null);
  const [MS, setMS] = useState(null);
  const [currentMS, setCurrentMS] = useState(null);
  const [MSB, setMSB] = useState(null);
  const [currentMSB, setCurrentMSB] = useState(null);
  const [FOI, setFOI] = useState(null);
  const [FOL, setFOL] = useState(null);
  const [currentFO, setCurrentFO] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [gtFirstLoad, setGtFirstLoad] = useState(true);

  const [editFOI, setEditFOI] = useState("");
  const [editFOL, setEditFOL] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      if (user?.role) {
        setIsAdmin(user.role === "admin");
        setLoading(false);
      } else {
        try {
          const res = await axios.get(`${apiUrl}/api/auth/user`, {
            withCredentials: true,
          });
          setUser(res.data);
          setIsAdmin(res.data.role === "admin");
        } catch (err) {
          setUser(null);
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    };
    if (logo) {
      setCurrentLogo(logo);
    }
    if (contextWelText) {
      setCurrentWel(contextWelText);
    }
    if (contextMS) {
      setCurrentMS(contextMS);
    }
    if (contextMSB) {
      setCurrentMSB(contextMSB);
    }
    if (Prof) {
      setCurrentProf(Prof);
    }
    if (savedFO) {
      setCurrentFO(savedFO);
    }
    checkUser();
    document.title = "Hussain Portfolio | Home Edit";
  }, [
    user,
    navigate,
    apiUrl,
    setUser,
    logo,
    setCurrentLogo,
    contextWelText,
    setCurrentMS,
    contextMS,
    setCurrentMSB,
    contextMSB,
    setCurrentProf,
    Prof,
    savedFO,
    setCurrentFO,
  ]);

  useEffect(() => {
    if (mainEditActive !== "GT" && gtFirstLoad) {
      setGtFirstLoad(false);
    }
  }, [mainEditActive, gtFirstLoad]);

  if (loading) {
    return (
      <div className="AdminPage">
        <h2 style={{ textAlign: "center", color: "white" }}>Loading...</h2>
      </div>
    );
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditFOI(currentFO[index].FOI);
    setEditFOL(currentFO[index].FOL);
  };
  const handleCancel = () => {
    setEditIndex(null);
    setEditFOI("");
    setEditFOL("");
  };

  const handleDone = async (index) => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/home/update-FO`,
        { index, FOI: editFOI, FOL: editFOL },
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedFO = [...currentFO];
      updatedFO[index] = { FOI: editFOI, FOL: editFOL };
      setCurrentFO(updatedFO);
      setEditIndex(null);
      toast.success(res.data.message || "Item Updated!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update");
    }
  };
  const handleDelete = async (index) => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/home/delete-FO`,
        { index },
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedFO = currentFO.filter((_, i) => i !== index);
      setCurrentFO(updatedFO);
      toast.success(res.data.message || "Item Deleted!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete");
    }
  };

  const uploadLogo = async () => {
    if (!selectedLogo) return toast.error("Please select a logo first!");

    const formData = new FormData();
    formData.append("logo", selectedLogoFile);

    try {
      const res = await axios.post(`${apiUrl}/api/home/upload-logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentLogo(res.data.logo);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload logo");
    }
  };
  const uploadWel = async () => {
    if (!welText) return toast.error("Please enter some text!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-wel`,
        { welText },
        { headers: { "Content-Type": "application/json" } }
      );
      setCurrentWel(res.data.welText);
      toast.success("text updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload  text");
    }
  };
  const uploadMSB = async () => {
    if (!MSB) return toast.error("Please enter some text!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-msb`,
        { MSB },
        { headers: { "Content-Type": "application/json" } }
      );
      setCurrentMSB(res.data.MSB);
      toast.success("text updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload text");
    }
  };
  const uploadMS = async () => {
    if (!MS) return toast.error("Please enter some text!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-ms`,
        { MS },
        { headers: { "Content-Type": "application/json" } }
      );
      setCurrentMS(res.data.MS);
      toast.success("text updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload text");
    }
  };
  const uploadProf = async () => {
    if (!selectedProf) return toast.error("Please select a Profile first!");

    const formData = new FormData();
    formData.append("Prof", selectedProfFile);

    try {
      const res = await axios.post(`${apiUrl}/api/home/upload-prof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentProf(res.data.Profile);
      toast.success("Profile uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Profile");
    }
  };
  const uploadFO = async () => {
    if (!FOI) return toast.error("Please enter title!");
    if (!FOL) return toast.error("Please enter some text/link!");

    try {
      const res = await axios.post(
        `${apiUrl}/api/home/upload-FO`,
        { FOI, FOL },
        { headers: { "Content-Type": "application/json" } }
      );

      setCurrentFO((prev) => [...prev, { FOI, FOL }]);

      setFOI("");
      setFOL("");
      toast.success(res.data.message || "Uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload");
    }
  };

  return dataLoaded === true ? (
    <div className="AdminHomePage">
      <Particles
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
      />
      <Topbar active={"AdminHome"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"AdminHome"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>Home Edit</AnimatedTitle>
      </h1>
      {isAdmin ? (
        <div className="main">
          <h2 className="section">Top Bar Editing</h2>
          <RevealSection trigger="load">
            <h2 className="item-heading">Logo </h2>
            <div className="input">
              <input
                type="file"
                id="logoInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedLogo(URL.createObjectURL(file));
                    setSelectedLogoFile(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  document.getElementById("logoInput").click();
                }}
              >
                {selectedLogo ? (
                  <img
                    src={selectedLogo}
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
              <img src={`${apiUrl}${currentLogo}`} alt="currentLogo" />
            </div>
            {selectedLogo ? (
              <button type="button" className="d-changes" onClick={uploadLogo}>
                Confirm Changes
              </button>
            ) : (
              <></>
            )}
          </RevealSection>
          <RevealSection trigger="load">
            <h2 className="section">Main Section</h2>
            <div className="tab-bar" style={{ position: "relative" }}>
              <span
                className="indicator"
                style={{
                  width: "20%",
                  position: "absolute",
                  bottom: "0",
                  height: "100%",
                  background: "red",
                  borderRadius: "10px",
                  left: `${indicatorLeft}`,
                  transition: "all 0.5s ease"
                }}
              ></span>

              <button
                className={`tabs ${mainEditActive === "GT" ? "active" : ""}`}
                onClick={() => {
                  setMainEditActive("GT");
                  setIndicatorLeft("0%")
                }}
              >
                Greeting Text
              </button>
              <button
                className={`tabs ${mainEditActive === "MSB" ? "active" : ""}`}
                onClick={() => {
                  setMainEditActive("MSB");
                  setIndicatorLeft("20%")
                }}
              >
                My Self Bold
              </button>
              <button
                className={`tabs ${mainEditActive === "MS" ? "active" : ""}`}
                onClick={() => {
                  setMainEditActive("MS");
                  setIndicatorLeft("40%")
                }}
              >
                My Self
              </button>
              <button
                className={`tabs ${mainEditActive === "PP" ? "active" : ""}`}
                onClick={() => {
                  setMainEditActive("PP");
                  setIndicatorLeft("60%")
                }}
              >
                Profile Picture
              </button>
              <button
                className={`tabs ${mainEditActive === "FO" ? "active" : ""}`}
                onClick={() => {
                  setMainEditActive("FO");
                  setIndicatorLeft("80%")
                }}
              >
                Freelane On
              </button>
            </div>

            <div
              className="main-show"
              style={{ display: mainEditActive === "GT" ? "block" : "none" }}
            >
              <RevealSection trigger={gtFirstLoad ? "load" : "scroll"}>
                <h2 className="item-heading">Greeting Text</h2>
                <div className="input" style={{ gap: "2cm" }}>
                  <input
                    type="text"
                    id="welInput"
                    value={welText}
                    placeholder={currentWel}
                    onChange={(e) => setWelText(e.target.value)}
                    style={{
                      width: "50%",
                      height: "1.5cm",
                      fontSize: "1.2cm",
                      textAlign: "center",
                    }}
                  />
                  <button
                    type="button"
                    className="d-changes"
                    style={{ margin: " 0 0 0 10%" }}
                    onClick={uploadWel}
                  >
                    Confirm Changes
                  </button>
                </div>
              </RevealSection>
            </div>
            <div
              className="main-show"
              style={{ display: mainEditActive === "MSB" ? "block" : "none" }}
            >
              <RevealSection trigger="scroll">
                <h2 className="item-heading">My SelfBold</h2>
                <div className="input" style={{ gap: "2cm" }}>
                  <input
                    type="text"
                    value={MSB}
                    placeholder={currentMSB}
                    onChange={(e) => setMSB(e.target.value)}
                    style={{ width: "50%", height: "1.5cm", fontSize: "1.2cm" }}
                  />
                  <button
                    type="button"
                    className="d-changes"
                    style={{ margin: " 0 0 0 10%" }}
                    onClick={uploadMSB}
                  >
                    Confirm Changes
                  </button>
                </div>
              </RevealSection>
            </div>
            <div
              className="main-show"
              style={{ display: mainEditActive === "MS" ? "block" : "none" }}
            >
              <RevealSection trigger="scroll">
                <h2 className="item-heading">My Self</h2>
                <div className="input" style={{ gap: "2cm" }}>
                  <textarea
                    value={MS}
                    placeholder={currentMS}
                    onChange={(e) => setMS(e.target.value)}
                    style={{
                      width: "50%",
                      minHeight: "100px",
                      maxHeight: "150px",
                      fontSize: "18px",
                      lineHeight: "1.5",
                      padding: "10px",
                      resize: "none",
                      overflowY: "auto",
                      boxSizing: "border-box",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  ></textarea>

                  <button
                    type="button"
                    className="d-changes"
                    style={{ margin: " 0 0 0 10%" }}
                    onClick={uploadMS}
                  >
                    Confirm Changes
                  </button>
                </div>
              </RevealSection>
            </div>
            <div
              className="main-show"
              style={{ display: mainEditActive === "PP" ? "block" : "none" }}
            >
              <RevealSection trigger="scroll">
                <h2 className="item-heading">Profile Picture</h2>
                <div className="input">
                  <input
                    type="file"
                    id="profInput"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedProf(URL.createObjectURL(file));
                        setSelectedProfFile(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("profInput").click();
                    }}
                  >
                    {selectedProf ? (
                      <img
                        src={selectedProf}
                        alt="Profile Preview"
                        className="Profle-preview"
                      />
                    ) : (
                      <i
                        className="fa-solid fa-upload"
                        style={{ color: "#000000ff" }}
                      ></i>
                    )}
                  </button>
                  <img src={`${apiUrl}${currentProf}`} alt="currentProfile" style={{ background: "rgba(255, 255, 255, 0.4)" }} />
                </div>
                {selectedProf ? (
                  <button
                    type="button"
                    className="d-changes"
                    onClick={uploadProf}
                  >
                    Confirm Changes
                  </button>
                ) : (
                  <></>
                )}
              </RevealSection>
            </div>
            <div
              className="main-show"
              style={{ display: mainEditActive === "FO" ? "block" : "none" }}
            >
              <RevealSection trigger="scroll">
                <h2 className="item-heading">Freelance On</h2>
                <div className="freelance">
                  <div
                    className="current"
                    style={{ margin: "0.5cm 0", textAlign: "center" }}
                  >
                    {currentFO && currentFO.length > 0 ? (
                      <table
                        border="1"
                        style={{
                          width: "80%",
                          textAlign: "center",
                          margin: "1cm 0 1cm 2cm",
                          borderCollapse: "collapse",
                          background: "white",
                          fontSize: "1.2rem",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "rgba(7, 98, 141, 1)",
                              fontSize: "1.3rem",
                              color: "white",
                            }}
                          >
                            <th style={{ padding: "0.2cm 0" }}>Title</th>
                            <th style={{ padding: "0.2cm 0" }}>Link</th>
                            <th style={{ padding: "0.2cm 0" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFO.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "row-blue" : "row-white"
                              }
                              style={{
                                padding: "0.5cm 0",
                                backgroundColor:
                                  index % 2 === 0 ? "#EAF3FA" : "#FFFFFF",
                              }}
                            >
                              <td style={{ padding: "0.3cm" }}>
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    value={editFOI}
                                    onChange={(e) => setEditFOI(e.target.value)}
                                    placeholder={item.FOI}
                                    style={{
                                      width: "80%",
                                      padding: "0.2cm",
                                      fontSize: "1rem",
                                      border: "1px solid gray",
                                      borderRadius: "4px",
                                    }}
                                  />
                                ) : (
                                  item.FOI
                                )}
                              </td>
                              <td style={{ padding: "0.3cm" }}>
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    value={editFOL}
                                    onChange={(e) => setEditFOL(e.target.value)}
                                    placeholder={item.FOL}
                                    style={{
                                      width: "80%",
                                      padding: "0.2cm",
                                      fontSize: "1rem",
                                      border: "1px solid gray",
                                      borderRadius: "4px",
                                    }}
                                  />
                                ) : (
                                  item.FOL
                                )}
                              </td>
                              <td style={{ padding: "0.3cm" }}>
                                {editIndex === index ? (
                                  <>
                                    <button
                                      style={{
                                        margin: "10px",
                                        width: "2.5cm",
                                        height: "1cm",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "green",
                                        color: "white",
                                        fontSize: "0.6cm",
                                        fontWeight: "700",
                                      }}
                                      onClick={() => handleDone(index)}
                                    >
                                      Done
                                    </button>
                                    <button
                                      style={{
                                        width: "2.5cm",
                                        height: "1cm",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "orange",
                                        color: "white",
                                        fontSize: "0.6cm",
                                        fontWeight: "700",
                                      }}
                                      onClick={handleCancel}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={{
                                        margin: "10px",
                                        width: "2.5cm",
                                        height: "1cm",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "yellow",
                                        color: "rgba(27, 31, 28, 1)",
                                        fontSize: "0.6cm",
                                        fontWeight: "700",
                                      }}
                                      onClick={() => handleEdit(index)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      style={{
                                        width: "2.5cm",
                                        height: "1cm",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "red",
                                        color: "white",
                                        fontSize: "0.6cm",
                                        fontWeight: "700",
                                      }}
                                      onClick={() => handleDelete(index)}
                                    >
                                      {" "}
                                      Delete{" "}
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p
                        style={{
                          color: "rgba(141, 29, 29, 1)",
                          fontSize: "1.3rem",
                        }}
                      >
                        No Freelance Links Available
                      </p>
                    )}
                  </div>
                  <div className="input" style={{ gap: "0.5cm" }}>
                    <input
                      type="text"
                      value={FOI}
                      placeholder="Title"
                      onChange={(e) => setFOI(e.target.value)}
                      style={{
                        width: "30%",
                        height: "1.5cm",
                        fontSize: "1.2cm",
                        padding: "0 0 0 0.2cm",
                      }}
                    />
                    <input
                      type="text"
                      value={FOL}
                      placeholder="Link"
                      onChange={(e) => setFOL(e.target.value)}
                      style={{
                        width: "30%",
                        height: "1.5cm",
                        fontSize: "1.2cm",
                        padding: "0 0 0 0.2cm",
                      }}
                    />
                    <button
                      type="button"
                      className="d-changes"
                      style={{ margin: " 0 0 0 5%" }}
                      onClick={uploadFO}
                    >
                      Upload Item
                    </button>
                  </div>
                </div>
              </RevealSection>
            </div>
          </RevealSection>
          <RevealSection trigger="scroll">
            <FooterEdit
              savedEmailIcon={savedEmailIcon}
              savedEmailT={savedEmailT}
            />
          </RevealSection>
        </div>
      ) : (
        <p style={{ color: "red", paddingLeft: "1cm", fontSize: "1.2rem" }}>
          You are not an Admin
        </p>
      )}

      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}
