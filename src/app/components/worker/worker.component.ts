import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input()
  @HostBinding('style.top.px')
  public top = 0;
  @Input()
  @HostBinding('style.left.px')
  public left = 0;
}
