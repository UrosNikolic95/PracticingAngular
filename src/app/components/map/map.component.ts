import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { length, moveTrigger } from 'src/app/inner-logic/logics';
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
    item.move = moveTrigger(
      item.location,
      goTo,
      length(item.location, goTo) * 3,
      () => this.randomMove(item)
    );
    item.location = goTo;
    return item;
  }
}
