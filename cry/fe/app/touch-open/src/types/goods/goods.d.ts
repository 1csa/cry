import { Dayjs } from 'dayjs';
export interface FormStateType {
  sku: string;
  name: string;
  category: string[];
  season: string[];
  date: Dayjs[];
  size_code: string;
}
