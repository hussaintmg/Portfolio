import React, { useContext } from "react";
import { MainDataContext } from "../../context/MainDataContext";

function Prof_3() {
  const { Prof } = useContext(MainDataContext);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg
        width="200"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <circle cx="100" cy="200" r="90" fill="rgb(37,36,36)" />
        <defs>
          <clipPath id="circle-clip">
            <ellipse cx="100" cy="165" rx="102" ry="126"></ellipse>
          </clipPath>
        </defs>
        <image
          href={`${apiUrl}${Prof}`}
          width="200"
          height="250"
          x="0"
          y="50"
          clipPath="url(#circle-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
}

export default Prof_3;
