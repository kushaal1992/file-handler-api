// const pdf2img = require("pdf-img-convert");
const path = require("path");
const fs = require("fs");
const imgToPDF = require("image-to-pdf");
// const pdf2img_v1 = require("pdf2img");
const { fromPath } = require("pdf2pic");
const AWS = require("aws-sdk");

const assetPath = path.resolve(__dirname, `../../public/assets`);

// V3
// async function pdfToImg(filename) {
//   try {
//     const options = {
//       density: 100,
//       saveFilename: filename,
//       savePath: assetPath + "/Images/",
//       format: "png",
//       width: 600,
//       height: 600,
//     };

//     //#region Invoke Fn Region

//     AWS.config.update({
//       accessKeyId: "AKIAZDHWLVNJUUTAGIWY",
//       secretAccessKey: "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",
//       region: "ap-south-1",
//     });

//     const pdfPath = path.resolve(__dirname, `${assetPath}/${filename}.pdf`);
//     console.log("pdfPath", pdfPath);
//     const buffer = fs.readFileSync(pdfPath, { encoding: "base64" });

//     var lambda = new AWS.Lambda();
//     var params = {
//       FunctionName: "pdf-handler-api" /* required */,
//       Payload: buffer,
//     };
//     lambda.invoke(params, function (err, data) {
//       if (err) console.log(err, err.stack); // an error occurred
//       else console.log(data); // successful response
//     });

//     //#endregion

//     // return new Promise((resolve, reject) => {
//     //   const pdfPages = imgArray.length;
//     //   for (let i = 0; i < pdfPages; i++) {
//     //     fs.writeFile(
//     //       `${assetPath}/Images/${filename}_${i + 1}.png`,
//     //       imgArray[i],
//     //       (err) => {
//     //         console.log("File number", i);
//     //         if (err) {
//     //           return reject({
//     //             message: `Failed! Unable to convert Page ${i + 1}`,
//     //             error: err.message,
//     //             data: [],
//     //           });
//     //         }
//     //         console.log("Testing");
//     //         if (i + 1 == pdfPages)
//     //           return resolve({
//     //             message: "Success! PDF Converted To Images",
//     //             data: imgArray,
//     //           });
//     //       }
//     //     );
//     //   }
//     // });
//   } catch (error) {
//     console.log("pdfHandler --> pdfToImg --> error --> ", error.message);
//     return {
//       message: "Failed!",
//       error: error.message,
//       data: [],
//     };
//   }
// }

//V2
async function pdfToImg(filename) {
  try {
    if (!fs.existsSync(`${assetPath}/${filename}`)) {
      fs.mkdirSync(`${assetPath}/${filename}`);
    }
    const options = {
      quality: 100,
      density: 300,
      saveFilename: filename,
      savePath: `${assetPath}/${filename}`,
      format: "png",
      width: 595,
      height: 842,
    };

    const pdfPath = path.resolve(__dirname, `${assetPath}/${filename}.pdf`);
    console.log("pdfPath", pdfPath);
    return new Promise((resolve, reject) => {
      console.log("Converting");
      fromPath(pdfPath, options)
        .bulk(-1, { responseType: "image" })
        .then((pdfToImgRes) => {
          return resolve({
            message: "Success! PDF Converted To Images",
            data: pdfToImgRes,
          });
        })
        .catch((err) => console.log("err", err.message))
        .catch((err) => {
          return reject({
            message: `Failed! Unable to convert Page `,
            error: err.message,
            data: [],
          });
        });
    });
  } catch (error) {
    console.log("pdfHandler --> pdfToImg --> error --> ", error.message);
    return {
      message: "Failed!",
      error: error.message,
      data: [],
    };
  }
}

// V1
// async function pdfToImg(filename) {
//   try {
//     const pdfPath = path.resolve(__dirname, `${assetPath}/${filename}.pdf`);
//     const imgArray = await pdf2img.convert(pdfPath);
//     return new Promise((resolve, reject) => {
//       const pdfPages = imgArray.length
//       for (let i = 0; i < pdfPages; i++) {
//         fs.writeFile(
//           `${assetPath}/Images/${filename}_${i + 1}.png`,
//           imgArray[i],
//           (err) => {
//           console.log("File number", i)
//             if (err) {
//               return reject({
//                 message: `Failed! Unable to convert Page ${i + 1}`,
//                 error: err.message,
//                 data: [],
//               });
//             }
//             console.log("Testing");
//             if(i + 1 == pdfPages)
//               return resolve({
//                 message: "Success! PDF Converted To Images",
//                 data: imgArray,
//               });
//           }
//         );
//       }
//     });
//   } catch (error) {
//     console.log("pdfHandler --> pdfToImg --> error --> ", error.message);
//     return {
//       message: "Failed!",
//       error: err.message,
//       data: [],
//     };
//   }
// }

module.exports = { pdfToImg };
