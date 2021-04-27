const express = require("express");
const router = express.Router();
const { create, productById, read, remove, update } = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/create/:userID", requireSignin, isAuth, isAdmin, create);
router.get("/:productID", read);
router.delete("/:productID/:userID", requireSignin, isAuth, isAdmin, remove);
router.put("/:productID/:userID", requireSignin, isAuth, isAdmin, update)
router.param("userID", userById);
router.param("productID", productById);
module.exports = router;
