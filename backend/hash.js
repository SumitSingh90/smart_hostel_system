const bcrypt = require("bcrypt");

const password = "123456";
const saltRounds = 10;

(async () => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Generated Hash:\n", hashedPassword);
    } catch (err) {
        console.error(err);
    }
})();
