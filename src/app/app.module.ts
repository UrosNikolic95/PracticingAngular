import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FactoryComponent } from './components/factory/factory.component';
import { MapComponent } from './components/map/map.component';
import { WorkerComponent } from './components/worker/worker.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkerComponent,
    FactoryComponent,
    MapComponent,
    TableComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
