export class FactoryModel {
  static allFactories: FactoryModel[] = [];
  constructor() {
    FactoryModel.allFactories.push(this);
  }

  location = new Point();
  producesResource = '';
  offeredPaycheck = 0;
  offeredPrice = 0;
  productionLineData = new ProductionLineData();
  inventoryData = new FactoryInventoryData();
}

export class WorkerModel {
  static allWorkers: WorkerModel[] = [];
  constructor() {
    WorkerModel.allWorkers.push(this);
  }

  location = new Point();
  move = new MoveParams();
  wallet = 0;
  inventory = new RecordItemSetData();
}

export class MoveParams {
  value = 0; //every time this changes animation is played
  params = new Params();
}

export class Params {
  time = ''; //example: 100ms string
  topStart = ''; //example: 100px string
  topEnd = ''; //example: 100px string
  leftStart = ''; //example: 100px string
  leftEnd = ''; //example: 100px string
}

export class Point {
  x = 0;
  y = 0;
}

export class ProductionData {
  [resource: string]: ProductionLineData;
}

export class ProductionLineData {
  productionQuantity = 0;
  consumptionQuantity = new QuantityData();
}

export class QuantityData {
  [resource: string]: number;
}

export class FactoryInventoryData {
  production = new RecordItemData();
  consumption = new RecordItemSetData();
}

export class RecordItemSetData {
  [resource: string]: RecordItemData;
}

export class RecordItemData {
  quantity = 0;
  cost = 0;
}
