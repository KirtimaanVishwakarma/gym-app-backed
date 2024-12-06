import { createTransport } from 'nodemailer';

const emailHandler = async (to, subject, text) => {
  const transporter = createTransport({
    service: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
};
export default emailHandler;
