const User = require("../models/user");
const bcrypt = require("bcrypt");
const { signupValidator, signupErrors } = require("./services");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const data = req.body;
  if (signupValidator(data)) {
    User.create(data)
      .then((response) => {
        return res.status(201).json({ user: { response } });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.json({ error: { email: "Email already exists" } });
        }
      });
  } else {
    res.json({ error: signupErrors });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //Check if email exists in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({ error: { email: "User does not exist" } });
      }

      //check password function is part of userSchema method
      const checkPassword = bcrypt
        .compare(password, user.password)
        .then(function (result) {
          if (result) {
            const key = process.env.SECRET;
            //GENERATE TOKEN WITH THE USER ID AND THE SECRET
            const token = jwt.sign({ _id: user._id }, key);
            //SEND RESPONSE WITH TOKEN AND OTHER DATA
            res.cookie("access", token, {
              expire: new Date() + 10800,
              httpOnly: true,
            });
            const { _id, name, email, role } = user;
            return res.json({ token, user: { _id, name, email, role } });
          } else {
            return res.json({ error: { password: "Incorrect password" } });
          }
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

exports.signout = (req, res) => {
  res.clearCookie("access");
  res.json({ message: "Signed out" });
};

exports.requireSignin = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied it isnt " });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: "Admin resource. Access Denied!" });
  }
  next();
};
