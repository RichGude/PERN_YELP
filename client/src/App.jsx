import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './routes/Home';
import RestDetailPage from './routes/RestDetailPage';
import { RestContextProvider } from './context/RestContext';

const App = () => {
    return (
        <RestContextProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/restaurants/:id" element={<RestDetailPage />} />
            </Routes>
        </Router>
        </RestContextProvider>
    )
}

export default App;