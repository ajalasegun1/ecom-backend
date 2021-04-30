const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

exports.create = (req, res) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //If there is error uploading the file
    if (err) {
      return res.json({ error: err });
    }

    //handle the form input data
    const { name, description, price, category, shipping, quantity } = fields;
    console.log(name, description, price, category, shipping, quantity);
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.json({ error: "Please fill all fields" });
    }
    let product = new Product(fields);

    //handle files
    if (files.photo) {
      if (files.photo.size > 1000000) {
        //1000000 is size in kb = 1mb
        return res.json({
          error: {
            photo: "Image should not be more than 1mb",
          },
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    //save the product
    product.save((err, result) => {
      if (err) {
        return res.json({ error: err });
      }

      res.json(result);
    });
  });
};

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .then((product) => {
      req.product = product;
      next();
    })
    .catch((err) => {
      return res.json({ error: "Product not found" });
    });
};

exports.read = (req, res) => {
  req.product.photo = undefined; //We are setting this because it will make the size big
  res.json(req.product);
};

exports.remove = (req, res) => {
  Product.findByIdAndDelete(req.product.id)
    .then((product) => res.json({ deleted: product.id }))
    .catch(() => {
      return res.json("Something went wrong deleting the product...");
    });
};

exports.update = (req, res) => {
  //Product.findByIdAndUpdate(req.product.id, {})
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json({ error: "Unable to update..." });
    }
    const { name, description, price, category, shipping, quantity } = fields;
    console.log(name, description, price, category, shipping, quantity);
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.json({ error: "Please fill all fields" });
    }
    let pic,
      picType = null;
    //handle files
    if (files.photo) {
      if (files.photo.size > 1000000) {
        //1000000 is size in kb = 1mb
        return res.json({
          error: {
            photo: "Image should not be more than 1mb",
          },
        });
      }
      pic = fs.readFileSync(files.photo.path);
      picType = files.photo.type;
      //product.photo.data = fs.readFileSync(files.photo.path);
      //product.photo.contentType = files.photo.type;
    }
    if (pic === null || picType === null) {
      Product.findByIdAndUpdate(req.product.id, fields)
        .then((updated) => {
          return res.json({ message: `${updated._id} is updated` });
        })
        .catch(() => res.json({ error: "Error updating product" }));
    } else {
      Product.findByIdAndUpdate(req.product.id, {
        ...fields,
        photo: { data: pic, contentType: picType },
      })
        .then((updated) => {
          return res.json({ message: `${updated._id} is updated` });
        })
        .catch(() => res.json({ error: "Error updating product" }));
    }
  });
};

/* Sort by sold/arrival using query on the route */
/* By sold: product?sortBy=sold&order=desc&limit=4 */
// by Arrival: product?sortBy=createdAt&order=desc&limit=4
// If no params are sent, all products are returned
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .sort([[sortBy, order]])
    .limit(limit)
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
};
/*
* List product based on related category

*/
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  //console.log(req.product);
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .populate("category", "_id name")
    .select("-photo")
    .limit(limit)
    .then((products) => {
      return res.json(products);
    })
    .catch((err) => {
      return res.json(err);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {})
    .then((categories) => {
      return res.json(categories);
    })
    .catch(() => {
      return res.json({ error: "Categories not found!" });
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
