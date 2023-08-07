 

const multer = require("multer");
const imageFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("png") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("webp")
    ) {
        cb(null, true);
    } else {
        cb("Please upload only image file.", false);
    }
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;