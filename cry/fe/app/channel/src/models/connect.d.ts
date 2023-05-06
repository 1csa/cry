// import { RouterTypes } from 'umi';
import { UserModelState } from './user';
import { AuthModelState } from './auth.model'
import { SiderModelState } from './sider.model'
import { TopNewsModelState } from './topNews.model'

export { UserModelState, AuthModelState, SiderModelState, TopNewsModelState };

export interface ConnectState {
  user: UserModelState
  auth: AuthModelState
  sider: SiderModelState
  topNews: TopNewsModelState
}

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Callback = (err?: string) => void

// export interface Route {
//   routes?: Route[];
// }

// /**
//  * @type T: Params matched in dynamic routing
//  */
// export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
//   dispatch?: Dispatch;
// }
