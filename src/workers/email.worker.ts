import emailQueue from "@/queues/email.queue";

// process 5 jobs concurrently
emailQueue.process(5, async (job: any) => {
  const { email, message } = job.data;

  // Simulate email sending (replace with actual email service)
  console.log(`Sending email to ${email}: ${message}`);

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // optional return value
  return { status: "email sent" };
});

console.log("Email worker started...");
