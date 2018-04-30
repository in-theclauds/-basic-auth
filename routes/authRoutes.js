const express = require('express');
const router  = express.Router();
// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET home page */

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username; //has to match name in form
  const password = req.body.password; // has to match name in form

//will not allow user to create username if it already exists.
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
      });
      return;
      };
        User.findOne({ "username": username },
          "username",
            (err, user) => {
              console.log("hello", user)
              if (user !== null) {
              res.render("auth/signup", {
                errorMessage: "The username already exists"
                });
                  return;
                    }
                    const salt     = bcrypt.genSaltSync(bcryptSalt);
                    const hashPass = bcrypt.hashSync(password, salt);
                      //creates new user
                      const newUser  = User({
                          username: username,
                            password: hashPass
                            });
                            //saves new user
                              newUser.save((err) => {
                              res.redirect("/");
                              });
});
});


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;