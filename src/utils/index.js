const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const { Op, Sequelize } = require("sequelize");
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
    order: [["dueDate", "ASC"]],
  });
  const todosByDueDate = {};
  if (todos) {
    todos.forEach((todo) => {
      const dueDate = todo.dueDate.toISOString().substring(0, 10);
      if (todosByDueDate[dueDate]) {
        todosByDueDate[dueDate].push(todo);
      } else {
        todosByDueDate[dueDate] = [todo];
      }
    });
  }
  for (const dueDate in todosByDueDate) {
    const todos = todosByDueDate[dueDate];
    await sendReminderEmail(todos);
  }
};

const sendReminderEmail = async (todos) => {
  // group todos by user email
  const todosByUser = {};
  todos.forEach((todo) => {
    const userEmail = todo.user.userEmail;
    if (todosByUser[userEmail]) {
      todosByUser[userEmail].push(todo.title);
    } else {
      todosByUser[userEmail] = [todo.title];
    }
  });

  // send email to each user
  for (const userEmail in todosByUser) {
    const subject = "Reminder: You have todo/s due soon";
    const body = todosByUser[userEmail].join("\n");
    // console.log(`TODOS BY USER========>`, body);

    await sendEmail(userEmail, subject, body);
  }
};

//scheduler I dont know from where it should work???from where should i call it??
cron.schedule("0 9 * * *", () => {
  checkTodosDueInThreeDays();
});

module.exports = { hashPswd, accessToken, checkTodosDueInThreeDays };
