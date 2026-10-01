import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
    getUsersDetails,
    addUsers,
    updateUsersDetails,
    deleteUser,
    activateUser,
    deactivateUser,
    getUserActivity,
    getUserById
} from "../controllers/users.controller.js"
const router = express.Router();

// Only the company Admin manages staff/users. Franchise logins are a single,
// non-delegable seat per location and must never be able to add, view, edit,
// activate/deactivate, or delete users.
router.get("/", protect, authorize("admin"), getUsersDetails);

router.get("/:id", protect, authorize("admin"), getUserById);

router.post("/", protect, authorize("admin"), addUsers);

router.patch("/:id/activate", protect, authorize("admin"), activateUser);

router.patch("/:id/deactivate", protect, authorize("admin"), deactivateUser);

router.put("/:id", protect, authorize("admin"), updateUsersDetails);

router.delete("/:id", protect, authorize("admin"), deleteUser);

router.get("/:id/activity", protect, authorize("admin"), getUserActivity);

export default router;