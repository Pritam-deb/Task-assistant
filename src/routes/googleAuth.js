const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const db = require("../../database/models");
const router = express.Router();

const User = db.users;
const FederatedCredential = db.federated_credentials;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "523872834988-66fnc3ni5j6bhuff8rf88kad2f3e5spj.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    async function (issuer, profile, cb) {
      try {
        // Check if the user already exists in the federated_credentials table
        const existingCredential = await FederatedCredential.findOne({
          where: { provider: issuer, subject: profile.id },
        });

        if (!existingCredential) {
          // If not, create a new user and federated credential
          const newUser = await User.create({ name: profile.displayName });
          const newCredential = await FederatedCredential.create({
            user_id: newUser.id,
            provider: issuer,
            subject: profile.id,
          });

          // Create a user object to be returned to Passport
          const user = {
            id: newUser.id,
            name: newUser.name,
          };

          return cb(null, user);
        } else {
          // If user already exists, fetch the user from the users table
          const existingUser = await User.findOne({
            where: { id: existingCredential.user_id },
          });

          // Create a user object to be returned to Passport
          const user = {
            id: existingUser.id,
            name: existingUser.name,
          };

          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
router.get("/login", function (req, res, next) {
  res.render("login");
});

module.exports = router;
