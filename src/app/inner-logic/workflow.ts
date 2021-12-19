import { BuyResource, ChooseJob } from './logics';
import { WorkerModel } from './models';

type WorkerJob = (worker: WorkerModel) => void;

const workerWorkflow: WorkerJob[] = [ChooseJob, BuyResource];

export function NextWorkerJob(worker: WorkerModel): void {
  worker.jobIndex = (worker.jobIndex + 1) % workerWorkflow.length;
  const jobFunction = workerWorkflow[worker.jobIndex];
  jobFunction(worker);
}
