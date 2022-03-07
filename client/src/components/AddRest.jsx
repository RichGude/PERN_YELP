import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import restFinder from '../apis/restFinder';
import { RestContext } from '../context/RestContext';

const AddRest = () => {
    // Set state values for each new entry variable
    const [ name, setName ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ price_range, setPriceRange ] = useState("Price Range");

    const { addRestaurants } = useContext(RestContext)

    // Define a function for submit new additions to the database
    const handleSubmit = async (e) => {
        // Prevent the page from automoatically reloading on form submit (loses State)
        e.preventDefault();
        try {
            // Post new entries to the Pool baseURL
            const response = await restFinder.post("/", {
                name: name,
                location: location,
                price_range: price_range
            });
            addRestaurants(response.data.data);
            console.log("Post successfully added");
        } catch (e) {
            console.log(e);
        };
    };

    return (
        <div className='mb-4'>
            <form onSubmit={handleSubmit} className='form-inline' action="">
                <div className="row">
                    <div className="col mb-2">
                        <input value={name} onChange={e => setName(e.target.value)} type="text" className='form-control' placeholder='Name'/>
                    </div>
                    <div className="col mb-2">
                        <input value={location} onChange={e => setLocation(e.target.value)} type="text" className='form-control' placeholder='Location' />
                    </div>
                    <div className="col mb-2">
                        <select value={price_range} onChange={e => setPriceRange(e.target.value)} className='custom-select my-1 mr-sm-2'>
                            <option disabled>Price Range</option>
                            <option value='1'>$</option>
                            <option value='2'>$$</option>
                            <option value='3'>$$$</option>
                            <option value='4'>$$$$</option>
                            <option value='5'>$$$$$</option>
                        </select>
                    </div>
                    <button type="submit" className='btn btn-dark col'>Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddRest;