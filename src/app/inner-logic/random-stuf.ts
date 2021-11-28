export class FactoryModel {
  top: number = 0;
  left: number = 0;
}

export class WorkerModel {
  top: number = 0;
  left: number = 0;
  move: MoveParams = new MoveParams();
}

export class MoveParams {
  value = 0; //every time this changes animation is played
  params = new Params();
}

export class Params {
  time = ''; //example: 100ms
  topStart = '';
  topEnd = '';
  leftStart = '';
  leftEnd = ''; //example: 100px
}

export interface IPoint {
  x: number;
  y: number;
}
