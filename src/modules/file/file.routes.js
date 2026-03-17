import { Router } from "express";
import { uploadSingleFile, uploadMultipleFiles } from "./file.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { uploadFile, fileValidation } from "../../middlewares/multer.js";

const fileRouter = Router();

// Endpoint for single file upload (e.g., avatar, single attachment)
fileRouter.post(
    "/upload",
    authentication,
    uploadFile([...fileValidation.image, ...fileValidation.file]).single("file"),
    uploadSingleFile
);

// Endpoint for multiple files upload (e.g., task attachments)
fileRouter.post(
    "/upload-multiple",
    authentication,
    uploadFile([...fileValidation.image, ...fileValidation.file]).array("files", 5), // Limit to 5 files
    uploadMultipleFiles
);

export default fileRouter;
