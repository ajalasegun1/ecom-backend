const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      req.profile = user;
      next();
    })
    .catch(() => {
      res.json({ error: "User not found" });
      next();
    });
};
