import React, { useState } from "react";
import "./SortDropDown.css";

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleHover = () => {
    setIsOpen(true);
  };

  const handleLeave = () => {
    setIsOpen(false);
  };

  const handleSortOptionChange = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      className="sort-dropdown"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      Sort by{" "}
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleSortOptionChange("")}> Default </li>{" "}
          <li onClick={() => handleSortOptionChange("recent")}>
            {" "}
            Recent Date{" "}
          </li>{" "}
          <li onClick={() => handleSortOptionChange("old")}> Old Date </li>{" "}
        </ul>
      )}{" "}
    </div>
  );
};

export default SortDropdown;
