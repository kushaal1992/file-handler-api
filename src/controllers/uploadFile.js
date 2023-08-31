const fs = require("fs");
const path = require("path");
const pdfHandler = require("./pdfHandler");
const s3Utils = require("../utils/awsS3");
const AWS = require("aws-sdk");

// async function uploadPDF(req, res) {
//   console.log("uploadPDF --> req --> ", req.file);
//   try {
//     console.log("dirname", __dirname);
//     if (req.file) {
//       const filePath = path.join(
//         __dirname,
//         `../../public/assets/${req.file.filename}`
//       );
//       const filename = req.file.filename.split(".")[0];
//       const ext = req.file.filename.split(".")[1];
//       console.log("Checking File Upload")
//       if (fs.existsSync(filePath)) {
//         // If PDF Uploaded to Server then convert to Png
//         pdfHandler.pdfToImg(filename).then((result) => {
//           console.log("result", result)
//           if (result.error) {
//             return result.status(400).json({
//               status: 400,
//               message: "Failed!",
//               data: [],
//               error: result.error,
//             });
//           } else {
//             console.log("result", result);
//             // Upload to S3 and get Presigned URL of 1st Page of PDF(png1)
//             s3Utils
//               .uploadToS3(result.data, filename)
//               .then((uploadRes) => {
//                 console.log("uploadRes", uploadRes)
//                 return res.status(200).json({
//                   status: 200,
//                   message: uploadRes.message,
//                   data: [],
//                   count: result.data.length,
//                 });
//               })
//               .catch((err) => {
//                 return res.status(500).json({
//                   status: 500,
//                   message: "Failed!",
//                   error: err.message,
//                 });
//               });
//           }
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: "Failed!",
//         data: [],
//         error: "Please choose a PDF File",
//       });
//     }
//   } catch (error) {
//     return res.status(400).json({
//       status: 500,
//       message: "Failed!",
//       data: [],
//       error: error.message,
//     });
//   }
// }

//v2
async function uploadPDF(req, res) {
  console.log("uploadPDF --> req --> ", req.file);
  try {
    console.log("dirname", __dirname);
    const s3 = new AWS.S3({
      endpoint: "s3-ap-south-1.amazonaws.com",
      accessKeyId: "AKIAZDHWLVNJUUTAGIWY",
      secretAccessKey: "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",
      Bucket: "ivs-edu-book-pdf-v1",
      signatureVersion: "v4",
      region: "ap-south-1",
    });
    if (req.file) {
      const filePath = path.join(
        __dirname,
        `../../public/assets/${req.file.filename}`
      );
      const filename = req.file.filename.split(".")[0];
      const ext = req.file.filename.split(".")[1];
      console.log("Checking File Upload");
      if (fs.existsSync(filePath)) {
        // If PDF Uploaded to Server then convert to Png
        pdfHandler.pdfToImg(filename).then(async (result) => {
          console.log("result", result);
          if (result.error) {
            return result.status(400).json({
              status: 400,
              message: "Failed!",
              data: [],
              error: result.error,
            });
          } else {
            // Upload to S3 and get Presigned URL of 1st Page of PDF(png1)
            try {
              
            s3Utils
            .uploadToS3(filename)
            .then((data) => {
              console.log("data", data);
                return res.status(200).json({
                  status: 200,
                  message: "All Files uploaded to S3",
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
            } catch (error) {
              console.log("Error", error.message)
            }
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
