import { CountryInfo } from './country-summary';

export interface GlobalMetricResponse {
  summary: GlobalMetric[];
  dates: MetricValue;
}

export interface GlobalMetric {
  type: string;
  yesterday: number;
  today: number;
  variation: number;
  scale: GlobalMetricScale;
}

export interface GlobalMetricScale {
  [propName: string]: number;
}

export interface MetricValue {
  yesterday: number;
  today: number;
}

export interface CountryMetric extends CountryInfo {
  confirmed: MetricValue;
  recovered: MetricValue;
  deaths: MetricValue;
}

export interface DateMetric {
  date: string;
  confirmed: number;
  recovered: number;
  deaths: number;
}
