import multer from "multer";

export const fileValidation = {
    image: ["image/png", "image/jpeg", "image/gif"],
    file: ["application/pdf", "application/msword"],
    video: ["video/mp4"],
};

export const uploadFile = (customValidation = []) => {
    const storage = multer.memoryStorage(); // Using memory storage for Cloudinary upload

    const fileFilter = (req, file, cb) => {
        if (customValidation.length === 0 || customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file format"), false);
        }
    };

    const upload = multer({ fileFilter, storage });
    return upload;
};
