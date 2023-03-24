const getTodo = async (request, response) => {
  const userID = request.user.uuid;
  console.log(`LOGGED FROM TODO ${userID}`);
  return response.json({ message: "Logged in and here in ToDo Page" });
};

module.exports = { getTodo };
