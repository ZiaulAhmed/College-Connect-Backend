// routes/announcementRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  setApproval,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

// Public listing - optional_user can be set by frontend to include token if available
router.get("/", protect, getAnnouncements); // protect used so req.user may be available; if no token, protect returns 401 — if you prefer public access without token use a different middleware. See note below.

// If you want true public access (no token needed), replace the above with:
// router.get("/", getAnnouncements);

router.get("/:id", protect, getAnnouncementById);

// Create (faculty or admin)
router.post("/", protect, allowRoles("faculty", "admin"), createAnnouncement);

// Admin approve/unapprove
router.patch("/:id/approve", protect, allowRoles("admin"), setApproval);

// Update (author or admin)
router.put("/:id", protect, updateAnnouncement);

// Delete (author or admin)
router.delete("/:id", protect, deleteAnnouncement);

module.exports = router;
