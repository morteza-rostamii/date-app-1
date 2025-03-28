import emailQueue from "@/queues/email.queue";
// import nodemailer from "nodemailer";

const queueEmail = async (to: string, subject: string, text: string) => {
  // add a job to queue
  const job = await emailQueue.add({
    email: to,
    message: text,
    subject,
  });

  return {
    success: true,
    jobId: job.id,
    message: "Email queued successfully",
  };
};

export default queueEmail;

/*
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Dating App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
*/
