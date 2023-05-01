const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { JWT_SECRET } = require("../../database/config");

const db = require("../../database/models");

const User = db.users;
const Todo = db.todos;

const hashPswd = (password) => {
  return bcrypt.hash(password, 10);
};

const accessToken = (uuid, username) => {
  return jwt.sign({ _id: uuid, _name: username }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

const sendEmail = async (to, subject, body) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pritamdebnath297@gmail.com",
      pass: "pyex ecna ipug yeke",
    },
  });
  let mailOptions = {
    from: "pritamdebnath297@gmail.com",
    to: to,
    subject: subject,
    text: body,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const checkTodosDueInThreeDays = async () => {
  const threeDaysFromNow = new Date(
    new Date().getTime() + 3 * 24 * 60 * 60 * 1000
  );

  const todos = await Todo.findAll({
    where: {
      dueDate: {
        [Op.lte]: threeDaysFromNow,
      },
    },
    include: [
      {
        model: db.users,
        attributes: ["userEmail"],
      },
    ],
  });
  // console.log(`TODO WITHIN DUE DATE===>`, todos);
  if (todos) {
    todos.forEach((todo) => {
      console.log(`TO-DO TITLE============>`, todo.title);
      console.log(`TO-DO EMAIL============>`, todo.user.userEmail);
      const subject = `Reminder: Your todo "${todo.title}" is due in 3 days`;
      const text = `Your todo "${
        todo.title
      }" is due on ${todo.dueDate.toDateString()}. Don't forget to complete it!`;
      sendEmail(todo.user.userEmail, subject, text);
    });
  }
};

module.exports = { hashPswd, accessToken, checkTodosDueInThreeDays };
