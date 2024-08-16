import { FC } from "react";
import "./style.css";

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: FC<SpinnerProps> = ({ size = "40px", color = "#000" }) => {
  return (
    <div
      className="spinner"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent ${color} transparent`,
      }}
    ></div>
  );
};

export default Spinner;
