import { CalculateIterationsForResource } from './logics';
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

export function MaxOfferredPrice(): TypedObjectLiteral<number> {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.offeredPrice
  );
  return data;
}

export function MinOfferredPrice(): TypedObjectLiteral<number> {
  const data = GetMinValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.offeredPrice
  );
  return data;
}

export function MinSellingStock(): TypedObjectLiteral<number> {
  const data = GetMinValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.inventoryData.production.totalQuantity
  );
  return data;
}

export function MaxSellingStock(): TypedObjectLiteral<number> {
  const data = GetMaxValues(
    FactoryModel.allFactories,
    (el) => el.producesResource,
    (el) => el.inventoryData.production.totalQuantity
  );
  return data;
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

export function MinIterations(): TypedObjectLiteral<number> {
  const data: TypedObjectLiteral<number> = {};
  FactoryModel.allFactories.forEach((factory) => {
    Object.keys(factory.inventoryData.consumption).forEach((resource) => {
      const iterations = CalculateIterationsForResource(factory, resource);
      if (!data[resource]) {
        data[resource] = iterations;
      } else if (data[resource] > iterations) {
        data[resource] = iterations;
      }
    });
  });
  return data;
}

export function MaxIterations(): TypedObjectLiteral<number> {
  const data: TypedObjectLiteral<number> = {};
  FactoryModel.allFactories.forEach((factory) => {
    Object.keys(factory.inventoryData.consumption).forEach((resource) => {
      const iterations = CalculateIterationsForResource(factory, resource);
      if (!data[resource]) {
        data[resource] = iterations;
      } else if (data[resource] < iterations) {
        data[resource] = iterations;
      }
    });
  });
  return data;
}
