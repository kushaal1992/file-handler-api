const imgToPDF = require("image-to-pdf");
const fs = require("fs");
const path = require("path");

const assetPath = path.resolve(__dirname, `../../public/assets`);

async function imgToPDFConverter(imageArr, filename) {
  try {
    const pages = imageArr.map((image) => image.Body);

    console.log("Converting To PDF");
    console.log(`${assetPath}/${filename}/${filename}_final.pdf`);
    if (!fs.existsSync(`${assetPath}/${filename}`)) {
      fs.mkdirSync(`${assetPath}/${filename}`);
    }
    const write = imgToPDF(pages, imgToPDF.sizes.A4).pipe(
      fs.createWriteStream(`${assetPath}/${filename}/${filename}_final.pdf`)
    );
    return write;
  } catch (error) {
    return {
      message: "imgToPDFConverter Failed!",
      error: error.message,
    };
  }
}

module.exports = { imgToPDFConverter };
