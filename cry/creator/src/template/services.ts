const servicesFileContent = (apiName: string, reqFnName: string) => `
import request from '@/utils/request';
import appConfig from '@/config/app.config';

export async function fetch${reqFnName}(): Promise<any> {
  return request('/api/${apiName}');
}
`;

export default servicesFileContent;
