import emailQueue from "@/queues/email.queue";

// Function to print queue status
async function printQueueStatus() {
  const waiting = await emailQueue.getWaiting();
  const active = await emailQueue.getActive();
  const completed = await emailQueue.getCompleted();
  const failed = await emailQueue.getFailed();

  console.log("=== Queue Status ===");
  console.log(
    "Waiting Jobs:",
    waiting.map((job: any) => ({
      id: job.id,
      data: job.data,
    }))
  );
  console.log(
    "Active Jobs:",
    active.map((job: any) => ({
      id: job.id,
      data: job.data,
    }))
  );
  console.log(
    "Completed Jobs:",
    completed.map((job: any) => ({
      id: job.id,
      data: job.data,
    }))
  );
  console.log(
    "Failed Jobs:",
    failed.map((job: any) => ({
      id: job.id,
      data: job.data,
    }))
  );
  console.log("===================");
}

export default printQueueStatus;
