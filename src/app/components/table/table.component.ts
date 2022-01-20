import { Component, Input, OnInit } from '@angular/core';
import { IDoubleTypedObject } from 'src/app/inner-logic/table.helpers';

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
    return this.getAllColumns(this.data);
  }

  getAllColumns(obj: IDoubleTypedObject<number>): string[] {
    const columnsSet = new Set<string>();
    Object.keys(obj).forEach((row) =>
      Object.keys(obj[row]).forEach((column) => columnsSet.add(column))
    );
    return Array.from(columnsSet);
  }
}
