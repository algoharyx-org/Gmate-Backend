import expressAsyncHandler from "express-async-handler";
import { successResponse } from "../../utils/APIResponse.js";
import { contactService } from "./contact.service.js";

export const contact = expressAsyncHandler(async (req, res) => {
  await contactService(req.body);
  res.status(200).json(successResponse(null, "Message sent successfully"));
});
