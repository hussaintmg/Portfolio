import React, { useState, useEffect, useContext } from "react";
import Topbar from "../Components/Top-bar";
import SideBar from "../Components/Side-bar";
import Profone from "../Components/Prof_1";
import Proftwo from "../Components/Prof_2";
import Profthree from "../Components/Prof_3";
import Proffour from "../Components/Prof_4";
import Self from "../Components/Self";
import SplitText from "../Components/SplitText";
import Particles from "../Components/Particles";
import FadeContent from "../Components/FadeContent";
import Footer from "../Components/Footer";
import RevealSection from "../Components/RevealSection";
import AnimatedLayout from "../Components/AnimatedLayout";
import { MainDataContext } from "../../context/MainDataContext";
import "./Home.scss";
function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [width, setWidth] = useState(window.innerWidth)
  const { welText, FO, dataLoaded } = useContext(MainDataContext);
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  useEffect(() => {
    document.title = "Hussain Portfolio | Home";
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let content;
  if (width >= 1200) {
    content = <Profone />;
  } else if (width >= 750) {
    content = <Proftwo />;
  } else if (width >= 250) {
    content = <Profthree />;
  } else {
    content = <Proffour />;
  }
  return dataLoaded === true ? (
    <div className="home-page">
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
      <Topbar active={"Home"} setOpenMenu={setOpenMenu} />
      <SideBar active={"Home"} setOpenMenu={setOpenMenu} openMenu={openMenu} />
      <div className="wel">
        <SplitText
          text={welText}
          className="text-2xl font-semibold text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>
      <RevealSection trigger="load">
        <div className="prof-cont">{content}</div>
      </RevealSection>
      <Self />
      <RevealSection trigger="load">
        <div className="cont-fr">
          <FadeContent
            className="fr"
            blur={true}
            duration={1500}
            easing="ease-out"
            initialOpacity={0}
          >
            <h3 className="name">Freelance On:</h3>
            <ul>
              {FO && FO.length > 0 ? (
                FO.map((obj, index) => {
                  return (
                    <li key={index}>
                      <a
                        style={{ textDecoration: "none", color: "white" }}
                        href={obj.FOL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {obj.FOI}
                      </a>
                    </li>
                  );
                })
              ) : (
                <p
                  style={{
                    color: "red",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  No link Available
                </p>
              )}
            </ul>
          </FadeContent>
        </div>
      </RevealSection>
      <Footer />
    </div>
  ) : (
    <AnimatedLayout visible={true} />
  );
}
export default Home;
