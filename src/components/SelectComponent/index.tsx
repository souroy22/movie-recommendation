import { FC } from "react";
import { CATEGORY_TYPE } from "../../App";
import "./style.css";

interface SelectProps {
  options: CATEGORY_TYPE[];
  placeholder?: string;
  onChange?: (value: string) => void;
  selectedCategory: number | string;
  isDisabled?: boolean;
}

const SelectComponent: FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  selectedCategory,
  onChange,
  isDisabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (onChange) onChange(value);
  };

  return (
    <div className="select-container">
      <select
        value={selectedCategory}
        onChange={handleChange}
        className="select"
        disabled={isDisabled}
      >
        <option value="" disabled className="placeholder">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
