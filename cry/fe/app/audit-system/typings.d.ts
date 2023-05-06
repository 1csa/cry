declare module '*.css';
declare module '*.png';
declare const APP_ENV: string;
declare const PANDORA_TOOL_ID: string | number;
declare let ydFile: {
  set: (K: string, V: string) => void;
  start: (options: object, cb: (result: any) => void) => void;
};
declare let $TagComponent: { render: () => void };
