const bcrypt = require("bcrypt");

export const pswd = [];

const hashPassword = (password) =>
  bcrypt
    .hash(password, 12)
    .then((hashPswd) => {
      pswd.push({
        status: "success",
        value: hashPswd,
      });
    })
    .catch((err) => {
      pswd.push({
        status: "failed",
        value: null,
      });
      console.log(err);
    });

console.log(`ENCRYPTION WAS === ${pswd}`);

module.exports = hashPassword;
