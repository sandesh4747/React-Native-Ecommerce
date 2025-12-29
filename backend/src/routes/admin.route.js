import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardingStats,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

//optimization -DRY
router.use(protectRoute, adminOnly);
router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardingStats);

//PUT: Used ofr full resource replacement, updating the entire resource
//PATCH: Used for partial resource update, updating only specific fields of a resource

export default router;
