import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import {
  FactoryModel,
  MoveParams,
  Point,
  WorkerModel,
} from 'src/app/inner-logic/models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  animations: [
    trigger('move', [
      transition(
        '* => *',
        animate(
          '{{time}}',
          keyframes([
            style({
              top: '{{topStart}}',
              left: '{{leftStart}}',
            }),
            style({
              top: '{{topEnd}}',
              left: '{{leftEnd}}',
            }),
          ])
        )
      ),
    ]),
  ],
})
export class MapComponent implements OnInit {
  factories: FactoryModel[] = [];
  workers: WorkerModel[] = [];

  constructor() {}

  ngOnInit(): void {
    this.factories = Array.from({ length: 1 }, () => new FactoryModel());
    this.factories.forEach((item) => {
      item.location.x = Math.floor(Math.random() * 1000);
      item.location.y = Math.floor(Math.random() * 1000);
    });
    this.workers = Array.from({ length: 100 }, () => new WorkerModel());
    this.workers.forEach((item) => {
      item.location.x = Math.floor(Math.random() * 1000);
      item.location.y = Math.floor(Math.random() * 1000);
      this.randomMove(item);
    });
  }

  randomMove(item: WorkerModel, callback?: () => void): WorkerModel {
    const goTo = new Point();
    goTo.x = Math.floor(Math.random() * 1000);
    goTo.y = Math.floor(Math.random() * 1000);
    item.move = this.moveTrigger(
      item.location,
      goTo,
      this.length(item.location, goTo) * 3,
      () => this.randomMove(item)
    );
    item.location = goTo;
    return item;
  }

  moveTrigger(
    A: Point,
    B: Point,
    milliseconds: number,
    callback?: () => void
  ): MoveParams {
    const { x: x1, y: y1 } = A;
    const { x: x2, y: y2 } = B;
    const lengtUnit = 'px';
    const timeUnit = 'ms';
    if (callback) setTimeout(callback, milliseconds + 2000);
    return {
      value: Date.now(), //every time this changes animation is played
      params: {
        time: milliseconds + timeUnit,
        topStart: y1 + lengtUnit,
        topEnd: y2 + lengtUnit,
        leftStart: x1 + lengtUnit,
        leftEnd: x2 + lengtUnit,
      },
    };
  }

  length(A: Point, B: Point): number {
    const { x: x1, y: y1 } = A;
    const { x: x2, y: y2 } = B;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
