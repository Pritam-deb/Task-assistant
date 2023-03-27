const express = require("express");
const db = require("../../database/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../database/config");

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

const requireAuth = async (request, response, next) => {
  const token = request.cookies.jwt;

  if (token) {
    await jwt.verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        return response
          .status(403)
          .json({ error: "You must be logged in! wrong token" });
      } else {
        const { _id } = payload;

        User.findOne({ where: { uuid: _id } }).then((userData) => {
          const currentUser = {
            uuid: userData.dataValues.uuid,
            username: userData.dataValues.username,
            password: userData.dataValues.password,
          };
          request.user = currentUser;

          next();
        });
      }
    });
  } else {
    return response
      .status(403)
      .json({ error: "You must be logged in! token empty" });
  }
};

module.exports = { saveUser, requireAuth };
