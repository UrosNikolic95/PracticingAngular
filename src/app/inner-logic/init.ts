import { initData } from './init.data';
import { CalculateRecordItemSetCost, GenerateProductionData } from './logics';
import { FactoryModel, Point } from './models';

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
    factory.inventoryData.consumption[resource].cost = 100000;
  });
  factory.inventoryData.production.quantity = 1000;
  factory.inventoryData.production.cost = 100000;
}
