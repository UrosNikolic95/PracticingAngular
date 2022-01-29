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
import { NextWorkerJob } from './workflow';

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
    productionData[producedResource].productionQuantity = Math.ceil(
      total[producedResource] * initData.productionCoeficiant
    );
  });
}

export function CheckRequirements(factory: FactoryModel): boolean {
  const { productionLineData, inventoryData } = factory;
  return (
    Object.keys(productionLineData.consumptionQuantity).every((resource) => {
      return (
        inventoryData.consumption[resource] &&
        productionLineData.consumptionQuantity[resource] &&
        inventoryData.consumption[resource].totalQuantity >=
          productionLineData.consumptionQuantity[resource]
      );
    }) &&
    factory.currentWorkers < factory.maxWorkers &&
    factory.offeredPaycheck <= factory.wallet
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
    recordItemSet[resource] = TakeSingleTypeOfResource(
      consumedQuantity,
      consumptionRecordItem
    );
  });
  return recordItemSet;
}

export function TakeSingleTypeOfResource(
  quantityTaken: number,
  recordItem: RecordItemData
): RecordItemData {
  const taken = CalculatePart(quantityTaken, recordItem);
  SubtractRecordItem(recordItem, taken);
  return taken;
}

export function SubtractRecordItem(A: RecordItemData, B: RecordItemData) {
  A.totalQuantity -= B.totalQuantity;
  A.totalCost -= B.totalCost;
}

export function AddRecordItem(A: RecordItemData, B: RecordItemData) {
  A.totalQuantity += B.totalQuantity;
  A.totalCost += B.totalCost;
}

export function CalculatePart(
  quantityTaken: number,
  recordItem: RecordItemData
): RecordItemData {
  const { totalQuantity, totalCost } = recordItem;
  if (!totalQuantity) return new RecordItemData();

  const resourcePrice = Math.min(
    Math.ceil(quantityTaken * (totalCost / totalQuantity)),
    totalCost
  );

  const takenRecordItem = new RecordItemData();

  takenRecordItem.totalQuantity = quantityTaken;
  takenRecordItem.totalCost = resourcePrice;
  return takenRecordItem;
}

export function CalculateRecordItemSetCost(
  recordItemSet: RecordItemSetData
): number {
  const resources = Object.keys(recordItemSet);
  return resources.reduce((previous, current) => {
    return previous + recordItemSet[current].totalCost;
  }, 0);
}

export async function ChooseJob(worker: WorkerModel): Promise<void> {
  const factoriesWithJobs = FactoryModel.allFactories.filter((factory) =>
    CheckRequirements(factory)
  );
  const factoryWithMaxPaycheck =
    FindFactoryWithMaximumPaycheck(factoriesWithJobs);

  if (!factoryWithMaxPaycheck) {
    NextWorkerJob(worker);
    return;
  }

  factoryWithMaxPaycheck.currentWorkers++;
  const taken = TakeManyResources(
    factoryWithMaxPaycheck.inventoryData,
    factoryWithMaxPaycheck.productionLineData.consumptionQuantity
  );
  const cost = CalculateRecordItemSetCost(taken);
  await MoveWorker(worker, factoryWithMaxPaycheck.location);

  await Sleep(2000); //work takes time to be done

  factoryWithMaxPaycheck.inventoryData.production.totalQuantity +=
    factoryWithMaxPaycheck.productionLineData.productionQuantity;
  factoryWithMaxPaycheck.inventoryData.production.totalCost += cost;
  factoryWithMaxPaycheck.wallet -= factoryWithMaxPaycheck.offeredPaycheck;
  worker.wallet += factoryWithMaxPaycheck.offeredPaycheck;
  factoryWithMaxPaycheck.currentWorkers--;

  NextWorkerJob(worker);
}

export function FindResourceWithSmallestQuantity(
  inventory: RecordItemSetData
): string {
  const resources = Object.keys(inventory);
  return resources.reduce((previousResource, currentResource) => {
    if (
      inventory[previousResource].totalQuantity <
      inventory[currentResource].totalQuantity
    ) {
      return previousResource;
    } else {
      return currentResource;
    }
  }, resources[0]);
}

export async function BuyResource(worker: WorkerModel): Promise<void> {
  const resource = FindResourceWithSmallestQuantity(worker.inventory);
  const seller = FindFactoryWithMinimumOfferedPrice(resource);
  const affordable = Math.max(
    Math.floor(worker.wallet / seller.offeredPrice),
    0
  );

  if (affordable == 0) {
    console.log('worker affordable == 0');
    NextWorkerJob(worker);
    return;
  }

  const quantity = Math.min(
    seller.inventoryData.production.totalQuantity,
    affordable,
    10
  );

  // WARNING: Until worker comes to the factory offered price can change!!!
  // Remember it while hiring, then apply it later.
  const hiringPaycheck = seller.offeredPrice;
  await MoveWorker(worker, seller.location);
  worker.wallet -= quantity * hiringPaycheck;
  seller.wallet += quantity * hiringPaycheck;
  const bougth = TakeSingleTypeOfResource(
    quantity,
    seller.inventoryData.production
  );
  AddRecordItem(worker.inventory[resource], bougth);
  NextWorkerJob(worker);
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

export function CalculateIterationsForResource(
  factory: FactoryModel,
  resource: string
): number {
  const consumption = factory.productionLineData.consumptionQuantity[resource];
  const inventory = factory.inventoryData.consumption[resource].totalQuantity;
  return Math.floor(inventory / consumption);
}

export function FindResourceWithsmallestRunoutIterations(
  factory: FactoryModel
): string {
  const consumptionQuantity = factory.productionLineData.consumptionQuantity;
  const inventoryConsumption = factory.inventoryData.consumption;
  const resources = Object.keys(consumptionQuantity);
  return resources.reduce((previousResource, currentResource) => {
    if (
      CalculateIterationsForResource(factory, previousResource) <
      CalculateIterationsForResource(factory, currentResource)
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
  const resource = FindResourceWithsmallestRunoutIterations(factory);

  const seller = FindFactoryWithMinimumOfferedPrice(resource);

  const affordable = Math.max(
    Math.floor(factory.wallet / seller.offeredPrice),
    0
  );

  if (affordable == 0) {
    console.log('factory affordable == 0');
    return;
  }

  const quantity = Math.min(
    factory.productionLineData.consumptionQuantity[resource],
    seller.inventoryData.production.totalQuantity,
    affordable
  );

  const takenResource = TakeSingleTypeOfResource(
    quantity,
    seller.inventoryData.production
  );

  AddRecordItem(factory.inventoryData.consumption[resource], takenResource);

  factory.wallet -= takenResource.totalCost;
  seller.wallet += takenResource.totalCost;
}
