import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { WarningComponent } from './components/warning/warning.component';
import {StatsChartComponent} from "./components/stats-chart/stats-chart.component";

@NgModule({
  declarations: [
    AppComponent,
    StatsChartComponent,
    WarningComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
