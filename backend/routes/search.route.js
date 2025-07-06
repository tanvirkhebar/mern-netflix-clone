import express from "express";
import {
  getSearchHistory,
  removeItemFromSearchHistory,
  searchMovie,
  searchPerson,
  searchTv,
} from "../controllers/search.controller.js";

const router = express.Router();

// Search routes
router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

// Search history routes
router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);

// Default 404 handler
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
