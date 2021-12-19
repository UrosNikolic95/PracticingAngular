export class FactoryModel {
  static allFactories: FactoryModel[] = [];
  constructor() {
    FactoryModel.allFactories.push(this);
  }

  location = new Point();
  wallet = 0;
  producesResource = '';
  offeredPaycheck = 0;
  offeredPrice = 0;
  productionLineData = new ProductionLineData();
  inventoryData = new FactoryInventoryData();
  maxWorkers = 10;
  currentWorkers = 0;
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
  jobIndex = 0;
}

export class MoveParams {
  value = 0; //every time this changes animation is played
  params = new Params();
}

export class Params {
  time = '0ms'; //example: 100ms string
  topStart = '0px'; //example: 100px string
  topEnd = '0px'; //example: 100px string
  leftStart = '0px'; //example: 100px string
  leftEnd = '0px'; //example: 100px string
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
  totalQuantity = 0;
  totalCost = 0;
}
