// import { RouterTypes } from 'umi';
// import { Effect } from "dva";
// import { AnyAction } from "redux";
import { UserModelState } from './user';
import { DimensionModelState } from './dimension'
import { PushtypeModelState } from './pushtype'
import { AccountModelState } from './account'
import { PushModelState } from "./editorpush";
import { AuthModelState } from './auth';

export { UserModelState, DimensionModelState, PushtypeModelState, AccountModelState, AuthModelState};

export interface ConnectState {
  user: UserModelState;
  dimension: DimensionModelState // 取 dimension 下面的 state
  pushtypeEnum: PushtypeModelState
  accountEnum: AccountModelState,
  editorpush: PushModelState,
  auth: AuthModelState
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

export interface AnyAction {
  type: string;
  payload: Record<string, any>;
  callback?: (...args: any[])=> void;
}

export interface EffectsCommandMap {
  put: (action: AnyAction) => any,
  call: Function,
  select: Function,
  take: Function,
  cancel: Function,
  [key: string]: any,
}

export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void;

export type Reducer<ST = any, AT = AnyAction> = (state: ST, action: AT) => ST;

// export interface Route {
//   routes?: Route[];
// }

// /**
//  * @type T: Params matched in dynamic routing
//  */
// export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
//   dispatch?: Dispatch;
// }
