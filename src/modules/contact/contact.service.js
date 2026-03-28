import Contact from "../../DB/models/contact.model.js";
import receiveEmail from "../../utils/receiveEmail.js";
import { getIO } from "../../socket/socket.js";
import Features from "../../utils/features.js";

export const contactService = async (data) => {
  const contact = await Contact.create(data);

  const io = getIO();
  if (io) {
    io.emit("contact:new", contact);
  }

  const content = `Hello,  
              You have received a new message from the contact page of your website. <br> Here are the details:<br><br>

              - Name: ${data.name}<br>
              - Email: ${data.email}<br>
              - Message: ${data.message}<br><br>

              Please follow up if necessary.<br>
              Thank you.`;
  await receiveEmail({
    email: data.email,
    subject: "Inquiry about Services",
    message: content,
  });

  return true;
};

export const getContactService = async (query) => {
  const contactCount = await Contact.countDocuments();
  const feature = new Features(Contact.find(), query)
    .filter()
    .sort()
    .limitFields()
    .search("contact")
    .pagination(contactCount);
  const contacts = await feature.mongooseQuery;
  let totalPages;
  if (contacts.length < feature.paginationResult.limit) {
    totalPages = Math.ceil(contacts.length / feature.paginationResult.limit);
  } else {
    totalPages = feature.paginationResult.totalPages;
  }
  return {contacts, length: contactCount, totalPages, metadata: feature.paginationResult};
};

export const getContactByIdService = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { read: true },
    { returnDocument: "after" },
  ).lean();
  if (!contact) {
    throw createNotFoundError("Message not found");
  }
  return contact;
};

export const deleteContactService = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw createNotFoundError("Message not found");
  }
  return;
};

export const markContactReadService = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { read: true },
    { returnDocument: "after" },
  ).lean();

  if (!contact) {
    throw createNotFoundError("Message not found");
  }

  return contact;
};

export const markAllContactsReadService = async () => {
  const result = await Contact.updateMany({ read: false }, { read: true });

  return result;
};
