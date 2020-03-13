const fs = require("fs");

module.exports = function getPwd() {
  let pwd = fs.readFileSync("./databasePassword.txt", "utf8");
  console.log(pwd);
  return pwd;
};
