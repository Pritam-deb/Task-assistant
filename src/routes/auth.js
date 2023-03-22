const express = require("express");
const { signUp, signIn } = require("../services/user");
const userAuth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userAuth.saveUser, signUp);
router.post("/signin", signIn);

module.exports = router;
