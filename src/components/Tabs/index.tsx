import { FC } from "react";
import "./style.css";

type PROP_TYPES = {
  options: string[];
  activeTab: string;
  handleClick: (value: string) => void;
};

const Tabs: FC<PROP_TYPES> = ({ options, activeTab, handleClick }) => {
  return (
    <div className="tabs-container">
      <div className="tabs">
        {options.map((option) => (
          <div
            key={option}
            className={`tab ${activeTab === option ? "active" : ""}`}
            onClick={() => handleClick(option)}
          >
            {option}
          </div>
        ))}
        {/* Underline element */}
        <div
          className="underline"
          style={{
            transform: `translateX(${options.indexOf(activeTab) * 92}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Tabs;
