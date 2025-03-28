import { REDIS_URI } from "@/configs/config";
import Queue from "bull";

const emailQueue = new Queue("email-queue", REDIS_URI);

emailQueue.on("completed", (job: any) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on("failed", (job: any, err: any) => {
  console.log(`job ${job.id} failed: ${err.message}`);
});

// Log when jobs are added
emailQueue.on("waiting", (jobId) => {
  emailQueue.getJob(jobId).then((job) => {
    if (job) {
      console.log("New job added to queue:", {
        id: job.id,
        data: job.data,
      });
    }
  });
});

export default emailQueue;
