const express = require("express");
const router = express.Router();
const { userById, read, update } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.get("/secret/:userID", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({ user: req.profile });
});

router.get("/:userID", requireSignin, isAuth, isAdmin, read);
router.put("/:userID", requireSignin, isAuth, isAdmin, update);
router.param("userID", userById);

module.exports = router;
