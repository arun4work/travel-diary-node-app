const multer = require('multer');

const MIME_TYPE_MAPPER = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const fileUpload = multer({
    limits: 50000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // console.log(req, file);
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = MIME_TYPE_MAPPER[file.mimetype];
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
        },
        fileFilter: (req, file, cb) => {
            const isValidFile = !!MIME_TYPE_MAPPER[file.mimetype];
            let error = isValidFile ? null : new Error('Invalid file extension');
            cb(error, isValidFile);
        },
    }),
});

module.exports = fileUpload;
