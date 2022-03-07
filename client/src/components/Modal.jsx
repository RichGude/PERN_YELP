import React, {useRef, useState, useContext, useEffect, useCallback } from 'react';
import { useSpring, animated } from "react-spring";
import restFinder from '../apis/restFinder';
import { RestContext } from '../context/RestContext';


const Modal = ({ showModal, setShowModal, restID }) => {
    // Call upon the restaurants state object from within Modal
    const { restaurants, setRestaurants } = useContext(RestContext);

    // Define internal state variables to use
    const [ name, setName] = useState("");
    const [ location, setLocation ] = useState("");
    const [ price_range, setPriceRange ] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // Get data about the restaurant highlighted
            const response = await restFinder.get(`/${restID}`);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);
        };
        fetchData();
    }, [showModal]);

    // Define function for modal submit
    const handleSubmit = async (e) => {
        // Don't reload page on submit
        e.preventDefault();
        // Update database
        const updateRestaurant = await restFinder.put(`/${restID}`, {
            name: name, // Can also be written as just 'name' if input and output are identical
            location,
            price_range
        });

        // Update restaurants context so table show new results
        const updateRest = {id: restID, name, location, price_range};
        setRestaurants(restaurants.map(el => el.id === updateRest.id ? updateRest : el));

        // Don't show modal after submit
        setShowModal(!showModal);
    };
    
    // Close Modal is clicking on the background (i.e., outside the modal)
    const modalRef = useRef();
    const closeModal = e => {
        if(modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    // Set use to dismiss Modal on 'esc' key press
    const keyPress = useCallback(e => {
        if(e.key === 'Escape' && showModal) {
            setShowModal(false);
        }
    }, [ setShowModal, showModal ])

    useEffect(() => {
        document.addEventListener('keydown', keyPress);
        return () => document.removeEventListener('keydown', keyPress)
    }, [keyPress])

    // Need fade in and out for modal on every showModal change except initial render
    const firstRender = useRef(true);
    useEffect(() => {
        if ( firstRender.current ) {
            firstRender.current = false
        } else {
            modalRef.current.className = showModal ? 'backFadeIn' : 'back FadeOut';
        }
    }, [showModal])

    return (
        <div className='back' ref={modalRef} onClick={closeModal}>
            <div className='ModalWrapper'>
                <div className='ModalContent'>
                    <h1>Update Restaurant</h1>
                    <form action="">
                        <div className='form-group'>
                            <label htmlFor="name">Name</label>
                            <input id='name' value={name} onChange={e => setName(e.target.value)} className='form-control' type="text" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="location">Location</label>
                            <input id='location' value={location} onChange={e => setLocation(e.target.value)} className='form-control' type="text" />
                        </div>
                        <div className="form-group">
                            <select value={price_range} onChange={e => setPriceRange(e.target.value)} className='custom-select my-1 mr-sm-2'>
                                <option disabled>Price Range</option>
                                <option value='1'>$</option>
                                <option value='2'>$$</option>
                                <option value='3'>$$$</option>
                                <option value='4'>$$$$</option>
                                <option value='5'>$$$$$</option>
                            </select>
                        </div>
                        <button type="submit" onClick={handleSubmit} className='btn btn-dark'>Add</button>
                    </form>
                </div>
                <button className='CloseModalButton' aria-label='Close Modal' onClick={() => setShowModal(!showModal)}><i className='fa fa-times' /></button>
            </div>
        </div>
    );
};

export default Modal;