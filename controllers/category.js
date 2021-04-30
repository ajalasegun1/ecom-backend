const Category = require("../models/category");

exports.create = (req, res) => {
  Category.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  Category.findByIdAndUpdate(req.category._id, req.body)
    .then((category) => {
      return res.json({ message: `Category  ${category._id} updated` });
    })
    .catch(() => {
      return res.json({ error: "Something went wrong updating the category" });
    });
};

exports.remove = (req, res) => {
  Category.findByIdAndDelete(req.category._id)
    .then((deleted) => {
      return res.json({ message: `${deleted._id} has been deleted...` });
    })
    .catch(() => {
      return res.json({
        error: "Something went wrong while trying to delete catgory...",
      });
    });
};

exports.categoryById = (req, res, next, id) => {
  Category.findById(id)
    .then((category) => {
      req.category = category;
      next();
    })
    .catch(() => {
      return res.json({ error: "Category not found..." });
    });
};