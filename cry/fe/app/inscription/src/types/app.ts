import { IconType } from '@/types/comp';
import { CardType } from '@/types/card';

/**
* @param name: Menu name, eg. 首页, 列表页...
* @param key: Menu path, eg. /home, /list, /list/item
* @param authed 是否为需要鉴权的menu
*/
export interface MainMenu {
  name: string;
  key: string;
  icon?: IconType;
  subMenu?: MainMenu[];
  authed?: boolean;
}

export type MainMenus = MainMenu[];

/**
 * @param hasSidebar: Sidebar menu layout, or top menu layout
 * @param theme: App theme, dark or light, dark is default
 * @param menus: App main menu
 */
export interface LayoutProps {
  hasSidebar?: boolean;
  theme?: 'dark' | 'light';
  menus?: MainMenu[];
}

/**
 * @param appId: Is also artifactId, eg. app:simple-demo, the simeple-demo is appId
 * @param appName: App name for users, default is appId, eg. Hotpool, 频道运营工具
 * @param logo: App logo along with appName
 * @param toolId: Pandora toolId
 * @param menus: App menus config
 * @param helpDoc: Help document url
 * @param layout: Layout config
 */
export interface AppConfig {
  appId: string;
  appName: string;
  logo: string;
  toolId?: number;
  menus: MainMenu[];
  helpDoc?: string;
  layout: LayoutProps;
}

export interface CardMenu {
  name: string;
  key: CardType;
  icon?: string;
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

/**
 * @param {string} url: 返回图片url
 * @param {string} image_id: 返回具体图片id
 */
export type UploadType = {
  url: string;
  image_id: string;
}

export type RequestRes<T = any> =ResponseType<T>;

export const DEBUG_MODE_DEV = "development"; // 和const DEBUG_MODE_DEV: "dev"写法一致
export const DEBUG_MODE_PROD = 'production';

export type DebugMode = typeof DEBUG_MODE_DEV | typeof DEBUG_MODE_PROD;

export type FormRouteParam = {
  id: string;
}
