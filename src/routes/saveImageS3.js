const express = require("express");
const router = express.Router();
const saveImgS3controller=require('../controllers/saveImageS3.controller');
const upload = require("../utils/saveImageS3");

router.post("/save-img-s3", upload.single('file'),saveImgS3controller.saveImageS3);

module.exports = router;