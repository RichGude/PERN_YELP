import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RestContext } from '../context/RestContext';
import restFinder from '../apis/restFinder';
import Modal from "./Modal";
import StarRating from './StarRating';

const RestList = (props) => {
    const { restaurants, setRestaurants } = useContext(RestContext);

    // Define a state for showing a pop-up modal when editing individual data
    const [ showModal, setShowModal ] = useState(false);
    // Define a state for saving the id of the restaurant information to appear in the update model
    const [ restID, setRestID ] = useState(1)

    // represents the history of the browser (used for changing urls)
    let navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // The axios get request is added to the baseURL value
                const response = await restFinder.get("/");
                setRestaurants(response.data.data);
            } catch (e) {
                console.log(e);
            };
        };
        fetchData();
    }, []);

    // Define function for rendering the rating of each restaurants as stars on each line
    const renderRating = (restaurant) => {
        if (!restaurant.count) {
            return <span className="text-warning">0 reviews</span>;
        } else {
            return (<>
                <StarRating rating={restaurant.average_rating} />
                <span className="text-warning ml-1">({restaurant.count})</span>
            </>);
        }
        
    }

    const handleDelete = async (e, id) => {
        // Stop button click from triggering row click (moving to detail page)
        e.stopPropagation();
        try {
            const response = await restFinder.delete(`/${id}`);
            console.log("Restaurant successfully deleted");
            setRestaurants(restaurants.filter(restaurant => {
                return restaurant.id !== id;
            }));
        } catch (e) {
            console.log(e);
        };
    };

    // Update Function: Open modal and fill with current restaurant data and push changes
    const handleUpdate = (e, id) => {
        // Stop button click from triggering row click (moving to detail page)
        e.stopPropagation();

        setRestID(id);
        setShowModal(!showModal);
    };

    // Define a function for navigating to a detail page when a user selects an individual row
    const handleRestSelect = (id) => {
        navigate(`/restaurants/${id}`);
    }
    console.log(restaurants);

    return (
        <div> 
        <table className="table table-hover table-dark">
            <thead className='bg-primary'>
                <tr className='bg-primary'>
                <th scope="col">Restaurant</th>
                <th scope="col">Location</th>
                <th scope="col">Price Range</th>
                <th scope="col">Rating</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                {/* If restaurants exists, run the rest of the code */}
                {restaurants && restaurants.map(elem => { return (
                    // Always pass in an ID to each element
                    <tr onClick={() => handleRestSelect(elem.id)} key={elem.id}>
                        <td>{elem.name}</td>
                        <td>{elem.location}</td>
                        <td>${"$".repeat(elem.price_range)}</td>
                        <td>{renderRating(elem)}</td>
                        <td><button onClick={(e) => handleUpdate(e, elem.id)} className='btn btn-warning'>Update</button></td>
                        {/* Must include the arrow function (a reference to a function) to prevent function immediately running */}
                        <td><button onClick={(e) => handleDelete(e, elem.id)} className='btn btn-danger'>Delete</button></td>
                    </tr>
                )})}
            </tbody>
        </table>
        <Modal showModal={showModal} setShowModal={setShowModal} restID={restID} />
        </div>
    );
};

export default RestList;