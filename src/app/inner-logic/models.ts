export class FactoryModel {
  location = new Point();
  producesResource = '';
  offeredPaycheck = 0;
  offeredPrice = 0;
  productionLineData = new ProductionLineData();
  inventoryData = new InventoryData();
}

export class WorkerModel {
  location = new Point();
  move = new MoveParams();
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
  consumptionQuantity = new ConsumptionItemData();
}

export class ConsumptionItemData {
  [resource: string]: number;
}

export class InventoryData {
  production = new RecordItem();
  consumption = new RecordItemSet();
}

export class RecordItemSet {
  [resource: string]: RecordItem;
}

export class RecordItem {
  quantity = 0;
  cost = 0;
}
