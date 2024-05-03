import React, { useState } from "react";
import PropTypes from "prop-types";

function StarRating({ rating, onRatingChange }) {
  const arr = [1, 2, 3, 4, 5];
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseOver = (star) => {
    setHoveredRating(star);
  };

  const handleMouseOut = () => {
    setHoveredRating(0);
  };

  const handleRatingClick = (star) => {
    onRatingChange(star);
  };

  return (
    <div className="star-rating">
      {arr.map((star) => (
        <div key={star}>
          <button
            title="rating"
            type="button"
            className={`star ${
              star <= (hoveredRating || rating)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
            onMouseOver={() => handleMouseOver(star)}
            onMouseOut={handleMouseOut}
            onClick={() => handleRatingClick(star)}
            onFocus={() => handleMouseOver(star)}
            onBlur={handleMouseOut}
          >
            ★
          </button>
        </div>
      ))}
      <span className="rating-label text-lg ml-4">{rating}</span>
    </div>
  );
}

export default StarRating;

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

