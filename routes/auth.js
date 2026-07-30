const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/github",
  // #swagger.tags = ['Authentication']
  // #swagger.ignore = true
  // #swagger.description = 'Redirects directly to GitHub to authorize the browser session.'
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  // #swagger.tags = ['Authentication']
  // #swagger.ignore = true
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    res.redirect("/api-docs");
  },
);

router.get("/logout", (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.ignore = true
  // #swagger.description = 'Clears the session cookies and revokes local authorization.'
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api-docs");
  });
});

module.exports = router;
