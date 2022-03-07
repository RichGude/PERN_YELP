import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import restFinder from '../apis/restFinder';
import AddReview from '../components/AddReview';
import Reviews from '../components/Reviews';
import StarRating from '../components/StarRating';
import { RestContext } from '../context/RestContext';

const RestDetailPage = () => {
    // Grab id from URL
    const {id} = useParams();

    //Import RestContext methods
    const { selectedRestaurant, setSelectedRestaurant } = useContext(RestContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await restFinder.get(`/${id}`);
                setSelectedRestaurant(response.data.data);
            } catch (err) {
                console.log(err);
            };};
        fetchData();
    }, []);

    return (
        <div className="container">
            {selectedRestaurant && selectedRestaurant.restaurant && (<>
                <h1 className="text-center display-1">{selectedRestaurant.restaurant.name}</h1>
                <div className="text-center">
                    <StarRating rating={selectedRestaurant.restaurant.average_rating} />
                    <span className="text-warning ml-1">
                        {selectedRestaurant.restaurant.count ? `(${selectedRestaurant.restaurant.count})` : "(0)"}
                    </span>
                </div>
                <div className="mt-3">
                    <Reviews reviews={selectedRestaurant.reviews} />
                </div>
                <AddReview />
            </>)}
        </div>
    );
};

export default RestDetailPage;