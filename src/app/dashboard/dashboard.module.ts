import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { HttpClientModule } from '@angular/common/http';
import { RapidService } from './services/rapid.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryStatisticsComponent } from './partials/country-statistics/country-statistics.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryHistoryComponent } from './partials/country-history/country-history.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MostEffectedComponent } from './partials/most-effected/most-effected.component';


@NgModule({
  declarations: [DashboardMainComponent,CountryStatisticsComponent, CountryHistoryComponent, MostEffectedComponent ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    NgSelectModule,
  ],
  providers: [RapidService],
})
export class DashboardModule {}
