const multer = require("multer");
const path   = require("path");

function createUploader(folder) {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) =>
                cb(null, path.join(__dirname, `../../FE/assets/images/${folder}`)),
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                cb(null, `${folder.replace("/","_")}_${Date.now()}${ext}`);
            }
        }),
        fileFilter: (req, file, cb) =>
            /\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname)
                ? cb(null, true)
                : cb(new Error("Chỉ hỗ trợ ảnh jpg/jpeg/png/webp.")),
        limits: { fileSize: 5 * 1024 * 1024 }
    });
}

module.exports = { createUploader };
