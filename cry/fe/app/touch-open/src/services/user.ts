// import requestUmi from '@/utils/requestUmi';
import { get, post } from '@/utils/request';
import { string } from 'vue-types';

type User = {
  userid: string;
  name: string;
  email: string;
  avatar: string;
};

type UserResponse = {
  status: 'success' | 'failed';
  user: User;
};

export async function fetchCurrentUser() {
  return get<UserResponse>('http://pandora.yidian-inc.com/api/user/getuser');
}

export async function fetchUserAuth() {
  return get<string[]>('http://pandora.yidian-inc.com/tools/auth/index?tool=3389842355');
}

export interface GeneralReturnType<T> {
  num: number;
  page: number;
  page_size: number;
  total: number | string;
  list: T[] | [];
}

export interface CommonActionRequestResult<T> {
  code: string;
  msg: string;
  result: T;
  status: string;
}

export interface UserListOptionType {
  id: string;
  mobile: string;
  nickname: string;
  carriage: number;
  user_type: number;
  create_time: string;
}

export type UserListResultProps = GeneralReturnType<UserListOptionType>;

export interface UserListQueryType {
  id?: string;
  mobile?: string;
  nickname?: string;
  carriage?: number;
  skin_colour?: number;
  user_type?: number;
  start_time?: string;
  end_time?: string;
  page?: number;
  page_size?: number;
}

export const fetchUserList = <UserListQueryType, UserListResultProps>(data: UserListQueryType) => {
  return post<UserListResultProps>('/touch_open/backend/user-list', data, {
    requestBaseUrl: 'host2',
  });
};

export const fetchAddMembership = (params: { user_id: string }) => {
  return post<CommonActionRequestResult<boolean>>('/touch_open/backend/add-membership', params, {
    requestBaseUrl: 'host2',
  });
};

export const getUserDetail = (params: { userid: number }) => {
  return post<CommonActionRequestResult<boolean>>('/touch_open/backend/user-info', params, {
    requestBaseUrl: 'host2',
  });
};
