const express = require("express");
const router = express.Router();
const {userById} = require("../controllers/user")
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth")

router.get("/secret/:userID", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({user: req.profile})
})
router.param("userID", userById)

module.exports = router