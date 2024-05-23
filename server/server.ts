import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const API_BASE_URL = process.env.API_BASE_URL || "";
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN || "";
const API_KEY = process.env.API_KEY || "";

axios.defaults.headers.common["Authorization"] = `Bearer ${USER_ACCESS_TOKEN}`;
axios.defaults.headers.common["X-Api-Key"] = API_KEY;

app.use(bodyParser.json());
app.use(cors());

app.get(
  "/api/labels",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/labels/?limit=6&query=${req.query.query}&start=0&suggestion=true`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
      next(error);
    }
  }
);

// Add a new label
app.put(
  "/api/events/:eventId/labels/:labelName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = req.params.eventId;
      const labelName = req.params.labelName;
      const decodedLabelName = decodeURIComponent(labelName);
      const encodedLabelName = encodeURIComponent(decodedLabelName);

      const apiUrl = `${API_BASE_URL}/events/${eventId}/labels/${encodedLabelName}`;

      const response = await axios.put(apiUrl, null);

      if (response.status >= 200 && response.status < 300) {
        res.status(204).end();
      } else {
        res.status(response.status).json({ error: "Label addition failed" });
      }
    } catch (error) {
      console.error("Error adding label:", error);
      next(error);
    }
  }
);

// Delete label
app.delete(
  "/api/events/:eventId/labels/:labelName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = req.params.eventId;
      const labelName = req.params.labelName;
      const decodedLabelName = decodeURIComponent(labelName);
      const encodedLabelName = encodeURIComponent(decodedLabelName);

      const apiUrl = `${API_BASE_URL}/events/${eventId}/labels/${encodedLabelName}`;

      const response = await axios.delete(apiUrl);

      if (response.status >= 200 && response.status < 300) {
        res.status(204).end();
      } else {
        res.status(response.status).json({ error: "Label removal failed" });
      }
    } catch (error) {
      console.error("Error deleting label:", error);
      next(error);
    }
  }
);

// Event details
app.get(
  "/api/events/:eventId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = req.params.eventId;
      const apiUrl = `${API_BASE_URL}/events/${eventId}`;

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        res.json(response.data);
      } else {
        res
          .status(response.status)
          .json({ error: "Failed to fetch event details" });
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      next(error);
    }
  }
);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res
    .status(500)
    .json({ error: "An unexpected error occurred. Please try again later." });
});

app.listen(port, () => {
  console.log(`API proxy server listening on port ${port}`);
});
