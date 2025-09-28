import React from "react";
import "../SCSS/AnimatedLayout.scss";

export default function AnimatedLayout({visible}) {
  return (
    <div className="fullscreen-overlay"  style={{ display: visible ? "flex" : "none" }}>

      <div className="sq-rect"></div>

      
      <div className="top-rectangles">
        <div className="rect"></div>
        <div className="rect"></div>
        <div className="rect"></div>
      </div>
     <div className="ani-circle"></div>
     <div className="gap"></div>
      
      <div className="middle-rect"></div>

      
      <div className="row-rects">
        <div className="row-rect"></div>
        <div className="row-rect"></div>
      </div>

      
      <div className="bottom-rect"></div>
    </div>
  );
}
