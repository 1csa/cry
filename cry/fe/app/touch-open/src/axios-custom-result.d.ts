import * as axios from 'axios';

declare module 'axios' {
  export interface ApiDataType<T> {
    code: string | number;
    msg?: string;
    data?: T;
    result: T;
    reason?: string;
    [keys: string]: any;
  }
}
