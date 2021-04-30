const express = require("express");
const router = express.Router();
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
} = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/create/:userID", requireSignin, isAuth, isAdmin, create); // create product
router.get("/:productID", read); // read on product
router.delete("/:productID/:userID", requireSignin, isAuth, isAdmin, remove); // delete one product
router.put("/:productID/:userID", requireSignin, isAuth, isAdmin, update); // edit one product
router.get("/", list); // view list of products
router.get("/related/:productID", listRelated); // view all related products
router.get("/category/list", listCategories); // View distinct categories
router.post("/by/search", listBySearch); // View all product searched for
router.get("/photo/:productID", photo); //get product photo as a middleware

//param middlewares
router.param("userID", userById); // middleware to get profile of user from the userID
router.param("productID", productById); // middleware to get product from the productID
module.exports = router;
