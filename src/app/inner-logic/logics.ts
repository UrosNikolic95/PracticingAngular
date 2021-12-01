import {
  ConsumptionItemData,
  InventoryData,
  ProductionData,
  ProductionLineData,
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

function GetTotalConsumption(
  productionData: ProductionData
): ConsumptionItemData {
  const produced = Object.keys(productionData);
  const total = new ConsumptionItemData();
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
  total: ConsumptionItemData,
  productionCoeficiant: number
): void {
  const produced = Object.keys(productionData);
  produced.forEach((producedResource) => {
    productionData[producedResource].productionQuantity =
      total[producedResource] * productionCoeficiant;
  });
}

export function Produce(
  productionLineData: ProductionLineData,
  inventoryData: InventoryData
) {
  if (CheckRequirements(productionLineData, inventoryData)) {
    ProductionChange(productionLineData, inventoryData);
  }
}

function CheckRequirements(
  productionLineData: ProductionLineData,
  inventoryData: InventoryData
): boolean {
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

function ProductionChange(
  productionLineData: ProductionLineData,
  inventoryData: InventoryData
): void {
  const consumedResources = Object.keys(productionLineData.consumptionQuantity);
  let totalCost = 0;
  consumedResources.forEach((resource) => {
    const recordItem = inventoryData.consumption[resource];
    const { quantity, cost } = recordItem;
    const consumedQuantity = productionLineData.consumptionQuantity[resource];
    const resourcePrice = consumedQuantity * (cost / quantity);
    recordItem.quantity -= consumedQuantity;
    recordItem.cost -= resourcePrice;
    totalCost += resourcePrice;
  });
  inventoryData.production.quantity += productionLineData.productionQuantity;
  inventoryData.production.cost += totalCost;
}
