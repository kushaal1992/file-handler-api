const app = require("./app");
const serverless = require("serverless-http");

module.exports.fileHandler = serverless(app);
