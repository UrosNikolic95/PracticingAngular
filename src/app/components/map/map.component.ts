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
  GenerateRandomFactories,
  GenerateRandomWorkers,
} from 'src/app/inner-logic/init';
import { length, GetMoveParams } from 'src/app/inner-logic/logics';
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
    GenerateRandomFactories();
    this.factories = FactoryModel.allFactories;
    GenerateRandomWorkers();
    this.workers = WorkerModel.allWorkers;
    this.workers.forEach((w) => {
      console.log(w.move);
    });
  }

  randomMove(item: WorkerModel, callback?: () => void): WorkerModel {
    const goTo = new Point();
    goTo.x = Math.floor(Math.random() * 1000);
    goTo.y = Math.floor(Math.random() * 1000);
    const milliseconds = length(item.location, goTo) * 3;
    setTimeout(() => this.randomMove(item), milliseconds + 2000);
    item.move = GetMoveParams(item.location, goTo, milliseconds);
    item.location = goTo;
    return item;
  }
}
