import Contact from "../../DB/models/contact.model.js"
import receiveEmail from "../../utils/receiveEmail.js";

export const contactService = async (data) => {
  await Contact.create(data);

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
}