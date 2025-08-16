import express from "express";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  getProperties,
  updateProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

router.route("/").get(getProperties).post(protect, admin, createProperty);
router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, admin, updateProperty)
  .delete(protect, admin, deleteProperty);

export default router;
