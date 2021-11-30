export class FactoryModel {
  top = 0;
  left = 0;
}

export class WorkerModel {
  top = 0;
  left = 0;
  move = new MoveParams();
}

export class MoveParams {
  value = 0; //every time this changes animation is played
  params = new Params();
}

export class Params {
  time = ''; //example: 100ms string
  topStart = '';
  topEnd = '';
  leftStart = '';
  leftEnd = ''; //example: 100px string
}

export class Point {
  x = 0;
  y = 0;
}

export class ProductionData {
  [resource: string]: ProductionItemData;
}

export class ProductionItemData {
  production = 0;
  consumption = new ConsumptionItemData();
}

export class ConsumptionItemData {
  [resource: string]: number;
}

export class InventoryData {
  producesResource = '';
  production = new ConsumptionRecordItem();
  consumption = new ConsumptionRecord();
}

export class ConsumptionRecord {
  [resource: string]: ConsumptionRecordItem;
}

export class ConsumptionRecordItem {
  quantity = 0;
  spent = 0;
}
