const express = require("express");
const db = require("../../database/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../database/config");

const User = db.users;
const Session = db.sessions;

const saveUser = async (request, response, next) => {
  //same user
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

//MIDDLEWARE FOR GOOGLE AUTHENTICATION
const requireGoogleAuth = async (request, response, next) => {
  const currentUser = await Session.findAll({
    attributes: ["data"],
  });
  if (currentUser) {
    const userData = currentUser[0].dataValues;
    const parsedData = JSON.parse(userData.data);
    const googleUser = {
      uuid: parsedData.passport.user.uuid,
      username: parsedData.passport.user.name,
    };
    request.user = googleUser;
  } else {
    return response
      .status(403)
      .json({ error: "You must be signedIn with google!" });
  }
  next();
};

//MIDDLEWARE FOR AUTHENTICATION WITH JWT
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

module.exports = { saveUser, requireAuth, requireGoogleAuth };
