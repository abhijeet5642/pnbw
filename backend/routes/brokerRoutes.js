// backend/routes/brokerRoutes.js
import express from 'express';
import { getBrokerDashboardData } from '../controllers/brokerController.js';
import { protect, broker } from '../middleware/auth.js'; 

const router = express.Router();

// ✅ CORRECTED: Removed the unnecessary '/add' segment
router.route('/:id/dashboard').get(protect, broker, getBrokerDashboardData);

export default router;