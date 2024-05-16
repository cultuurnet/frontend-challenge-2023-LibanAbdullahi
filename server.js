import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;
const API_BASE_URL = "https://io-test.uitdatabank.be";
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const EVENT_ID = process.env.EVENT_ID;

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/labels/?limit=6&query=hello&start=0&suggestion=true`,
      {
        headers: {
          Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
          "X-Api-Key": API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw error;
  }
};

app.use(bodyParser.json());

app.use(cors());

app.get("/api/labels", async (req, res) => {
  try {
    const labels = await fetchData(req.query.query);
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch labels" });
  }
});

// Add a new label
app.put("/api/events/:eventId/labels/:labelName", async (req, res) => {
  try {
    let labelName = req.params.labelName;
    labelName = decodeURIComponent(labelName); // Decode once

    const encodedLabelName = encodeURIComponent(labelName);

    const apiUrl = `${API_BASE_URL}/events/${EVENT_ID}/labels/${encodedLabelName}`;

    const response = await axios.put(
      apiUrl,
      null, // No request body needed for PUT
      {
        headers: {
          Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
          "X-Api-Key": API_KEY,
        },
      }
    );

    if (response.status === 204) {
      res.status(204).end(); // No Content. The label has been added successfully.
    } else {
      res.status(response.status).json({ error: "Label addition failed" });
    }
  } catch (error) {
    console.error(
      "Error adding label:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Server error" });
  }
});

// Delete label
app.delete("/api/events/:eventId/labels/:labelName", async (req, res) => {
  try {
    let labelName = req.params.labelName;
    labelName = decodeURIComponent(labelName);
    const encodedLabelName = encodeURIComponent(labelName);

    const apiUrl = `${API_BASE_URL}/events/${EVENT_ID}/labels/${encodedLabelName}`;

    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
        "X-Api-Key": API_KEY,
      },
    });

    if (response.status === 204) {
      res.status(204).end(); // No Content. The label has been removed successfully.
    } else {
      res.status(response.status).json({ error: "Label removal failed" });
    }
  } catch (error) {
    console.error(
      "Error deleting label:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Server error" });
  }
});

//event details
app.get("/api/events/:eventId", async (req, res) => {
  try {
    const apiUrl = `${API_BASE_URL}/events/${EVENT_ID}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
        "X-Api-Key": API_KEY,
      },
    });

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
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`API proxy server listening on port ${port}`);
});
