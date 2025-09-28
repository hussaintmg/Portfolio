const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = path.join(__dirname, "../uploads/others");

    if (
      file.fieldname === "images[]" ||
      file.fieldname === "images" ||
      file.fieldname === "image" ||
      file.fieldname === "icon" ||
      file.fieldname === "logo" ||
      file.fieldname === "Prof" ||
      file.fieldname === "EMI" ||
      file.fieldname === "PMI" ||
      file.fieldname === "AMI"
    ) {
      folder = path.join(__dirname, "../uploads/images");
    } else if (
      file.fieldname === "videos[]" ||
      file.fieldname === "videos" ||
      file.fieldname === "video"
    ) {
      folder = path.join(__dirname, "../uploads/videos");
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed!"), false);
  }
};

module.exports = multer({ storage, fileFilter });
