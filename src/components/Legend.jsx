import React from "react";
import "./Legend.css";

const Legend = ({ colors }) => {
  return (
    <div className="legend-box">
      <div className="legend-contents">Legend</div>
      {colors.map((c, i) => (
        <div key={i * 10} style={{ color: `${c.color}` }}>
          {c.label}
        </div>
      ))}
    </div>
  );
};

export default Legend;
