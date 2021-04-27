const express = require("express");
const router = express.Router();
const {
  create,
  categoryById,
  read,
  update,
  remove
} = require("../controllers/category");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/create/:userID", requireSignin, isAuth, isAdmin, create);
router.get("/:categoryID", read);
router.put("/:categoryID/:userID", requireSignin, isAuth, isAdmin, update);
router.delete("/:categoryID/:userID", requireSignin, isAuth, isAdmin, remove);
router.param("userID", userById);
router.param("categoryID", categoryById);

module.exports = router;
