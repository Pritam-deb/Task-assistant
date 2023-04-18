const db = require("../../database/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hashPswd, accessToken } = require("../utils");
const { JWT_SECRET } = require("../../database/config");

const User = db.users;
//TRY USING ROLE BASED AUTHENTICATION
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
        res.status(400).send(error.errors[0]);
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

    const user = await User.findOne({ where: { username: username } });
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        let token = accessToken(user.uuid, user.username); //used user.uuid instead of user.id

        res.cookie("jwt", token, {
          serure: true,
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });

        // return res.status(201).send(user);
        return res.json({ token });
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

//GOOGLE signin and signup

module.exports = { signUp, signIn };
