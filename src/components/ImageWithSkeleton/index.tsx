import React, { useState } from "react";
import Skeleton from "../Skeleton";

interface ImageWithSkeletonProps {
  src: string;
  width: number | string;
  height: number | string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div style={{ width, height, position: "relative" }}>
      {!isLoaded && <Skeleton width={`${width}px`} height={`${height}px`} />}
      <img
        src={src}
        width={width}
        height={height}
        style={{ display: isLoaded ? "block" : "none" }}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImageWithSkeleton;
