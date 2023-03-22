const db = require("../../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hashPswd, accessToken } = require("../utils");
const { JWT_SECRET } = require("../../database/config");

const User = db.users;

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await hashPswd(password);
    const newUser = {
      username,
      password: hashPassword,
    };
    await User.create(newUser)
      .then((data) => res.send(data))
      .catch((error) => {
        res.status(400).send(err.errors[0]);
        console.log(err);
      });

    //omitted the part to create a JWT here, instead I will only do it while Signing in
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // await User.findOne({ where: { username: "broly" } }).then((data) => {
    //   console.log(`DATA is ===> ${data}`);
    // });
    const x = await User.findAll();
    console.log(`USERNAME is ===> ${x}`);

    const user = await User.findOne({ where: { username: username } });
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        let token = accessToken(user.uuid); //used data.uuid instead of user.id
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        return res.status(201).send(user);
      } else {
        return res.status(401).send("Authentication failed! wrong password");
      }
    } else {
      return res
        .status(401)
        .send("Authentication failed as username not found");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signUp, signIn };
