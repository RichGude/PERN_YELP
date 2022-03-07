import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import restFinder from '../apis/restFinder';

const AddReview = () => {

    const { id } = useParams();
    const [name, setName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("rating");

    let navigate = useNavigate();

    // Define function for post reviews to database
    const handleSubmitReview = async (e) => {
        // Prevent page reload
        e.preventDefault();
        try {
            // Submit a post request to the backend at the 'addReview' URL
            const response = await restFinder.post(`/${id}/addReview`, {
            name,
            review: reviewText,
            rating});
            // for ease of development, reload page to propagate new reviews
            navigate(0);
        } catch (e) {
            console.log(e);
        };
    }

    return (
        <div className='mb-2'>
            <form action="">
                <div className="form-row">
                    <div className="form-group col-8">
                        <label htmlFor="name">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" id="name" placeholder="name" className='form-control'/>
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="rating">Rating</label>
                        <select value={rating} onChange={e => setRating(e.target.value)} id="rating" className="custom-select">
                            <option disabled>Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="Review">Review</label>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} id="Review" className="form-control"></textarea>
                </div>
                <button type='submit' onClick={handleSubmitReview} className="btn btn-dark">Submit</button>
            </form>
            
        </div>
    );
};

export default AddReview;