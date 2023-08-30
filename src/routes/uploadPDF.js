const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadFile");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname.split(".")[0]}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] == "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Please upload a PDF File"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.post("/upload", upload.single("file"), uploadController.uploadPDF);

module.exports = router;
