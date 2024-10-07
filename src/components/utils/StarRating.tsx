import React from 'react';
import './starRating.css';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const MAX_STARS = 5;

  const percentage = (rating / MAX_STARS) * 100;

  return (
    <>
        <div className="star-rating">
            <div className="star-rating-background">
                {Array.from({ length: MAX_STARS }, (_, i) => (
                <span key={i} className="star">★</span>
                ))}
            </div>
            <div
                className="star-rating-filled"
                style={{ width: `${percentage}%` }}
            >
                {Array.from({ length: MAX_STARS }, (_, i) => (
                <span key={i} className="star">★</span>
                ))}
            </div>
        </div>
        {/* <div className="star-rating-value">{rating}</div> */}
    </>
  );
};

export default StarRating;
