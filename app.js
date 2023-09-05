const express = require("express");
const cors = require("cors");
const path = require("path");

const signedURLRoute = require("./src/routes/signedS3Url");
const uploadRoute = require("./src/routes/uploadPDF");
const saveImageS3Route = require("./src/routes/saveImageS3");
const pdfRoute = require("./src/routes/pdf.route");
const { exec } = require("node:child_process");

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
app.use("/", saveImageS3Route);
app.use("/", pdfRoute);

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.get("/", (req, res) => {
  res.json({
    Running: 1,
  });
});

exec(
  `magick -density 150 /home/ubuntu/file-sample_150kB.pdf[0] -quality 100 -flatten -sharpen 0x1.0 file-sample_150kB_1_v1.png`,
  (error, stdout, stderr) => {
    if (error) {
      console.log("error", error);
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  }
);

http.listen(port, (err) => {
  if (err) return console.log(`Server Issue due to ${err.message}`);
  return console.log(`Server listening on ${port}`);
});

module.exports = app;
