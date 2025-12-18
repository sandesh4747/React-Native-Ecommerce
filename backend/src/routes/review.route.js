import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";
const router = express.Router();

router.post("/", protectRoute, createReview);
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;
