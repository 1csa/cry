import request from '@/utils/request';

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

export async function fetchCurrentUser(): Promise<UserResponse> {
  return request('http://pandora.yidian-inc.com/api/user/getuser');
}
