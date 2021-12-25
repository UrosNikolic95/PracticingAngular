import { FactoryModel, WorkerModel } from './models';

export function FactoryMinWallet(): number {
  return Math.min(...FactoryModel.allFactories.map((f) => f.wallet));
}

export function FactoryMaxWallet(): number {
  return Math.max(...FactoryModel.allFactories.map((f) => f.wallet));
}

export function WorkerMinWallet(): number {
  return Math.min(...WorkerModel.allWorkers.map((w) => w.wallet));
}

export function WorkerMaxWallet(): number {
  return Math.max(...WorkerModel.allWorkers.map((w) => w.wallet));
}
