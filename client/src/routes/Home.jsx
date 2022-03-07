import React from 'react';
import Header from '../components/Header';
import AddRest from '../components/AddRest';
import RestList from '../components/RestList';

const Home = () => {
    return (
        <div>
            <Header />
            <div className="container">
                <AddRest />
                <RestList />
            </div>
        </div>
    );
};

export default Home;