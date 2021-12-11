import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CheckRequirements } from './inner-logic/logics';
import { FactoryModel } from './inner-logic/models';

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
      console.log('???', this.factoriesWithRequirements);
    });
  }
  title = 'PracticingAngular';

  factoriesWithRequirements = 0;
  lastUpdateTime = '';
}
