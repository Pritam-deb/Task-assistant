const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../database/config");

const hashPswd = (password) => {
  return bcrypt.hash(password, 10);
};

const accessToken = (uuid) => {
  return jwt.sign({ _id: uuid }, JWT_SECRET, { expiresIn: "60s" });
};

module.exports = { hashPswd, accessToken };
