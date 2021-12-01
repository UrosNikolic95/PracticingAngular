import {
  ConsumptionItemData,
  InventoryData,
  ProductionData,
  ProductionItemData,
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
    const row = new ProductionItemData();
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
  production: ProductionItemData,
  inventory: InventoryData
) {
  if (CheckRequirements(production, inventory)) {
    ProductionChange(production, inventory);
  }
}

function CheckRequirements(
  production: ProductionItemData,
  inventory: InventoryData
): boolean {
  const consumedResources = Object.keys(production.consumptionQuantity);
  return consumedResources.every((resource) => {
    return (
      inventory.consumption[resource] &&
      production.consumptionQuantity[resource] &&
      inventory.consumption[resource].quantity <=
        production.consumptionQuantity[resource]
    );
  });
}

function ProductionChange(
  production: ProductionItemData,
  inventory: InventoryData
): void {
  const consumedResources = Object.keys(production.consumptionQuantity);
  let totalCost = 0;
  consumedResources.forEach((resource) => {
    const recordItem = inventory.consumption[resource];
    const { quantity, cost } = recordItem;
    const consumedQuantity = production.consumptionQuantity[resource];
    const pricePart = consumedQuantity * (cost / quantity);
    recordItem.quantity -= consumedQuantity;
    recordItem.cost -= pricePart;
    totalCost += pricePart;
  });
  inventory.production.quantity += production.productionQuantity;
  inventory.production.cost += totalCost;
}
