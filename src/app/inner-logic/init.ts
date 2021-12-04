import { interval } from 'rxjs';
import { initData } from './init.data';
import {
  allResources,
  CalculateRecordItemSetCost,
  ChooseJob,
  GenerateProductionData,
} from './logics';
import { FactoryModel, Point, RecordItemData, WorkerModel } from './models';

export function GenerateRandomFactories(): void {
  const productionData = GenerateProductionData();
  Object.keys(productionData).forEach((resource) => {
    Array.from(
      {
        length: initData.numberOfFactories, //generate 10 factories per each resource
      },
      () => {
        const factory = new FactoryModel();
        factory.producesResource = resource;
        factory.productionLineData = productionData[resource];
        factory.location = CreateRandomLocation();
        GenerateFactoryInventory(factory);
        factory.offeredPrice =
          CalculateRecordItemSetCost(factory.inventoryData.consumption) *
          initData.profitCoeficiant;
      }
    );
  });
}

export function CreateRandomLocation(): Point {
  const location = new Point();
  location.x = Math.floor(Math.random() * initData.mapWidth);
  location.y = Math.floor(Math.random() * initData.mapHeight);
  return location;
}

export function GenerateFactoryInventory(factory: FactoryModel): void {
  Object.keys(factory.productionLineData.consumptionQuantity).forEach(
    (resource) => {
      factory.inventoryData.consumption[resource] = new RecordItemData();
      factory.inventoryData.consumption[resource].quantity =
        factory.productionLineData.consumptionQuantity[resource] * 50;
      factory.inventoryData.consumption[resource].cost = 200;
    }
  );
  factory.inventoryData.production.quantity = 1000;
  factory.inventoryData.production.cost = 2000;
}

export function GenerateRandomWorkers(): void {
  Array.from({ length: initData.numberOfWorkers }, () => new WorkerModel());
  InitWorkerInventory();
  WorkerModel.allWorkers.forEach((worker) => {
    worker.location.x = Math.floor(Math.random() * 1000);
    worker.location.y = Math.floor(Math.random() * 1000);
    ChooseJob(worker);
  });
}

export function InitWorkerInventory(): void {
  WorkerModel.allWorkers.forEach((worker) => {
    worker.wallet = RandomIntBetween(1000, 2000);
    allResources.forEach((resource) => {
      worker.inventory[resource] = new RecordItemData();
      worker.inventory[resource].quantity = 100;
      worker.inventory[resource].cost = RandomIntBetween(100, 200);
    });
  });
}

export function RandomIntBetween(from: number, to: number) {
  const max = Math.max(from, to);
  const min = Math.min(from, to);
  return from + Math.floor(Math.random() * (max - min));
}

interval(3000).subscribe(() => {
  FactoryModel.allFactories.forEach((factory) => {
    factory.offeredPaycheck = Math.random() * 50;
  });
});
