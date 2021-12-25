import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CheckRequirements } from './inner-logic/logics';
import { FactoryModel } from './inner-logic/models';
import {
  FactoryMaxWallet,
  FactoryMinWallet,
  WorkerMaxWallet,
  WorkerMinWallet,
} from './inner-logic/statistics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    interval(1000).subscribe(() => {
      this.lastUpdateTime = new Date().toISOString();
      this.factoriesWithRequirements = FactoryModel.allFactories.filter(
        (factory) => CheckRequirements(factory)
      ).length;
      this.factoryMaxWallet = FactoryMaxWallet();
      this.factoryMinWallet = FactoryMinWallet();
      this.workerMaxWallet = WorkerMaxWallet();
      this.workerMinWallet = WorkerMinWallet();
      console.log('???', this.factoriesWithRequirements);
    });
  }
  title = 'PracticingAngular';

  factoriesWithRequirements = 0;
  lastUpdateTime = '';

  factoryMinWallet = 0;
  factoryMaxWallet = 0;
  workerMinWallet = 0;
  workerMaxWallet = 0;
}
