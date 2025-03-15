const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utili/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../midelware.js");
const {
  userSignup,
  userSignupPost,
  userLogin,
  userLoginPost,
  userLogout,
} = require("../controllers/user.js");

router.route("/signup").get(userSignup).post(wrapAsync(userSignupPost));

router
  .route("/login")
  .get(userLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userLoginPost
  );

router.get("/logout", userLogout);

module.exports = router;
