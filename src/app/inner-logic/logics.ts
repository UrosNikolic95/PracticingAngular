import { initData } from './init.data';
import {
  QuantityData,
  FactoryModel,
  FactoryInventoryData,
  ProductionData,
  ProductionLineData,
  WorkerModel,
  RecordItemSetData,
  RecordItemData,
  Point,
  MoveParams,
} from './models';

export const allResources: string[] = Array.from(
  { length: initData.numberOfResouces },
  (item, index) => {
    return 'resource' + index;
  }
);

export function GenerateProductionData(): ProductionData {
  const productionData = GenerateConsumption(allResources);
  const totalConsumption = GetTotalConsumption(productionData);
  SetProduction(productionData, totalConsumption);
  return productionData;
}

function GenerateConsumption(resources: string[]): ProductionData {
  const productionData = new ProductionData();
  resources.forEach((producedResource) => {
    const newProductionLineData = new ProductionLineData();
    resources.forEach((consumedResource) => {
      newProductionLineData.consumptionQuantity[consumedResource] = Math.ceil(
        Math.random() * 10
      );
    });
    productionData[producedResource] = newProductionLineData;
  });
  return productionData;
}

function GetTotalConsumption(productionData: ProductionData): QuantityData {
  const produced = Object.keys(productionData);
  const total = new QuantityData();
  produced.forEach((producedResource) => {
    const consumption = productionData[producedResource].consumptionQuantity;
    Object.keys(consumption).forEach((consumedResource) => {
      if (!total[consumedResource]) {
        total[consumedResource] = 0;
      }
      total[consumedResource] += consumption[consumedResource];
    });
  });
  return total;
}

function SetProduction(
  productionData: ProductionData,
  total: QuantityData
): void {
  const produced = Object.keys(productionData);
  produced.forEach((producedResource) => {
    productionData[producedResource].productionQuantity =
      total[producedResource] * initData.productionCoeficiant;
  });
}

export function Produce(factory: FactoryModel, worker: WorkerModel) {
  if (CheckRequirements(factory)) {
    const taken = TakeManyResources(
      factory.inventoryData,
      factory.productionLineData.consumptionQuantity
    );
    const cost = CalculateRecordItemSetCost(taken);
    worker.wallet += cost;
  }
}
export function CheckRequirements(factory: FactoryModel): boolean {
  const { productionLineData, inventoryData } = factory;
  return Object.keys(productionLineData.consumptionQuantity).every(
    (resource) => {
      return (
        inventoryData.consumption[resource] &&
        productionLineData.consumptionQuantity[resource] &&
        inventoryData.consumption[resource].quantity >=
          productionLineData.consumptionQuantity[resource]
      );
    }
  );
}

export function TakeManyResources(
  inventoryData: FactoryInventoryData,
  quantityData: QuantityData
): RecordItemSetData {
  const recordItemSet = new RecordItemSetData();
  Object.keys(quantityData).forEach((resource) => {
    const consumedQuantity = quantityData[resource];
    const consumptionRecordItem = inventoryData.consumption[resource];
    recordItemSet[resource] = TakeSingleResource(
      consumedQuantity,
      consumptionRecordItem
    );
  });
  return recordItemSet;
}

export function TakeSingleResource(
  quantityTaken: number,
  recordItem: RecordItemData
): RecordItemData {
  const taken = CalculatePart(quantityTaken, recordItem);
  SubtractRecordItem(recordItem, taken);
  return taken;
}

export function SubtractRecordItem(A: RecordItemData, B: RecordItemData) {
  A.quantity -= B.quantity;
  A.cost -= B.cost;
}

export function AddRecordItem(A: RecordItemData, B: RecordItemData) {
  A.quantity += B.quantity;
  A.cost += B.cost;
}

export function CalculatePart(
  quantityTaken: number,
  recordItem: RecordItemData
): RecordItemData {
  const { quantity, cost } = recordItem;
  if (!quantity) return new RecordItemData();

  const resourcePrice = Math.min(
    Math.ceil(quantityTaken * (cost / quantity)),
    cost
  );

  const takenRecordItem = new RecordItemData();

  takenRecordItem.quantity = quantityTaken;
  takenRecordItem.cost = resourcePrice;
  return takenRecordItem;
}

export function CalculateRecordItemSetCost(
  recordItemSet: RecordItemSetData
): number {
  const resources = Object.keys(recordItemSet);
  return resources.reduce((previous, current) => {
    return previous + recordItemSet[current].cost;
  }, 0);
}

export async function ChooseJob(worker: WorkerModel): Promise<void> {
  const withReq = FactoryModel.allFactories.filter(
    (factory) =>
      CheckRequirements(factory) && factory.currentWorkers < factory.maxWorkers
  );
  const factoriesWithJobs = withReq.length
    ? withReq
    : FactoryModel.allFactories;
  const factoryWithMaxPaycheck =
    FindFactoryWithMaximumPaycheck(factoriesWithJobs);
  if (!factoryWithMaxPaycheck) return;
  factoryWithMaxPaycheck.currentWorkers++;
  const taken = TakeManyResources(
    factoryWithMaxPaycheck.inventoryData,
    factoryWithMaxPaycheck.productionLineData.consumptionQuantity
  );
  const cost = CalculateRecordItemSetCost(taken);
  await MoveWorker(worker, factoryWithMaxPaycheck.location);

  await Sleep(2000);
  factoryWithMaxPaycheck.inventoryData.production.quantity +=
    factoryWithMaxPaycheck.productionLineData.productionQuantity;
  factoryWithMaxPaycheck.inventoryData.production.cost += cost;
  worker.wallet += factoryWithMaxPaycheck.offeredPaycheck;
  factoryWithMaxPaycheck.currentWorkers--;

  BuyResource(worker);
}

export async function BuyResource(worker: WorkerModel): Promise<void> {
  const resource = FindResourceWithSmallestQuantity(worker.inventory);
  const seller = FindFactoryWithMinimumOfferedPrice(resource);

  await MoveWorker(worker, seller.location);

  worker.wallet -= seller.offeredPrice;
  const bougth = TakeSingleResource(1, seller.inventoryData.production);
  AddRecordItem(worker.inventory[resource], bougth);
  ChooseJob(worker);
}

export function FindFactoryWithMinimumOfferedPrice(resource: string) {
  const filtered = FactoryModel.allFactories.filter(
    (factory) => factory.producesResource == resource
  );
  return filtered.reduce((previous, current) => {
    if (previous.offeredPrice < current.offeredPrice) {
      return previous;
    } else {
      return current;
    }
  }, filtered[0]);
}

export function FindResourceWithSmallestQuantity(
  inventory: RecordItemSetData
): string {
  const resources = Object.keys(inventory);
  return resources.reduce((previousResource, currentResource) => {
    if (
      inventory[previousResource].quantity < inventory[currentResource].quantity
    ) {
      return previousResource;
    } else {
      return currentResource;
    }
  }, resources[0]);
}

function FindFactoryWithMaximumPaycheck(
  factories: FactoryModel[]
): FactoryModel | null {
  if (!factories || !factories.length) return null;
  return factories.reduce((previous, current) => {
    if (previous.offeredPaycheck < current.offeredPaycheck) {
      return current;
    } else {
      return previous;
    }
  }, factories[0]);
}

export function length(A: Point, B: Point): number {
  const { x: x1, y: y1 } = A;
  const { x: x2, y: y2 } = B;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export async function MoveWorker(
  worker: WorkerModel,
  to: Point
): Promise<void> {
  const from = worker.location;
  const milliseconds = Math.ceil(length(from, to));
  worker.move = GetMoveParams(from, to, milliseconds); //every time move field changes worker is trigering animation
  worker.location = to;
  await Sleep(milliseconds);
}

export function Sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function GetMoveParams(
  form: Point,
  to: Point,
  milliseconds: number
): MoveParams {
  const { x: x1, y: y1 } = form;
  const { x: x2, y: y2 } = to;
  const lengtUnit = 'px';
  const timeUnit = 'ms';
  return {
    value: Date.now(), //every time this changes animation is played
    params: {
      time: milliseconds + timeUnit,
      topStart: y1 + lengtUnit,
      topEnd: y2 + lengtUnit,
      leftStart: x1 + lengtUnit,
      leftEnd: x2 + lengtUnit,
    },
  };
}

export function FactoryBuyResources(factory: FactoryModel): void {
  const resource = FindResourceWithSmallestQuantity(
    factory.inventoryData.consumption
  );
  const seller = FindFactoryWithMinimumOfferedPrice(resource);

  const quantity = Math.min(
    factory.productionLineData.consumptionQuantity[resource],
    seller.inventoryData.production.quantity
  );

  TakeSingleResource(quantity, seller.inventoryData.production);

  factory.inventoryData.consumption[resource].quantity += quantity;
  factory.inventoryData.consumption[resource].cost +=
    quantity * seller.offeredPrice;
  factory.wallet -= quantity * seller.offeredPrice;
  seller.wallet += quantity * seller.offeredPrice;
}
