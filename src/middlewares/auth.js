const express = require("express");
const db = require("../../database/models");

const User = db.users;

const saveUser = async (request, response, next) => {
  //searching DB for the user
  try {
    const newUserName = await User.findOne({
      where: {
        username: request.body.username,
      },
    });
    if (newUserName) {
      return response.json(409).send("Username is already taken");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { saveUser };
