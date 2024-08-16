import { FC } from "react";
import "./style.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
  style?: React.CSSProperties;
}

const Skeleton: FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  circle = false,
  style,
}) => {
  return (
    <div
      className={`skeleton ${circle ? "skeleton-circle" : ""}`}
      style={{ width, height, ...style }}
    ></div>
  );
};

export default Skeleton;
