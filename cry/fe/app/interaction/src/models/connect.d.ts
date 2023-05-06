// import { RouterTypes } from 'umi';
import { UserModelState } from './user';
import { AuthModelState } from './auth';

export { UserModelState, AuthModelState };

export interface ConnectState {
  user: UserModelState;
  auth: AuthModelState;
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

// export interface Route {
//   routes?: Route[];
// }

// /**
//  * @type T: Params matched in dynamic routing
//  */
// export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
//   dispatch?: Dispatch;
// }
