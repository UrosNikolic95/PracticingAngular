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
  WorkerModel,
} from 'src/app/inner-logic/random-stuf';

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
      item.left = Math.floor(Math.random() * 1000);
      item.top = Math.floor(Math.random() * 1000);
    });
    this.workers = Array.from({ length: 100 }, () => new WorkerModel());
    this.workers.forEach((item) => {
      item.left = Math.floor(Math.random() * 1000);
      item.top = Math.floor(Math.random() * 1000);
      setTimeout(() => {
        this.randomMove(item);
      }, 3000);
    });
  }

  randomMove(item: WorkerModel, callback?: () => void): WorkerModel {
    const leftEnd = Math.floor(Math.random() * 1000);
    const topEnd = Math.floor(Math.random() * 1000);
    item.move = this.moveTrigger(
      item.top,
      item.left,
      topEnd,
      leftEnd,
      this.length(item.top, item.left, topEnd, leftEnd) * 3,
      () => this.randomMove(item)
    );
    item.left = leftEnd;
    item.top = topEnd;
    return item;
  }

  moveTrigger(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    milliseconds: number,
    callback?: () => void
  ): MoveParams {
    const lengtUnit = 'px';
    const timeUnit = 'ms';
    if (callback) setTimeout(callback, milliseconds);
    return {
      value: Date.now(), //every time this changes animation is played
      params: {
        time: milliseconds + timeUnit,
        topStart: x1 + lengtUnit,
        topEnd: x2 + lengtUnit,
        leftStart: y1 + lengtUnit,
        leftEnd: y2 + lengtUnit,
      },
    };
  }

  length(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
