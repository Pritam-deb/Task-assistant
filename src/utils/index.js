const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../database/config");

const hashPswd = (password) => {
  return bcrypt.hash(password, 10);
};

const accessToken = (uuid, username) => {
  return jwt.sign({ _id: uuid, _name: username }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { hashPswd, accessToken };
