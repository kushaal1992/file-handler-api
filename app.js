const express = require("express");
const cors = require("cors");
const path = require("path");
const AWS = require("aws-sdk");


const signedURLRoute = require("./src/routes/signedS3Url");
const uploadRoute = require("./src/routes/uploadPDF");

const pdfToImg = require("./src/controllers/pdfHandler").pdfToImg;

const app = express();
const http = require("http").Server(app);
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

app.use("/", signedURLRoute);
app.use("/", uploadRoute);

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.get("/", (req, res) => {
  res.json({
    Running: 1,
  });
});

http.listen(port, (err) => {
  if (err) return console.log(`Server Issue due to ${err.message}`);
  return console.log(`Server listening on ${port}`);
});

// pdfToImg("file-sample_150kB")

// pdfToImg("Free_Test_Data_500KB_PDF");
// imgToPDF();

// getSignedURL().then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log("err", err.message)
// });

module.exports = app;
