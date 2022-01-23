import {
  FactoryModel,
  ObjectLiteral,
  ResourceOfferredPriceData,
  ResourceQuantityData,
  TypedObjectLiteral,
  WorkerModel,
} from './models';
import { IObj } from './table.helpers';

export function FactoryMinWallet(): number {
  return Math.min(...FactoryModel.allFactories.map((f) => f.wallet));
}

export function FactoryMaxWallet(): number {
  return Math.max(...FactoryModel.allFactories.map((f) => f.wallet));
}

export function WorkerMinWallet(): number {
  return Math.min(...WorkerModel.allWorkers.map((w) => w.wallet));
}

export function WorkerMaxWallet(): number {
  return Math.max(...WorkerModel.allWorkers.map((w) => w.wallet));
}

export function TotalFactoryWallet(): number {
  return FactoryModel.allFactories.reduce((sum, f) => sum + f.wallet, 0);
}

export function TotlaWorkerWallet(): number {
  return WorkerModel.allWorkers.reduce((sum, f) => sum + f.wallet, 0);
}

export function AfordableWorkplaces(): number {
  return FactoryModel.allFactories.reduce(
    (sum, f) => (f.offeredPaycheck <= f.wallet ? sum + 1 : sum),
    0
  );
}

export function MaxOfferredPrice(): ResourceOfferredPriceData[] {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.offeredPrice
  );
  return Object.keys(data).map((resource) => {
    const val = new ResourceOfferredPriceData();
    val.offeredPrice = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MinOfferredPrice(): ResourceOfferredPriceData[] {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.offeredPrice
  );
  return Object.keys(data).map((resource) => {
    const val = new ResourceOfferredPriceData();
    val.offeredPrice = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MinSellingStock(): ResourceQuantityData[] {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.inventoryData.production.totalQuantity
  );
  return Object.keys(data).map((resource) => {
    const val = new ResourceQuantityData();
    val.quantity = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MaxSellingStock(): ResourceQuantityData[] {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.inventoryData.production.totalQuantity
  );
  return Object.keys(data).map((resource) => {
    const val = new ResourceQuantityData();
    val.quantity = data[resource];
    val.resource = resource;
    return val;
  });
}

export function GetMinValues<T>(
  items: T[],
  getKey: (el: T) => string,
  getValue: (el: T) => number
): TypedObjectLiteral<number> {
  const data = new TypedObjectLiteral<number>();
  items.forEach((item) => {
    const key = getKey(item);
    const val = getValue(item);
    if (!data[key]) {
      data[key] = val;
    } else if (data[key] > val) {
      data[key] = val;
    }
  });
  return data;
}

export function GetMaxValues<T>(
  items: T[],
  getKey: (el: T) => string,
  getValue: (el: T) => number
): TypedObjectLiteral<number> {
  const data = new TypedObjectLiteral<number>();
  items.forEach((item) => {
    const key = getKey(item);
    const val = getValue(item);
    if (!data[key]) {
      data[key] = val;
    } else if (data[key] < val) {
      data[key] = val;
    }
  });
  return data;
}
