const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const db = require("../../database/models");
const User = db.users;
const FederatedCredential = db.federated_credentials;

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/api/todos",
    failureRedirect: "/api/login",
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { uuid: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "523872834988-66fnc3ni5j6bhuff8rf88kad2f3e5spj.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/api/oauth2/redirect/google",
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
          // console.log(`NEW USER IS ===> `, newUser.uuid);
          try {
            const newCredential = await FederatedCredential.create({
              user_id: newUser.uuid,
              provider: issuer,
              subject: profile.id,
            });
          } catch (error) {
            console.log(error);
          }

          // Create a user object to be returned to Passport
          const user = {
            id: newUser.uuid,
            name: newUser.name,
          };

          return cb(null, user);
        } else {
          // If user already exists, fetch the user from the users table
          const existingUser = await User.findOne({
            where: { uuid: existingCredential.user_id },
          });

          // Create a user object to be returned to Passport
          const user = {
            id: existingUser.uuid,
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

module.exports = router;
