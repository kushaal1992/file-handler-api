const fs = require("fs");
const path = require("path");
const pdfHandler = require("./pdfHandler");
const s3Utils = require("../utils/awsS3");

async function uploadPDF(req, res) {
  console.log("uploadPDF --> req --> ", req.file);
  try {
    console.log("dirname", __dirname);
    if (req.file) {
      const filePath = path.join(
        __dirname,
        `../../public/assets/${req.file.filename}`
      );
      const filename = req.file.filename.split(".")[0];
      const ext = req.file.filename.split(".")[1];
      if (fs.existsSync(filePath)) {
        // If PDF Uploaded to Server then convert to Png
        pdfHandler.pdfToImg(filename).then((result) => {
          if (result.error) {
            return result.status(400).json({
              status: 400,
              message: "Failed!",
              data: [],
              error: result.error,
            });
          } else {
            console.log("result", result);
            // Upload to S3 and get Presigned URL of 1st Page of PDF(png1)
            s3Utils
              .uploadToS3(result.data, filename)
              .then((uploadRes) => {
                return res.status(200).json({
                  status: 200,
                  message: uploadRes.message,
                  data: [],
                  count: result.data.length,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  status: 500,
                  message: "Failed!",
                  error: err.message,
                });
              });
          }
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "Failed!",
        data: [],
        error: "Please choose a PDF File",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 500,
      message: "Failed!",
      data: [],
      error: error.message,
    });
  }
}

module.exports = { uploadPDF };
