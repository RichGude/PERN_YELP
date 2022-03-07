import React, {useState, createContext} from "react";

export const RestContext = createContext();

export const RestContextProvider = props => {
    // State objects are defined with an initial value and a name for change that value
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState([]);

    const addRestaurants = (restaurant) => {
        setRestaurants([...restaurants, restaurant])
    };

    return (
        // Setting a object with a key and value with the same name only requires typing the name once
        <RestContext.Provider value={{ restaurants, setRestaurants, addRestaurants, selectedRestaurant, setSelectedRestaurant }}>
            {props.children}
        </RestContext.Provider>
    )
}