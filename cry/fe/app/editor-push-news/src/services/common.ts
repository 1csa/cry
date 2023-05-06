import request from '@/utils/request';
import appConfig from '@/config/app/app.config';

/**
 * @returns 阿波罗配置项是个字符串需要json.parse
 * @param {string} AppId
 * @param {string} name
 */
export async function apollo(AppId: string, name: string) {
  return await request.get(`/api/proxy/${appConfig.APOLLO_HOST}/configfiles/json/${AppId}/default/${name}`);
};

/**
 * 给后端 测试node的ip用的
 * @param AppId 
 * @param name 
 * @returns 
 */
export async function testApi() {
  return await request.get('/api/push/common/testApi');
};
