const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10; // standard
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashed);
}

const myPassword = "123456"; // change to your desired password
hashPassword(myPassword);
