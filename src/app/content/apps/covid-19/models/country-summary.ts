export interface CountrySummary {
  country: CountryInfo;
  stats: Stats;
}

export interface CountryInfo {
  name: string;
  code: string;
  lat?: number;
  long?: number;
}

export interface Stats {
  current: CountryCasesStat;
  today: CountryCasesStat;
}

export interface CountryCasesStat {
  confirmed: number;
  deaths: number;
  recovered: number;
}
