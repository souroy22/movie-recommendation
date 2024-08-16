import React from "react";
import "./style.css";

interface BackdropProps {
  isLoading: boolean;
}

const Backdrop: React.FC<BackdropProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="backdrop">
      <div className="loader"></div>
    </div>
  );
};

export default Backdrop;
