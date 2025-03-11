// src/components/Body.jsx
import React from "react";
import "../styles/App.css";

const Body = ({ children }) => {
  return (
    <section className="body-content">
      <div className="inner-content">{children}</div>
    </section>
  );
};

export default Body;
