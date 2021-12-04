import {
  QuantityData,
  FactoryModel,
  InventoryData,
  ProductionData,
  ProductionLineData,
  WorkerModel,
  RecordItemSetData,
  RecordItemData,
  Point,
  MoveParams,
} from './models';

export function GenerateProductionData(
  numberOfResources: number,
  productionCoeficiant: number
): ProductionData {
  const resources = Array.from({ length: numberOfResources }, (item, index) => {
    return 'resource' + index;
  });
  const productionData = GenerateConsumption(resources);
  const totalConsumption = GetTotalConsumption(productionData);
  SetProduction(productionData, totalConsumption, productionCoeficiant);
  return productionData;
}

function GenerateConsumption(resources: string[]): ProductionData {
  const productionData = new ProductionData();
  resources.forEach((producedResource) => {
    const row = new ProductionLineData();
    resources.forEach((consumedResource) => {
      row.consumptionQuantity[consumedResource] = Math.random() * 10;
    });
    productionData[producedResource] = row;
  });
  return productionData;
}

function GetTotalConsumption(productionData: ProductionData): QuantityData {
  const produced = Object.keys(productionData);
  const total = new QuantityData();
  produced.forEach((producedResource) => {
    const consumption = productionData[producedResource].consumptionQuantity;
    const consumed = Object.keys(consumption);
    consumed.forEach((consumedResource) => {
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
  total: QuantityData,
  productionCoeficiant: number
): void {
  const produced = Object.keys(productionData);
  produced.forEach((producedResource) => {
    productionData[producedResource].productionQuantity =
      total[producedResource] * productionCoeficiant;
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
  const consumedResources = Object.keys(productionLineData.consumptionQuantity);
  return consumedResources.every((resource) => {
    return (
      inventoryData.consumption[resource] &&
      productionLineData.consumptionQuantity[resource] &&
      inventoryData.consumption[resource].quantity <=
        productionLineData.consumptionQuantity[resource]
    );
  });
}

export function ProductionChange(factory: FactoryModel): void {
  const { productionLineData, inventoryData } = factory;
  const consumedResources = Object.keys(productionLineData.consumptionQuantity);
  let totalCost = 0;
  consumedResources.forEach((resource) => {
    const recordItem = inventoryData.consumption[resource];
    const { quantity, cost } = recordItem;
    const consumedQuantity = productionLineData.consumptionQuantity[resource];
    const resourcePrice = Math.ceil(consumedQuantity * (cost / quantity));
    recordItem.quantity -= consumedQuantity;
    recordItem.cost -= resourcePrice;
    totalCost += resourcePrice;
  });
  totalCost += factory.offeredPaycheck;
  inventoryData.production.quantity += productionLineData.productionQuantity;
  inventoryData.production.cost += totalCost;
}

export function TakeManyResources(
  inventoryData: InventoryData,
  quantityData: QuantityData
): RecordItemSetData {
  const resources = Object.keys(quantityData.consumption);
  const recordItemSet = new RecordItemSetData();
  resources.forEach((resource) => {
    const consumptionRecordItem = inventoryData.consumption[resource];
    const consumedQuantity = quantityData[resource];
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
  const { quantity, cost } = recordItem;
  const resourcePrice = Math.ceil(quantityTaken * (cost / quantity));
  recordItem.cost -= resourcePrice;
  recordItem.quantity -= quantityTaken;
  const takenRecordItem = new RecordItemData();
  takenRecordItem.cost = resourcePrice;
  takenRecordItem.quantity = quantityTaken;
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
  const factoriesWithJobs = FactoryModel.allFactories.filter((factory) =>
    CheckRequirements(factory)
  );
  const factoryWithMaxPaycheck =
    FindFactoryWIthMaximumPayceck(factoriesWithJobs);
}

function FindFactoryWIthMaximumPayceck(
  factories: FactoryModel[]
): FactoryModel | null {
  if (!factories || factories.length) return null;
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

export function moveTrigger(
  A: Point,
  B: Point,
  milliseconds: number,
  callback?: () => void
): MoveParams {
  const { x: x1, y: y1 } = A;
  const { x: x2, y: y2 } = B;
  const lengtUnit = 'px';
  const timeUnit = 'ms';
  if (callback) setTimeout(callback, milliseconds + 2000);
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
