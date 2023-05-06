import { Effect } from 'dva';
import { Reducer, AnyAction } from 'redux';
import { UserModelState } from './user';
import { CardModelState } from './card';
import { StratModelState } from './strat';
import { LaunchModelState } from './launch';
import { OtherModelState } from './other';

export interface YAnyAction extends AnyAction {
  payload: Record<string, any>
  callback?: (...args: any[]) => void;
}

type InfoMessage = {
  type: "info" | "success" | "error",
  message: string;
}

export interface CommonModelState {
  message?: InfoMessage;
}

export interface ConnectState {
  user: UserModelState;
  card: CardModelState;
  strategy: StratModelState;
  launch: LaunchModelState;
  other: OtherModelState;
  common: CommonModelState
}

export interface Model<S> {
  state: S;
  effects: Record<string, Effect>;
  reducers: Record<string, Reducer<S, YAnyAction>>
}

/**
 * connect中dispatch类型定义
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = Record<string, any>, C = (payload: P) => void>(action: {
  type: string;
  payload: P;
  callback?: C;
  [key: string]: any;
}) => any;

export { UserModelState, CardModelState, StratModelState, LaunchModelState, OtherModelState };
