import React, { useContext } from "react";
import "../SCSS/Self.scss";
import ShinyText from "./ShinyText";
import { MainDataContext } from "../../context/MainDataContext";

function Self() {
  const { MSB, MS } = useContext(MainDataContext);
  return (
    <ShinyText
      text={
        <>
          <strong className="name">{MSB}</strong> {MS}
        </>
      }
      disabled={false}
      speed={3}
      className="custom-class"
    />
  );
}
export default Self;
