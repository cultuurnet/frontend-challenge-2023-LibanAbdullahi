import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;
const API_BASE_URL = process.env.API_BASE_URL;
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;

// Set default headers for Axios
axios.defaults.headers.common["Authorization"] = `Bearer ${USER_ACCESS_TOKEN}`;
axios.defaults.headers.common["X-Api-Key"] = API_KEY;

app.use(bodyParser.json());

app.use(cors());

app.get("/api/labels", async (req, res, next) => {
  try {
    const query = req.query.query;
    const response = await axios.get(
      `${API_BASE_URL}/labels/?limit=6&query=${query}&start=0&suggestion=true`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching labels:", error);
    next(error);
  }
});
// Add a new label
app.put("/api/events/:eventId/labels/:labelName", async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const labelName = req.params.labelName;
    const decodedLabelName = decodeURIComponent(labelName); // Decode once

    const encodedLabelName = encodeURIComponent(decodedLabelName);

    const apiUrl = `${API_BASE_URL}/events/${eventId}/labels/${encodedLabelName}`;

    const response = await axios.put(
      apiUrl,
      null // No request body needed for PUT
    );

    if (response.ok) {
      res.status(204).end(); // No Content. The label has been added successfully.
    } else {
      res.status(response.status).json({ error: "Label addition failed" });
    }
  } catch (error) {
    console.error(
      "Error adding label:",
      error.response ? error.response.data : error.message
    );
    next(error);
  }
});

// Delete label
app.delete("/api/events/:eventId/labels/:labelName", async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const labelName = req.params.labelName;
    const decodedLabelName = decodeURIComponent(labelName);
    const encodedLabelName = encodeURIComponent(decodedLabelName);

    const apiUrl = `${API_BASE_URL}/events/${eventId}/labels/${encodedLabelName}`;

    const response = await axios.delete(apiUrl);

    if (response.ok) {
      res.status(204).end(); // No Content. The label has been removed successfully.
    } else {
      res.status(response.status).json({ error: "Label removal failed" });
    }
  } catch (error) {
    console.error(
      "Error deleting label:",
      error.response ? error.response.data : error.message
    );
    next(error);
  }
});

//event details
app.get("/api/events/:eventId", async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const apiUrl = `${API_BASE_URL}/events/${eventId}`;

    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      // Successful fetch of event details
      res.json(response.data);
    } else {
      res
        .status(response.status)
        .json({ error: "Failed to fetch event details" });
    }
  } catch (error) {
    console.error(
      "Error fetching event details:",
      error.response ? error.response.data : error.message
    );
    next(error);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "An unexpected error occurred. Please try again later." });
});

app.listen(port, () => {
  console.log(`API proxy server listening on port ${port}`);
});
