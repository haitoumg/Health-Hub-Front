import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Legend = ({ colors , descriptions}) => {
  const legendContainerRef = document.createElement("div");
  legendContainerRef.style.display = "flex";

  legendContainerRef.setAttribute("id", "all");
  useEffect(() => {
    // const scheduler = window.scheduler; // Assuming you have the scheduler object available in the global scope

    if (legendContainerRef.current) {
      // Clear existing legend items
      while (legendContainerRef.current.firstChild) {
        legendContainerRef.current.firstChild.remove();
      }
        let i=0;
      // Create a legend item for each color
      colors.forEach((color) => {
        const legendItem = document.createElement("div");
        legendItem.style.display = "flex";
        legendItem.style.alignItems = "center";

        const colorBox = document.createElement("div");
        colorBox.style.width = "20px";
        colorBox.style.height = "20px";
        colorBox.style.backgroundColor = color;
        legendItem.appendChild(colorBox);

        const label = document.createElement("span");
        label.style.marginLeft = "5px";
        label.innerText = descriptions[i];
        legendItem.appendChild(label);
        i++;
        legendContainerRef.current.appendChild(legendItem);
      });
    }
  }, [colors]);

  return <div ref={legendContainerRef} style={{ display: 'flex', gap:'40px', justifyContent: 'center', paddingTop: '20px', paddingBottom: '20px' }} />;};

Legend.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Legend;
