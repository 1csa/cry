import request from '@/utils/request';
import { isProdEnv } from '@/utils/dev_helper';

/**
 * 获取apollo预发白名单 区分环境
 */
export async function getApolloSetting(): Promise<any> {
  return request(
    `/api/proxy/http://apollo-configcenter.ha.in.yidian.com:${
      isProdEnv() ? 8108 : 8208
    }/configfiles/json/blizzard/default/application`,
  );
}
