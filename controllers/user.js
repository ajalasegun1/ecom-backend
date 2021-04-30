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

exports.read = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findByIdAndUpdate(req.profile._id, req.body)
    .then((user) => res.json(`${user._id} is updated...`))
    .catch(() =>
      res.json({ error: "Something went wrong while trying to update user..." })
    );
};
