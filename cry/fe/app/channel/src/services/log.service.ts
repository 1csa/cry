import request from '@/utils/request';

export async function getKibanaData(params: any): Promise<any> {
  return request.post(
    `/api/proxy/http://clay.yidianzixun.com:5602/elasticsearch/_msearch?rest_total_hits_as_int=true&ignore_throttled=true`,
    { data: { params } },
  );
}
