import expressAsyncHandler from "express-async-handler";
import { createResponse, successResponse } from "../../utils/APIResponse.js";
import {
  contactService,
  deleteContactService,
  getContactByIdService,
  getContactService,
  getUnreadContactService,
  markAllContactsReadService,
  markContactReadService,
} from "./contact.service.js";

export const contact = expressAsyncHandler(async (req, res) => {
  await contactService(req.body);
  res.status(201).json(createResponse(null, "Message sent successfully"));
});

export const getContact = expressAsyncHandler(async (req, res) => {
  const contacts = await getContactService(req.query);
  res.status(200).json(successResponse(contacts, "Successfully"));
});

export const getUnreadContact = expressAsyncHandler(async (req, res) => {
  const data = await getUnreadContactService();
  res.status(200).json(successResponse(data, "successfully"));
});

export const getContactById = expressAsyncHandler(async (req, res) => {
  const contact = await getContactByIdService(req.params.id);
  res.status(200).json(successResponse(contact, "Successfully"));
});

export const deleteContact = expressAsyncHandler(async (req, res) => {
  await deleteContactService(req.params.id);
  res.status(200).json(successResponse(null, "Successfully"));
});

export const markContactRead = expressAsyncHandler(async (req, res) => {
  await markContactReadService(req.params.id);
  res.status(200).json(successResponse(null, "Successfully"));
});

export const markAllContactsRead = expressAsyncHandler(async (req, res) => {
  await markAllContactsReadService();
  res.status(200).json(successResponse(null, "Successfully"));
});
