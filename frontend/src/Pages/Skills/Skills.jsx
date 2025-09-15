import React, { useState, useEffect, useMemo, useCallback ,useContext} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaShoppingCart,
  FaReact,
  FaBolt,
  FaServer,
  FaDatabase,
  FaLaptopCode,
  FaGithub,
} from "react-icons/fa";
import { MainDataContext } from "../../context/MainDataContext";


import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import FadeContent from "../Components/FadeContent";
import RevealSection from "../Components/RevealSection";
import Footer from "../Components/Footer";
import AnimatedLayout from "../Components/AnimatedLayout";


import HtmlIcon from "../Assets/html.png";
import CSSIcon from "../Assets/css.png";
import ReactIcon from "../Assets/react.png";
import NodeIcon from "../Assets/nodejs.png";
import MongoIcon from "../Assets/mongodb.jpg";
import ExpressIcon from "../Assets/express.png";

import "./Skills.scss";

const randomPercent = (min, max) =>
  `${Math.floor(Math.random() * (max - min) + min)}%`;

const MIN_DISTANCE = 15;

const isFarEnough = (pos, positions) => {
  return positions.every((p) => {
    const topDiff = Math.abs(parseInt(p.top) - parseInt(pos.top));
    const leftDiff = Math.abs(parseInt(p.left) - parseInt(pos.left));
    return topDiff > MIN_DISTANCE || leftDiff > MIN_DISTANCE;
  });
};

function Skills() {
  const [openMenu, setOpenMenu] = useState(false);
  const {dataLoaded } = useContext(MainDataContext);
  

  // floating tech icons
  const icons = useMemo(
    () => [HtmlIcon, CSSIcon, ReactIcon, NodeIcon, MongoIcon, ExpressIcon],
    []
  );

  const generatePositions = useCallback((count) => {
    const newPositions = [];
    for (let i = 0; i < count; i++) {
      let valid = false;
      let attempt = 0;
      let pos = null;
      while (!valid && attempt < 100) {
        pos = {
          top: randomPercent(20, 80),
          left: randomPercent(10, 85),
        };
        valid = isFarEnough(pos, newPositions);
        attempt++;
      }
      newPositions.push(pos);
    }
    return newPositions;
  }, []);

  const [positions, setPositions] = useState(() =>
    generatePositions(icons.length)
  );
  const [prevPositions, setPrevPositions] = useState(positions);

  useEffect(() => {
    document.title = "Hussain Portfolio | Skills";
    const interval = setInterval(() => {
      setPrevPositions(positions);
      setPositions(generatePositions(icons.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [icons.length, generatePositions, positions]);

  // services icons logic
  const serviceIcons = {
    "Custom Web Development": <FaLaptopCode size={40} color="white" />,
    "E-commerce Development": <FaShoppingCart size={40} color="white" />,
    "Single Page Application": <FaReact size={40} color="white" />,
    "Portfolio Websites": <FaCode size={40} color="white" />,
    "CMS Integration": <FaServer size={40} color="white" />,
    "SEO Optimization": <FaBolt size={40} color="white" />,
    "Website Maintenance": <FaGithub size={40} color="white" />,
    "API Development": <FaServer size={40} color="white" />,
    "Speed Optimization": <FaDatabase size={40} color="white" />,
  };

  const allIcons = Object.values(serviceIcons);
  const [activeService, setActiveService] = useState(null);
  const [randomIcon, setRandomIcon] = useState(allIcons[0]);
  const [prevIcon, setPrevIcon] = useState(allIcons[0]);

  // random rotation when not hovering (no repeat)
  useEffect(() => {
    if (activeService) return;
    const interval = setInterval(() => {
      let newIcon = prevIcon;
      while (newIcon === prevIcon) {
        newIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
      }
      setRandomIcon(newIcon);
      setPrevIcon(newIcon);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeService, allIcons, prevIcon]);

  return dataLoaded === true ? (
    <div className="skills-page">
      <div className="floating-icons">
        {icons.map((icon, i) => {
          const angle = Math.atan2(
            parseInt(positions[i].top) - parseInt(prevPositions[i].top),
            parseInt(positions[i].left) - parseInt(prevPositions[i].left)
          );
          const rotateDeg = (angle * 180) / Math.PI;

          return (
            <motion.img
              key={i}
              src={icon}
              alt="tech-icon"
              className="icon"
              initial={{
                top: prevPositions[i].top,
                left: prevPositions[i].left,
              }}
              animate={{
                top: positions[i].top,
                left: positions[i].left,
                rotate: [0, rotateDeg, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Background particles */}
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

      {/* Layout */}
      <Topbar active={"Skills"} setOpenMenu={setOpenMenu} />
      <SideBar
        active={"Skills"}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
      />

      <h1 className="heading">
        <AnimatedTitle>My Skills</AnimatedTitle>
      </h1>

      {/* Skills Section */}
      <RevealSection trigger="load">
        <div className="cont-st">
          <FadeContent
            className="st"
            blur={true}
            duration={1500}
            easing="ease-out"
            initialOpacity={0}
          >
            <h3 className="name">Skills And Technologies:</h3>
            <ul>
              <li><strong className="bold">Frontend:</strong> HTML, CSS, JavaScript, React, TailwindCSS</li>
              <li><strong className="bold">Backend:</strong> Node.js, Express, REST APIs</li>
              <li><strong className="bold">Database:</strong> MongoDB</li>
              <li><strong className="bold">Version Control:</strong> Git, GitHub, GitLab</li>
              <li><strong className="bold">Deployment and Hosting:</strong> Heroku, Netlify, Vercel, AWS</li>
            </ul>
          </FadeContent>
        </div>
      </RevealSection>

      {/* Services Section */}
      <RevealSection trigger="scroll">
        <div className="cont-so">
          <FadeContent
            className="so"
            blur={true}
            duration={1500}
            easing="ease-out"
            initialOpacity={0}
          >
            <h3 className="name">Services Offered:</h3>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                className="service-icon-box"
                style={{
                  display: "block",
                  position: "absolute",
                  top: "50%",
                  left: "-30%",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService || randomIcon.key || Math.random()}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeService ? serviceIcons[activeService] : randomIcon}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul>
                {Object.keys(serviceIcons).map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActiveService(service)}
                    onMouseLeave={() => setActiveService(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </FadeContent>
        </div>
      </RevealSection>

      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}

export default Skills;
