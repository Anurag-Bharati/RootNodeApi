const multer = require("multer");
const path = require("path");

/* constraints start */
const maxFileSize = 100 * 1024 * 1024;
const maxImageSize = 10 * 1024 * 1024;
const whiteListVideoTypes = [".mp4", ".mkv"];
const whiteListImageTypes = [".jpg", ".jpeg", ".png", ".gif"];
const whiteListMediaTypes = whiteListImageTypes.concat(whiteListVideoTypes);
/* constraints end */

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/media/uploads/"),
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    const fileSize = parseInt(req.headers["content-length"]);
    const ext = path.extname(file.originalname).toLowerCase();

    if (!whiteListMediaTypes.includes(ext))
        return cb({ message: "Unsupported file format" }, false);
    if (fileType === "image" && fileSize > maxImageSize)
        return cb({ message: "Image file size must be 10MB or less" }, false);
    if (fileType === "video" && fileSize > maxFileSize)
        return cb({ message: "Video file size must be 100MB or less" }, false);

    cb(null, true);
};

const multerMiddleware = multer({
    storage: multerStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxFileSize },
});

module.exports = multerMiddleware;
