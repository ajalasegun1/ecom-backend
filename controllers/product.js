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
