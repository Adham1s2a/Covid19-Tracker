import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import {
  StatisticsResponse,
  StatisticsRootObject,
} from 'src/app/lib/interfaces';
import { SubSink } from 'src/app/lib/subsink';
import { RapidService } from '../../services/rapid.service';

export interface MostEffectedState {
  loading: boolean;
  error: boolean;
}

@Component({
  selector: 'app-most-effected',
  templateUrl: './most-effected.component.html'
})
export class MostEffectedComponent implements OnInit {
  state$ = new BehaviorSubject<MostEffectedState>({
    loading: true,
    error: false,
  });
  subs = new SubSink();
  loadingIcon = faSpinner;
  constructor(private rapidService: RapidService) {}

  topTenEffected: any[] = [];

  // options
  view: [number, number] = [window.innerWidth / 1.5, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Total Cases';

  ngOnInit(): void {
    this.state$.next({
      loading: true,
      error: false,
    });
    this.getMostEffectedCountries();
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.5, 400];
  }

  getMostEffectedCountries() {
    this.subs.sink = this.rapidService.getStatistics().subscribe({
      next: (data: StatisticsRootObject) => {
        //exclude continents
        let onlyCountries = data.response.filter(
          (country: StatisticsResponse) => country.continent !== country.country
        );
        let sorted = onlyCountries
          .sort((a, b) => {
            return b.cases.total - a.cases.total;
          })
          .slice(1, 10);
        let countries = sorted.map((country) => {
          return {
            name: country.country,
            value: country.cases.total,
          };
        });
        this.topTenEffected = countries;
        this.state$.next({
          loading: false,
          error: false,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
