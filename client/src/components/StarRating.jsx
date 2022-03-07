import React from 'react';

const StarRating = ({rating}) => {
    const stars = [];
    // Count up from 1 to 5 adding a star to our array each time 'rating' is greater than the count
    for (let  i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className='fas fa-star text-warning'></i>);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            // Whenever the rating is any decimal, return a half-star
            stars.push(<i key={i} className='fas fa-star-half-alt text-warning'></i>);
        } else {
            // Add an empty star whenever the rating doesn't meet the requirement
            stars.push(<i key={i} className='far fa-star text-warning'></i>);
        }
    }
    return (
        <>
            {stars}
        </>
    );
};

export default StarRating;