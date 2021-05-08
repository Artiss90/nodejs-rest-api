const multer = require("multer");
const path = require("path");
require("dotenv").config();
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 4000000 }, // max size = 4 Mb
  fileFilter: (req, file, cb) => {
    // Функция должна вызывать `cb` с булевым значением,
    // которое показывает, следует ли принять файл
    if (!file.mimetype.includes("image")) {
      // Чтобы отклонить, прокиньте в аргументы `false` :
      console.log("image-false");
      cb(null, false);
      return;
    }
    console.log("image-true");
    // Чтобы принять файл, используется как аргумент `true`:
    cb(null, true);

    // Вы можете всегда вернуть ошибку, если что-то пошло не так:
    // cb(new Error("I don't have a clue!"));
  },
});

module.exports = upload;
