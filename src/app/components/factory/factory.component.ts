import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FactoryModel } from 'src/app/inner-logic/random-stuf';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css'],
})
export class FactoryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    if (this.factory) {
      this.top = this.factory?.top;
      this.left = this.factory?.left;
    }
  }

  @Input()
  factory: FactoryModel | undefined;

  @HostBinding('style.top.px')
  public top = 0;
  @HostBinding('style.left.px')
  public left = 0;
}
