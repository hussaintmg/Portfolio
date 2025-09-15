import React, { useState, useEffect ,useContext} from "react";

import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import Webimg from "../Assets/web.png";
import img from "../Assets/lap.jpeg";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import { MainDataContext } from "../../context/MainDataContext";
import AnimatedLayout from "../Components/AnimatedLayout";


import Vid from "../Assets/website-vid.mp4";

import "./Project.scss";

export default function Projects() {
  const [openMenu, setOpenMenu] = useState(false);
  const {dataLoaded } = useContext(MainDataContext);

  const website_details = [
    {
      title: "Task Manager",
      images: [Webimg, img, img],
      videos: [Vid, Vid],
    },
    {
      title: "Chat Box",
      images: [Webimg, img],
      videos: [Vid, Vid, Vid],
    },
    {
      title: "Buy Good",
      images: [img, Webimg],
      videos: [Vid],
    },
    {
      title: "Modeling",
      images: [Webimg, img, Webimg],
      videos: [Vid, Vid],
    },
  ];

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
          <ProjectBlock key={index} web={web} reverse={index % 2 !== 0} />
        </RevealSection>
      ))}

      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}

function ProjectBlock({ web, reverse }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideClass, setSlideClass] = useState("active");
  const [currentVideo, setCurrentVideo] = useState(0);

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
        <div className="title">{web.title}</div>

        <div className="image-box">
          <img
            src={web.images[currentImage]}
            alt={`${web.title} img`}
            className={slideClass}
            loading="lazy"
          />
        </div>
      </div>

      <div className="video-box">
        <video
          key={currentVideo}
          src={web.videos[currentVideo]}
          autoPlay
          muted
          onEnded={handleVideoEnd}
        />
      </div>
      <hr className="line" />
    </div>
  );
}
