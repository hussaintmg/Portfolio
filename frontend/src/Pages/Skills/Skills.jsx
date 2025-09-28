import React, { useState, useEffect, useCallback, useContext, Suspense ,useMemo} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainDataContext } from "../../context/MainDataContext";

import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Particles from "../Components/Particles";
import AnimatedTitle from "../Components/AnimatedTitle";
import FadeContent from "../Components/FadeContent";
import RevealSection from "../Components/RevealSection";
import Footer from "../Components/Footer";
import AnimatedLayout from "../Components/AnimatedLayout";

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

// 🔹 Dynamic icon component
const DynamicFaIcon = ({ iconName, size = 40, color = "white" }) => {
  const Icon = React.lazy(() =>
    import("react-icons/fa").then((module) => ({ default: module[iconName] }))
  );
  return (
    <Suspense fallback={<span style={{ width: size, height: size }}>...</span>}>
      <Icon size={size} color={color} />
    </Suspense>
  );
};

function Skills() {
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  const [openMenu, setOpenMenu] = useState(false);
  const { dataLoaded, skIcons, skList, services = [] } = useContext(MainDataContext);

  const icons = useMemo(() => skIcons || [], [skIcons]);


  const generatePositions = useCallback((count) => {
    const newPositions = [];
    for (let i = 0; i < count; i++) {
      let valid = false;
      let attempt = 0;
      let pos = null;
      while (!valid && attempt < 100) {
        pos = {
          top: randomPercent(20, 130),
          left: randomPercent(10, 85),
        };
        valid = isFarEnough(pos, newPositions);
        attempt++;
      }
      newPositions.push(pos);
    }
    return newPositions;
  }, []);

  const [positions, setPositions] = useState(() => generatePositions(icons.length));
  const [prevPositions, setPrevPositions] = useState(positions);

  useEffect(() => {
    if (icons.length > 0) {
      const newPositions = generatePositions(icons.length);
      setPositions(newPositions);
      setPrevPositions(newPositions);
    }
  }, [icons, generatePositions]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Skills";
    const interval = setInterval(() => {
      setPrevPositions(positions);
      setPositions(generatePositions(icons.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [icons.length, generatePositions, positions]);

  const [activeService, setActiveService] = useState(null);
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    if (activeService) return;
    const interval = setInterval(() => {
      setRandomIndex((prev) => (prev + 1) % (services?.length || 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeService, services]);

  return dataLoaded === true ? (
    <div className="skills-page">
      <div className="floating-icons">
        {icons.map((icon, i) => {
          if (!positions[i] || !prevPositions[i]) return null;

          const angle = Math.atan2(
            parseInt(positions[i].top) - parseInt(prevPositions[i].top),
            parseInt(positions[i].left) - parseInt(prevPositions[i].left)
          );
          const rotateDeg = (angle * 180) / Math.PI;

          return (
            <motion.img
              key={i}
              src={apiUrl + icon}
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
      <SideBar active={"Skills"} setOpenMenu={setOpenMenu} openMenu={openMenu} />

      <h1 className="heading">
        <AnimatedTitle>My Skills</AnimatedTitle>
      </h1>

      {/* Skills Section */}
      <RevealSection trigger="load">
        <div className="cont-st">
          <FadeContent className="st" blur={true} duration={1500} easing="ease-out" initialOpacity={0}>
            <h3 className="name">Skills And Technologies:</h3>
            <ul>
              {skList?.length > 0 ? (
                <>
                  {skList.map((list, i) => (
                    <li key={i}>
                      <strong className="bold">{list.heading}</strong> {list.list}
                    </li>
                  ))}
                </>
              ) : (
                <p style={{ fontSize: "2rem", color: "red", textAlign: "center", fontWeight: "700" }}></p>
              )}
            </ul>
          </FadeContent>
        </div>
      </RevealSection>

      {/* Services Section */}
      <RevealSection trigger="scroll">
        <div className="cont-so">
          <FadeContent className="so" blur={true} duration={1500} easing="ease-out" initialOpacity={0}>
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
                    key={activeService || randomIndex}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeService ? (
                      <DynamicFaIcon iconName={activeService.icon} />
                    ) : services[randomIndex] ? (
                      <DynamicFaIcon iconName={services[randomIndex].icon} />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul>
                {services.map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActiveService(service)}
                    onMouseLeave={() => setActiveService(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {service.title}
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
