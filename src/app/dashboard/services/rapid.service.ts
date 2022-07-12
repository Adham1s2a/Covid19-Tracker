import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CountryRootObject,
  StatisticsRootObject,
} from 'src/app/lib/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RapidService {
  constructor(private http: HttpClient) {}

getStatistics(): Observable<StatisticsRootObject> {
    return this.http.get<StatisticsRootObject>(
      'https://covid-193.p.rapidapi.com/statistics',
      {
        headers: {
          'x-rapidapi-host': environment.XRapidAPIHost,
          'x-rapidapi-key': environment.XRapidAPIKey,
        },
      }
    );
  }

  getCountryStatistics(country: string): Observable<StatisticsRootObject> {
    return this.http.get<StatisticsRootObject>(
      'https://covid-193.p.rapidapi.com/statistics',
      {
        params: {
          country: country,
        },
        headers: {
          'x-rapidapi-host': environment.XRapidAPIHost,
          'x-rapidapi-key': environment.XRapidAPIKey,
        },
      }
    );
  }

  getCountries(): Observable<CountryRootObject> {
    return this.http.get<CountryRootObject>(
      'https://covid-193.p.rapidapi.com/countries',
      {
        headers: {
          'x-rapidapi-host': environment.XRapidAPIHost,
          'x-rapidapi-key': environment.XRapidAPIKey,
        },
      }
    );
  }

  getCountryHistory(country: string): Observable<StatisticsRootObject>{
   return this.http.get<StatisticsRootObject>(
     'https://covid-193.p.rapidapi.com/history',
     {
       params: {
         country: country,
       },
       headers: {
         'x-rapidapi-host': environment.XRapidAPIHost,
         'x-rapidapi-key': environment.XRapidAPIKey,
       },
     }
   );
  }
}
