import { FC } from "react";
import ImageWithSkeleton from "../ImageWithSkeleton";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import { customLocalStorage } from "../../utility/customLocalStorage";
import { MOVIE_TYPE } from "../../App";
import "./style.css";

export const isFavMovie = (id: number) => {
  const movies: MOVIE_TYPE[] | null = customLocalStorage.getData("favMovies");
  if (movies) {
    for (let movie of movies) {
      if (movie.id === id) {
        return true;
      }
    }
  }
  return false;
};
interface MovieCardProps {
  imageUrl: string;
  title: string;
  rating: number; // Rating can be a decimal value, out of 10
  ratingCount: number;
  description: string;
  data: MOVIE_TYPE;
  handleClick: (value: MOVIE_TYPE) => void;
}

const MovieCard: FC<MovieCardProps> = ({
  imageUrl,
  title,
  rating,
  ratingCount,
  description,
  data,
  handleClick,
}) => {
  const STARS_COUNT = 10;

  // Function to render stars based on the rating value (including decimal points)
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= STARS_COUNT; i++) {
      const fillValue = rating - i + 1;

      // Add filled, half-filled, or empty star based on the fill value
      let className = "star";
      if (fillValue >= 1) {
        className += " filled";
      } else if (fillValue > 0 && fillValue < 1) {
        className += " half-filled";
      }

      stars.push(
        <span key={i} className={className}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="movie-card">
      <div className="movie-card__image-container">
        <ImageWithSkeleton
          src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/${imageUrl}`}
          width="100%"
          height={250}
        />
      </div>
      <div className="movie-card__content">
        <h2 className="movie-card__title">
          {title}
          <UseAnimations
            animation={heart}
            size={60}
            fillColor="red"
            color="#FFF"
            reverse={isFavMovie(data.id)}
            onClick={() => {
              handleClick(data);
            }}
            strokeColor={isFavMovie(data.id) ? "red" : "#FFF"}
            render={(eventProps, animationProps) => (
              <button
                {...eventProps}
                style={{
                  zIndex: "100",
                  background: "transparent",
                  border: "none",
                  width: "30px",
                  height: "30px",
                  color: "#FFF",
                  cursor: "pointer",
                }}
                type="button"
              >
                <div
                  {...animationProps}
                  style={{ width: "30px", height: "30px", color: "#FFF" }}
                />
              </button>
            )}
          />
        </h2>
        <div className="movie-card__rating">
          {renderStars()}
          <span className="movie-card__rating-count">
            ({ratingCount} ratings)
          </span>
        </div>
        <p className="movie-card__description">
          {description.length > 70
            ? description.slice(0, 70) + " ..."
            : description}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
