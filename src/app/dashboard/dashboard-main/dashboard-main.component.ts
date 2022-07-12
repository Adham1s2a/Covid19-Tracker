import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  distinctUntilChanged,
  tap,
} from 'rxjs';
import { SubSink } from 'src/app/lib/subsink';
import { RapidService } from '../services/rapid.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  CountryRootObject,
} from 'src/app/lib/interfaces';

export interface dashboardState {
  loading: boolean;
  error: boolean;
}
export interface Country {
  name: string;
}

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent implements OnInit {
  constructor(private rapidService: RapidService, private fb: FormBuilder) {}

  state$ = new BehaviorSubject<dashboardState>({
    loading: true,
    error: false,
  });
  subs = new SubSink();
  loadingIcon = faSpinner;

  countries$ = new BehaviorSubject<string[]>([]);
  countryFormGroup = this.fb.group({
    searchField: ['UAE'],
  });
  searchField = new FormControl();
  filteredCountries$ = new BehaviorSubject<string[]>([]);
  selectedCountry: string = 'UAE';

  ngOnInit(): void {
    this.subs.sink = this.rapidService.getCountries().subscribe({
      next: (data: CountryRootObject) => {
        this.countries$.next(data.response);
        this.filteredCountries$.next(data.response);
        this.state$.next({
          loading: false,
          error: false,
        });
      },
      error: () => {
        this.state$.next({
          loading: false,
          error: true,
        });
      },
    });

    this.searchField.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        // filter((term) => term.length > 3),
        tap((term: string) => this.state$.next({ loading: true, error: false }))
      )
      .subscribe({
        next: (term) => {
          this.countries$
            .pipe(
              map((countries) => {
                return countries.filter((country: string) => {
                  return country.toLowerCase().startsWith(term.toLowerCase());
                });
              })
            )
            .subscribe(this.filteredCountries$);
        },
        error: () => {
          this.state$.next({
            loading: false,
            error: true,
          });
        },
      });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
