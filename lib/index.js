const DB = require("./db");

module.exports = function(url) {
  return new DB(url);
}