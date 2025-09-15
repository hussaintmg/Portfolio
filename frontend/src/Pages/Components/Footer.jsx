import React from "react";
import "../SCSS/Footer.scss";
import { useContext } from "react";
import { MainDataContext } from "../../context/MainDataContext";

import RevealSection from "../Components/RevealSection";
function Footer() {
  const {
    logo,
    EmailIcon,
    EmailT,
    PhoneIcon,
    PhoneNumber,
    AddressI,
    AddressT,
    socials,
  } = useContext(MainDataContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  console.log(socials);

  const contacts = [
    { text: EmailT, img: `${apiUrl}${EmailIcon}`, shape: "circle", colour: "white" },
    {
      text: PhoneNumber,
      img: `${apiUrl}${PhoneIcon}`,
      shape: "circle",
      colour: "white",
    },
    { text: AddressT, img: `${apiUrl}${AddressI}`, shape: "circle", colour: "white" },
  ];

  return (
    <RevealSection trigger="scroll">
      <div className="footer">
        <div className="logo">
          <img src={`${apiUrl}${logo}`} alt="logo" />
        </div>
        <div className="txt">
          <div className="contacts">
            <h2>Contact:</h2>
            <div className="content">
              {contacts.map((item, index) => (
                <div className="item" key={index}>
                  <div
                    className={"img " + item.shape}
                    style={{ background: item.bg }}
                  >
                    <img src={item.img} alt={item.text} />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="social">
            <h2>Social Media:</h2>
            <div className="content">
              {socials.map((social, index) => (
                <div className="item" key={index}>
                  <div
                    className={"img " + social.shape}
                    style={{ background: social.colour }}
                  >
                    <img src={`${apiUrl + social.image}`} alt="icon" />
                  </div>
                  <span>{social.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
export default Footer;
