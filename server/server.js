/*
This file contains all of the express app, middleware, and route commands for the Application

This file is designed to work with a PostGRES database named 'pern' operating with a table, 
'restaurants'.
*/

// Load libraries
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");

// Initialize an instance of express
const app = express();

// Middleware for allowing CORS access between server and client
app.use(cors())
// Middleware for logging server requests to the console
app.use(morgan("dev"));
// Middleware for attaching post 'body' information to the request (so the app can retrieve and use)
app.use(express.json());

//### Define HTTP requests to the app (the request and response variables are automatically stored) ###//
// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    // Any function with a promise (like 'query') can utilize the async/await keywords
    try {
        const str_query = "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) \
            AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id;";
        // Get all restaurants and aggregated review information
        const results = await db.query(str_query);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: results.rows
        });
    } catch (e) {
        console.log(e);
    }
});

// Get one restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // Utilize parameterized queries to protect against injection vulnerabilities
        const rest_results = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), \
            TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id \
            = reviews.restaurant_id WHERE restaurants.id = $1;", [id]);

        // Make a second call to get restaurant reviews
        const reviews_results = await db.query(`SELECT * FROM reviews WHERE restaurant_id = $1;`, [id]);
        
        res.status(200).json({
            status: "success",
            results: rest_results.rows.length,
            data: {
                restaurant: rest_results.rows[0],
                reviews: reviews_results.rows

            }
        });
    } catch (e) {
        console.log(e);
    }
});

// Create one restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    try {
        const str_query = "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *;";
        // Utilize parameterized queries to protect against injection vulnerabilities
        const results = await db.query(str_query, [req.body.name, req.body.location, req.body.price_range]);
        res.status(201).json({
            status: "success",
            results: results.rows.length,
            data: results.rows[0]
        });
    } catch (e) {
        console.log(e);
    }
});

// Update one restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const str_query = "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4RETURNING *;";
        // Utilize parameterized queries to protect against injection vulnerabilities
        const results = await db.query(str_query, [req.body.name, req.body.location, req.body.price_range, req.params.id]);
        res.status(201).json({
            status: "success",
            results: results.rows.length,
            data: results.rows[0]
        });
    } catch (e) {
        console.log(e);
    }
});

// delete one restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id])
    res.status(204).json({
        status: "success"
    });
});

// Add a restaurant review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
        const str_query = "INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) RETURNING *;";
        // Utilize parameterized queries to protect against injection vulnerabilities
        const newReview = await db.query(str_query, [req.params.id, req.body.name, req.body.review, req.body.rating]);
        res.status(201).json({
            status: "success",
            data: newReview.rows[0]
        });
    } catch (e) {
        console.log(e);
    }
});

// Load app port value from local .env file
const port = process.env.PORT || 3001;

// Specify a port on which the app will listen for requests and a callback functions that runs when the
//   app initializes successfully running
app.listen(port, () => {
    console.log(`Express Server is runnning on Port ${port}`);
})