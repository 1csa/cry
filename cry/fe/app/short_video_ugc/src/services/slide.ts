import request from '@/utils/request';

export async function querySlides(): Promise<any> {
  return [{id: '123', url: '213'}]
  // return request('/api/proxy/http://pandora.yidian-inc.com/api/user/getuser');
}

export async function saveSlides(data: Array<SLIDE>): Promise<any> {}
