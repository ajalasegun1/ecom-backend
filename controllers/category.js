const Category = require("../models/category");

exports.create = (req, res) => {
  Category.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
