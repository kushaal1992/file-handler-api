const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: "AKIAZDHWLVNJUUTAGIWY", // store it in .env file to keep it safe
    secretAccessKey: "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",
  },
  region: "ap-south-1", // this is the region that you select in AWS account
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ivs-edu-book-pdf-v1",
    key: function (req, file, cb) {
      cb(null, `${file.originalname.split(".")[0]}/${file.originalname}`);
    },
  }),
});

module.exports = upload;