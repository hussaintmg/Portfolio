import React, { useState, useEffect, useContext } from "react";

import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { MainDataContext } from "../../context/MainDataContext";
import AnimatedLayout from "../Components/AnimatedLayout";

import "./Project.scss";

export default function Projects() {
  const [openMenu, setOpenMenu] = useState(false);
  const { dataLoaded, projects: website_details } = useContext(MainDataContext);

  return dataLoaded === true ? (
    <div className="project-page">
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
      <Topbar active={"Projects"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"Projects"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>My Projects</AnimatedTitle>
      </h1>

      {website_details.map((web, index) => (
        <RevealSection trigger={index === 0 ? "load" : "scroll"}>
          <ProjectBlock
            index={index}
            web={web}
            reverse={index % 2 !== 0}
            website_details={website_details}
          />
        </RevealSection>
      ))}
      <RevealSection trigger="load">
        <p
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "2rem",
                fontWeight: "700",
                display: Array.isArray(website_details) && website_details.length > 0 ? "none" : "block",
              }}
            >
              No Projects Available
            </p>
      </RevealSection>

      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}

function ProjectBlock({ index, web, reverse, website_details }) {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const [currentImage, setCurrentImage] = useState(0);
  const [slideClass, setSlideClass] = useState("active");
  const [currentVideo, setCurrentVideo] = useState(0);

  console.log(website_details);

  useEffect(() => {
    document.title = "Hussain Portfolio | Projects";
    const interval = setInterval(() => {
      setSlideClass("slide-out");

      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % web.images.length);
        setSlideClass("active");
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [web.images.length]);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % web.videos.length);
  };

  return (
    <div className={`project-block ${reverse ? "reverse" : ""}`}>
      <div className="flex">
        <div className="title"><a href={web.link} target="blank">{web.title}</a></div>

        <div className="image-box">
          <img
            src={apiUrl + web.images[currentImage]}
            alt={`${web.title} img`}
            className={slideClass}
            loading="lazy"
          />
        </div>
      </div>

      <div className="video-box">
        <video
          key={currentVideo}
          src={apiUrl + web.videos[currentVideo]}
          autoPlay
          muted
          onEnded={handleVideoEnd}
        />
      </div>
      <hr
        className="line"
        style={{ display: `${website_details.length - 1 !== index ? "block" : "none"}` }}
      />
    </div>
  );
}
