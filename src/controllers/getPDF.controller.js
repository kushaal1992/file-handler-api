const imgToPDFConverter = require("../utils/fileConverter").imgToPDFConverter;
const getObjectsFromS3 = require("../utils/awsS3").getObjectsFromS3;
const s3Utils = require("../utils/awsS3");

// V2
async function getPDF(req, res) {
  try {
    const { dirname } = req.query;
    const objects = await getObjectsFromS3(dirname);
    console.log(objects);
    const PDFResponse = await imgToPDFConverter(objects, dirname);
    console.log("getPDF Response", PDFResponse);
    PDFResponse.on("finish", async () => {
      console.log("File Written")
      const filename = `${dirname}_final.pdf`;
      console.log("getPDF --> filename", filename);
      const uploadRes = await s3Utils.uploadOneObjectToS3(dirname, filename);
      console.log("uploadRes", uploadRes);
      if (uploadRes && uploadRes.Location) {
        const key = `${dirname}/${filename}`;
        const signedURLResponse = await s3Utils.getSignedURL(key);
        console.log("signedURLResponse", signedURLResponse);
        if (signedURLResponse) {
          return res.status(200).json({
            status: 200,
            message: "Success!",
            data: signedURLResponse,
          });
        }
      } else {
        return res.status(400).json({
          message: "getPDF Failed!",
          error: uploadRes.error,
          data: [],
        });
      }
    });
  } catch (error) {
    console.log("errpor", error.message);
    return res.status(500).json({
      status: 500,
      message: "getPDF Failed!",
      error: error.message,
    });
  }
}

// getPDF({ query: { dirname: "file-sample_150kB" } });

module.exports = { getPDF };
