import {
  FactoryModel,
  ObjectLiteral,
  ResourceOfferredPriceData,
  ResourceQuantityData,
  TypedObjectLiteral,
  WorkerModel,
} from './models';

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
  const data = new TypedObjectLiteral<number>();
  FactoryModel.allFactories.forEach((factory) => {
    if (!data[factory.producesResource]) {
      data[factory.producesResource] = factory.offeredPrice;
    } else if (data[factory.producesResource] < factory.offeredPrice) {
      data[factory.producesResource] = factory.offeredPrice;
    }
  });
  return Object.keys(data).map((resource) => {
    const val = new ResourceOfferredPriceData();
    val.offeredPrice = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MinOfferredPrice(): ResourceOfferredPriceData[] {
  const data = new TypedObjectLiteral<number>();
  FactoryModel.allFactories.forEach((factory) => {
    if (!data[factory.producesResource]) {
      data[factory.producesResource] = factory.offeredPrice;
    } else if (data[factory.producesResource] > factory.offeredPrice) {
      data[factory.producesResource] = factory.offeredPrice;
    }
  });
  return Object.keys(data).map((resource) => {
    const val = new ResourceOfferredPriceData();
    val.offeredPrice = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MinSellingStock(): ResourceQuantityData[] {
  const data = new TypedObjectLiteral<number>();
  FactoryModel.allFactories.forEach((factory) => {
    if (!data[factory.producesResource]) {
      data[factory.producesResource] =
        factory.inventoryData.production.totalQuantity;
    } else if (
      data[factory.producesResource] >
      factory.inventoryData.production.totalQuantity
    ) {
      data[factory.producesResource] =
        factory.inventoryData.production.totalQuantity;
    }
  });
  return Object.keys(data).map((resource) => {
    const val = new ResourceQuantityData();
    val.quantity = data[resource];
    val.resource = resource;
    return val;
  });
}

export function MaxSellingStock(): ResourceQuantityData[] {
  const data = new TypedObjectLiteral<number>();
  FactoryModel.allFactories.forEach((factory) => {
    if (!data[factory.producesResource]) {
      data[factory.producesResource] =
        factory.inventoryData.production.totalQuantity;
    } else if (
      data[factory.producesResource] <
      factory.inventoryData.production.totalQuantity
    ) {
      data[factory.producesResource] =
        factory.inventoryData.production.totalQuantity;
    }
  });
  return Object.keys(data).map((resource) => {
    const val = new ResourceQuantityData();
    val.quantity = data[resource];
    val.resource = resource;
    return val;
  });
}
