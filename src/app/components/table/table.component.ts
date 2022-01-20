import { Component, Input, OnInit } from '@angular/core';
import {
  getAllColumns,
  IDoubleTypedObject,
} from 'src/app/inner-logic/table.helpers';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  constructor() {}

  @Input()
  data: IDoubleTypedObject<number> = {};

  ngOnInit(): void {}

  get rows(): string[] {
    return Object.keys(this.data);
  }

  get columns() {
    return getAllColumns(this.data);
  }
}
