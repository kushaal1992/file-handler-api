const s3Utils = require("../utils/awsS3");

function getSignedURL(req, res) {
  try {
    const { filename } = req.query;
    if (filename) {
      s3Utils
        .getSignedURL(filename)
        .then((data) => {
          return res.status(200).json({
            status: 200,
            message: "Success!",
            data,
          });
        })
        .catch((err) => {
          return res.status(200).json({
            status: 200,
            message: "Failed!",
            data: [],
            error: err.message,
          });
        });
    } else {
      // Hanlde no file name
      return res.status(400).json({
        status: 400,
        message: "Failed!",
        data: [],
        error: "Please pass file name",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Failed!",
      data: [],
      error: error.message,
    });
  }
}

module.exports = { getSignedURL };
