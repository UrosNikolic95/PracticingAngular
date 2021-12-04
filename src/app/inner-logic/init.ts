import { initData } from './init.data';
import {
  allResources,
  CalculateRecordItemSetCost,
  GenerateProductionData,
} from './logics';
import { FactoryModel, Point, WorkerModel } from './models';

export function GenerateRandomFactories(): void {
  const productionData = GenerateProductionData();
  Object.keys(productionData).forEach((resource) => {
    Array.from(
      {
        length: 10, //generate 10 factories per each resource
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
  const resources = Object.keys(factory.productionLineData.consumptionQuantity);
  resources.forEach((resource) => {
    factory.inventoryData.consumption[resource].quantity = 1000;
    factory.inventoryData.consumption[resource].cost = RandomIntBetween(
      100000,
      200000
    );
  });
  factory.inventoryData.production.quantity = 1000;
  factory.inventoryData.production.cost = RandomIntBetween(100000, 200000);
}

export function InitWorkerInventory(): void {
  WorkerModel.allWorkers.forEach((worker) => {
    allResources.forEach((resource) => {
      worker.inventory[resource].quantity = RandomIntBetween(100, 200);
      worker.inventory[resource].cost = RandomIntBetween(100, 200);
    });
  });
}

export function RandomIntBetween(from: number, to: number) {
  const max = Math.max(from, to);
  const min = Math.min(from, to);
  return from + Math.floor(Math.random() * (max - min));
}
