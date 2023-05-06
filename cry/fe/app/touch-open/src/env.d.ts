/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'alife-logger';

interface ImportMetaEnv {
  /** 网站标题 */
  readonly VITE_APP_TITLE: string;
  /** 当前网站环境 */
  readonly VITE_APP_ENV: string;
  /** 网站部署的目录 */
  readonly VITE_BASE_URL: string;
  /** API 接口路径 */
  readonly VITE_APP_API_URL: string;
  /** 是否删除console */
  readonly VITE_DROP_CONSOLE: boolean;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SCPPrintOptions {
  partnerID: string;
  env?: string;
  notips?: boolean;
  callback?: (result: { code: number; msg: number; downloadUrl: string }) => void;
}

interface SCPPrintDocuments {
  masterWaybillNo: string;
  branchWaybillNo?: string;
  backWaybillNo?: string;
  seq?: string;
  sum?: string;
  isPrintLogo?: string;
  remark?: string;
  waybillNoCheckType?: string;
  waybillNoCheckValue?: string;
  customData?: object;
  optionalJson?: object;
}

interface SCPPrintData {
  requestID: string | number;
  accessToken: string;
  templateCode: string;
  documents: SCPPrintDocuments[];
  customTemplateCode?: string;
}

interface SCPPrint {
  new (options: SCPPrintOptions): SCPPrint;
  print: (data: SCPPrintData) => void;
  setPrinter: (printer: string) => void;
}
