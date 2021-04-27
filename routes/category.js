const express = require("express");
const router = express.Router();
const { create } = require("../controllers/category");
const {userById} = require("../controllers/user")
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth")

router.post("/create/:userID", requireSignin, isAuth, isAdmin, create);
router.param("userID", userById)

module.exports = router;
