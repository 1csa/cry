import request from '@/utils/request';
import appConfig from '@/config/app.config';
import { saveLog } from '@/utils/dev_helper';
export async function getPageInit(data: any): Promise<any> {
  return request.post(
    `/api/proxy/${appConfig.diversion_HOST}/OperationtoolService/YDDiversionConfig?op=get`,
  );
}

export async function setModalData(data: any): Promise<any> {
  saveLog(data, 'diversion-config-update');
  return request.post(
    `/api/proxy/${appConfig.diversion_HOST}/OperationtoolService/YDDiversionConfig?op=update`,
    {
      data,
    },
  );
}
