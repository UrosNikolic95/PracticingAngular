import { interval } from 'rxjs';
import { initData } from './init.data';
import {
  allResources,
  CalculateRecordItemSetCost,
  ChooseJob,
  FactoryBuyResources,
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
        factory.wallet = RandomIntBetween(1000, 2000);
        GenerateFactoryInventory(factory);
        CalculateOfferedPrice(factory);
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
      factory.inventoryData.consumption[resource].totalQuantity =
        factory.productionLineData.consumptionQuantity[resource] * 5;
      factory.inventoryData.consumption[resource].totalCost = 200;
    }
  );
  factory.inventoryData.production.totalQuantity = 1000;
  factory.inventoryData.production.totalCost = 2000;
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
      worker.inventory[resource].totalQuantity = RandomIntBetween(100, 200);
      worker.inventory[resource].totalCost = RandomIntBetween(100, 200);
    });
  });
}

export function CalculateOfferedPrice(factory: FactoryModel): void {
  factory.offeredPrice = Math.floor(
    CalculateRecordItemSetCost(factory.inventoryData.consumption) *
      initData.profitCoeficiant +
      RandomIntUpto(20)
  );
}

export function RandomIntUpto(upto: number) {
  return Math.floor(Math.random() * upto);
}

export function RandomIntBetween(from: number, to: number) {
  const max = Math.max(from, to);
  const min = Math.min(from, to);
  return min + RandomIntUpto(max - min);
}

interval(500).subscribe(() => {
  FactoryModel.allFactories.forEach((factory) => {
    FactoryBuyResources(factory);
    CalculateOfferedPrice(factory);
  });
});
