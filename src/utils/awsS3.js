const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const assetPath = path.resolve(__dirname, `../../public/assets`);

function getSignedURL(filename) {
  try {
    const s3 = new AWS.S3({
      endpoint: "s3-ap-south-1.amazonaws.com",
      accessKeyId: "AKIAZDHWLVNJUUTAGIWY",
      secretAccessKey: "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",
      Bucket: "ivs-edu-book-pdf-v1",
      signatureVersion: "v4",
      region: "ap-south-1",
    });
    const params = {
      Bucket: "ivs-edu-book-pdf-v1",
      Key: filename,
      Expires: 60 * 5,
    };
    return new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        err ? reject(err.message) : resolve(url);
      });
    });
  } catch (error) {
    console.log("error --> ", error.message);
    return {
      message: "Failed! Unable to fetch signed URL",
      error: error.message,
      data: [],
    };
  }
}

// function uploadToS3(dirname) {
//   try {
//     const s3 = new AWS.S3({
//       endpoint: "s3-ap-south-1.amazonaws.com",
//       accessKeyId: "AKIAZDHWLVNJUUTAGIWY",
//       secretAccessKey: "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",
//       Bucket: "ivs-edu-book-pdf-v1",
//       signatureVersion: "v4",
//       region: "ap-south-1",
//     });
//     // const noOfImgs = imgArray.length;
//     return new Promise((resolve, reject) => {
//       fs.readdir(assetPath + "/Images", (err, filenames) => {
//         const noOfImgs = filenames.length;
//         if (err) {
//           return reject({
//             error: err.message,
//             message: `Failed! Unable to upload to S3`,
//           });
//         }
//         console.log("filenames", filenames)
//         filenames.forEach((fileName, i) => {
//           const buffer = fs.readFileSync(assetPath + "/Images/" + fileName);
//           console.log("buffer");
//           // console.log("buffer")
//           const params = {
//             Bucket: "ivs-edu-book-pdf-v1",
//             Key: `${fileName}`,
//             Body: buffer,
//             // ContentType: "png",
//           };
//           s3.upload(params, (err, data) => {
//             if (err) {
//               console.log("err", err.message);
//               return reject({
//                 error: err.message,
//                 message: `Failed! Unable to upload to S3`,
//               });
//             }
//             if (i + i == noOfImgs) {
//               return resolve({
//                 message: "All Pages uploaded to S3",
//                 data: [data],
//               });
//             }
//           });
//         });
//       });
//     });
//   } catch (error) {
//     return {
//       message: "Failed! Unable to upload to S3",
//       error: error.message,
//       data: [],
//     };
//   }
// }

// v2
function uploadToS3(dirname) {
  try {
    const s3 = new AWS.S3({
      // endpoint: "s3-ap-south-1.amazonaws.com",
      accessKeyId: "AKIAZDHWLVNJUUTAGIWY",
      secretAccessKey: "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",
      Bucket: "ivs-edu-book-pdf-v1",
      signatureVersion: "v4",
      region: "ap-south-1",
    });
    let promiseArr = [];
    const filenames = fs.readdirSync(assetPath + "/Images");
    console.log("filenames", filenames);
    filenames.forEach(async (fileName, i) => {
      const buffer = fs.readFileSync(assetPath + "/Images/" + fileName);
      console.log("buffer");
      const params = {
        Bucket: "ivs-edu-book-pdf-v1",
        Key: `${fileName}`,
        Body: buffer,
        // ContentType: "png",
      };
      promiseArr.push(s3.upload(params).promise());
    });
    return Promise.all(promiseArr);
  } catch (error) {
    return {
      message: "Failed! Unable to upload to S3",
      error: error.message,
      data: [],
    };
  }
}

module.exports = { getSignedURL, uploadToS3 };
