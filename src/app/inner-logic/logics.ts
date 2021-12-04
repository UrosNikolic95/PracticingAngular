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

function CheckRequirements(factory: FactoryModel): boolean {
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

  console.log('current', cost, quantity);
  const resourcePrice = Math.min(
    Math.ceil(quantityTaken * (cost / quantity)),
    cost
  );

  const takenRecordItem = new RecordItemData();

  takenRecordItem.quantity = quantityTaken;
  takenRecordItem.cost = resourcePrice;
  console.log('taken', resourcePrice, quantityTaken);
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

export function ChooseJob(worker: WorkerModel): void {
  const factoriesWithJobs = FactoryModel.allFactories;
  // FactoryModel.allFactories
  // .filter((factory) =>
  //   CheckRequirements(factory)
  // );
  // console.log('factoriesWithJobs', factoriesWithJobs);
  const factoryWithMaxPaycheck =
    FindFactoryWithMaximumPaycheck(factoriesWithJobs);
  // console.log('factoryWithMaxPaycheck', factoryWithMaxPaycheck);
  if (!factoryWithMaxPaycheck) return;
  const taken = TakeManyResources(
    factoryWithMaxPaycheck.inventoryData,
    factoryWithMaxPaycheck.productionLineData.consumptionQuantity
  );
  // console.log('taken', taken);
  // console.log(
  //   'factoryWithMaxPaycheck.inventoryData',
  //   factoryWithMaxPaycheck.inventoryData
  // );
  const cost = CalculateRecordItemSetCost(taken);
  // console.log('cost', cost);
  MoveWorker(worker, factoryWithMaxPaycheck.location, () => {
    setTimeout(() => {
      factoryWithMaxPaycheck.inventoryData.production.quantity +=
        factoryWithMaxPaycheck.productionLineData.productionQuantity;
      factoryWithMaxPaycheck.inventoryData.production.cost += cost;
      worker.wallet += factoryWithMaxPaycheck.offeredPaycheck;
      BuyResource(worker);
    }, 2000);
  });
}

export function BuyResource(worker: WorkerModel): void {
  const resource = FindResourceWithSmallestQuantity(worker);
  const seller = FindFactoryWithMinimumOfferedPrice(resource);
  MoveWorker(worker, seller.location, () => {
    worker.wallet -= seller.offeredPrice;
    const bougth = TakeSingleResource(1, seller.inventoryData.production);
    AddRecordItem(worker.inventory[resource], bougth);
    ChooseJob(worker);
  });
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

export function FindResourceWithSmallestQuantity(worker: WorkerModel): string {
  const resources = Object.keys(worker.inventory);
  return resources.reduce((previousResource, currentResource) => {
    if (
      worker.inventory[previousResource].quantity <
      worker.inventory[currentResource].quantity
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

export function MoveWorker(
  worker: WorkerModel,
  to: Point,
  callback?: () => void
): void {
  const from = worker.location;
  const milliseconds = Math.ceil(length(from, to));
  worker.move = GetMoveParams(from, to, milliseconds); //every time move field changes worker is trigering animation
  worker.location = to;
  if (callback) setTimeout(callback, milliseconds);
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
