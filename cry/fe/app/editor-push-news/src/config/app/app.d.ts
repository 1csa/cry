import { RequestResponse } from 'umi-request';

export interface MainMenu {
  /**
   * @param name: Menu name, eg. 首页, 列表页...
   * @param key: Menu path, eg. /home, /list, /list/item
   */
  name: string
  key: string
  icon?: string
  subMenu?: MainMenu[]
  authKey?: string | number
}

export type MainMenus = MainMenu[];

export interface LayoutProps {
  /**
   * @param hasSidebar: Sidebar menu layout, or top menu layout
   * @param theme: App theme, dark or light, dark is default
   * @param menus: App main menu
   */
  hasSidebar?: boolean
  theme?: 'dark' | 'light'
  menus?: MainMenu[]
}

export interface AppConfig {
  /**
   * @param appId: Is also artifactId, eg. app:simple-demo, the simeple-demo is appId
   * @param appName: App name for users, default is appId, eg. Hotpool, 频道运营工具
   * @param logo: App logo along with appName
   * @param toolId: Pandora toolId
   * @param menus: App menus config
   * @param helpDoc: Help document url
   * @param layout: Layout config
   */
  appId: string
  appName?: string
  logo?: boolean | string
  toolId?: number
  menus: MainMenu[]
  helpDoc?: string
  layout: LayoutProps
  API_HOST: string
  PUSH_TYPE_HOST: string
  PUSH_CHANNEL_SEARCH_HOST: string
  APOLLO_HOST: string
  NEW_PUSH_API_HOST: string
  OLD_PUSH_API_HOST: string
  PAUSE_HOST: string
  PUSH_MANNAGER: string
  PUSH_CHARTS_DATA_HOST: string
  PUSH_USER_TAG_HOST: string
}


/**
 * 统一的数据返回格式
 * @param code: 返回的状态码
 * @param data: 返回的数据
 * @param message: 返回的错误信息
*/
export type ResponseType<T=any> = {
  status?: "success" | "failed"
  code?: number;
  data?: T;
  message?: string;
}

export type RequestRes<T = any> = RequestResponse<ResponseType<T>>;

export const DEBUG_MODE_DEV = "development"; // 和const DEBUG_MODE_DEV: "dev"写法一致
export const DEBUG_MODE_PROD = 'production';

export type DebugMode = typeof DEBUG_MODE_DEV | typeof DEBUG_MODE_PROD;

