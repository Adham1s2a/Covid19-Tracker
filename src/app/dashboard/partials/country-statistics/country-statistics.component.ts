import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
  selector: 'app-country-statistics',
  templateUrl: './country-statistics.component.html'
})
export class CountryStatisticsComponent implements OnChanges {
  @Input() selectedCountry: string = '';
  CountryStatistics$ = new BehaviorSubject<StatisticsResponse | undefined>(
    undefined
  );
  subs = new SubSink();
  cases$ = new BehaviorSubject<Cases | undefined>(undefined);
  deaths$ = new BehaviorSubject<Deaths | undefined>(undefined);
  casesByCountry?:any[] ;
  constructor(private rapidService: RapidService) {}

    // options
  view: [number, number] = [window.innerWidth / 1.5, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['black', 'blue', 'red', 'green', 'orange', 'purple'],
  };
  onResize(event:any) {
    this.view = [event.target.innerWidth / 1.5, 400];
}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['selectedCountry'].currentValue);
    this.subs.sink = this.rapidService
      .getCountryStatistics(changes['selectedCountry'].currentValue)
      .pipe(map((data: StatisticsRootObject) => data.response[0]))
      .subscribe({
        next: (data: StatisticsResponse) => {
          this.CountryStatistics$.next(data);
          this.cases$.next(data.cases);
          this.deaths$.next(data.deaths);

          if (this.cases$.value) {
            this.casesByCountry = Object.entries(this.cases$.value).map(
              ([key, value]) => ({ name: key, value: Number(value) })
            );
          }
          console.log("Please",this.casesByCountry);
        },
        error: (err) => {
          console.log(err);
        } 
      });
  }
}
