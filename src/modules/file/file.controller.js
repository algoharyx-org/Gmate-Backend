import expressAsyncHandler from "express-async-handler";
import cloudinary from "../../utils/cloudinary.js";
import { successResponse } from "../../utils/APIResponse.js";
import { createBadRequestError } from "../../utils/APIErrors.js";

// @desc     Upload a single file to Cloudinary
// @route    POST /file/upload
// @access   Private
export const uploadSingleFile = expressAsyncHandler(async (req, res) => {
    if (!req.file) {
        throw createBadRequestError("No file provided");
    }

    // Convert buffer to stream for Cloudinary upload
    const uploadStream = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "Gmate/uploads" },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            stream.end(req.file.buffer);
        });
    };

    const result = await uploadStream();

    res.status(200).json(successResponse({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type
    }, "File uploaded successfully"));
});

// @desc     Upload multiple files to Cloudinary
// @route    POST /file/upload-multiple
// @access   Private
export const uploadMultipleFiles = expressAsyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw createBadRequestError("No files provided");
    }

    const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "Gmate/uploads" },
                (error, result) => {
                    if (result) resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                        resource_type: result.resource_type
                    });
                    else reject(error);
                }
            );
            stream.end(file.buffer);
        });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json(successResponse(results, "Files uploaded successfully"));
});
