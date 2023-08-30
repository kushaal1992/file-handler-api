const express = require("express");
const router = express.Router();

const getSignedURLController = require("../controllers/getSignedS3URL.controller");

router.get("/get-signed-url", getSignedURLController.getSignedURL);

module.exports = router;
