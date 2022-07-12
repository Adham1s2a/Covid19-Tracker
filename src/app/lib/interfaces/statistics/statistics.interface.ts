export interface Parameters {
  country: string;
}

export interface Cases {
  new?: any;
  active: number;
  critical: number;
  recovered: number;
  oneMpop?: any;
  total: number;
}

export interface Deaths {
  new?: any;
  oneMpop?: any;
  total: number;
}

export interface Tests {
  oneMpop?: any;
  total: number;
}

export interface StatisticsResponse {
  continent: string;
  country: string;
  population?: any;
  cases: Cases;
  deaths: Deaths;
  tests: Tests;
  day: string;
  time: Date;
}

export interface StatisticsRootObject {
  get: string;
  parameters: Parameters;
  errors: any[];
  results: number;
  response: StatisticsResponse[];
}
