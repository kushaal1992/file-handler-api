const express = require("express");
const pdfController = require("../controllers/getPDF.controller");

const router = express.Router();

router.get("/download-pdf", pdfController.getPDF);

module.exports = router;
