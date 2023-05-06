export interface MainMenu {
  /**
   * @param name: Menu name, eg. 首页, 列表页...
   * @param key: Menu path, eg. /home, /list, /list/item
   */
  name: string;
  key: string;
  icon?: string;
  subMenu?: MainMenu[];
}

export type MainMenus = MainMenu[];

export interface LayoutProps {
  /**
   * @param hasSidebar: Sidebar menu layout, or top menu layout
   * @param theme: App theme, dark or light, dark is default
   * @param menus: App main menu
   */
  hasSidebar?: boolean;
  theme?: 'dark' | 'light';
  menus?: MainMenu[];
  children?: React.ReactNode
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
  appId: string;
  appName?: string;
  logo?: boolean | string;
  toolId?: number;
  menus: MainMenu[];
  helpDoc?: string;
  layout: LayoutProps;
}

//通用key-val接口，作为所有key-value类型的通用定义
export interface KeyValProp {
  /**
   * @param key:
   * @param val:
   */
  key: string;
  val: string | number | boolean;
}

export interface RequestReturn<T = undefined> {
  status: 'success' | 'failed';
  code?: number;
  data: T
}

export type BasicDataType = {
  timeKey: string
}
export interface PolygonalDataType<U> {
  [name: string]: U[];
}

export interface PieDataType {
  name: string;
  value: number
}

export interface TableDataType<T> {
  list: T[],
  pageNum: number;
  pageSize: number;
  size: number;
  total: number;
}
