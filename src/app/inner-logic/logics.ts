import {
  ConsumptionItemData,
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
      row.consumption[consumedResource] = Math.random() * 10;
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
    const consumption = productionData[producedResource].consumption;
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
    productionData[producedResource].production =
      total[producedResource] * productionCoeficiant;
  });
}
