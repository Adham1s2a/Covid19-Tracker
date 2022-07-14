import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, map } from 'rxjs';
import {
  Cases,
  Deaths,
  StatisticsResponse,
  StatisticsRootObject,
} from 'src/app/lib/interfaces';
import { SubSink } from 'src/app/lib/subsink';
import { RapidService } from '../../services/rapid.service';

@Component({
  selector: 'app-country-history',
  templateUrl: './country-history.component.html',
})
export class CountryHistoryComponent implements OnChanges {
  @Input() selectedCountry: string = '';
  CountryStatistics$ = new BehaviorSubject<StatisticsResponse | undefined>(
    undefined
  );
  subs = new SubSink();
  cases$ = new BehaviorSubject<Cases | undefined>(undefined);
  deaths$ = new BehaviorSubject<Deaths | undefined>(undefined);
  historyCasesPerMonth?: any[];
  newCasesPerMonth?: any[];
  constructor(private rapidService: RapidService) {}

  // options
  view: [number, number] = [window.innerWidth / 1.5, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = this.selectedCountry;
  showYAxisLabel = true;
  yAxisLabel = 'New Cases';
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['black', 'blue', 'red', 'green', 'orange', 'purple'],
  };

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.5, 400];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['selectedCountry'].currentValue);
    this.subs.sink = this.rapidService
      .getCountryHistory(changes['selectedCountry'].currentValue)
      .pipe(map((data: StatisticsRootObject) => data))
      .subscribe({
        next: (data: StatisticsRootObject) => {
          this.historyCasesPerMonth = data.response.reduce(
            (acc: any[], curr: any) => {
              const month = curr.day.split('-')[1];
              const year = curr.day.split('-')[0];
              const monthYear = `${month}-${year}`;
              const index = acc.findIndex(
                (item: any) => item.monthYear === monthYear
              );
              if (index === -1) {
                acc.push({
                  monthYear,
                  totalCases: data.response
                    .filter(
                      (item: StatisticsResponse) =>
                        item.day.split('-')[1] === month
                    )
                    .reduce(
                      (acc: number, curr: StatisticsResponse) =>
                        Number(acc) + curr.cases.new
                          ? Number(curr.cases.new)
                          : 0,
                      0
                    ),
                });
              } else {
                if (curr.cases.new) {
                  acc[index].totalCases += Number(curr.cases.new) || 0;
                }
              }
              return acc;
            },
            []
          );

          if (this.historyCasesPerMonth) {
            this.newCasesPerMonth = Object.entries(
              this.historyCasesPerMonth
            ).map(([key, value]) => ({
              name: value.monthYear,
              value: Number(value.totalCases),
            }));
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
