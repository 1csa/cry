import request from '@/utils/request';
import appConfig from '@/config/app/app.config';
import { MonitorScreen } from '@/config/competitor/competitor';

// 获取监控列表
export async function getCompetitorMonitorList(values: MonitorScreen): Promise<any> {
  let { start_date, end_date, app_name, hotspot = '', device_id = '', kws = '', order, pub_status = '' } = values;

  if (Array.isArray(app_name)) {
    app_name = app_name.join(',');
  } else if (!app_name) {
    app_name = '';
  }
  // console.log(values);

  return request.get(
    `/api/proxy/${appConfig.PUSH_MANNAGER}/content/list?start_date=${encodeURIComponent(start_date!)}&end_date=${encodeURIComponent(
      end_date!,
    )}&app_name=${encodeURIComponent(app_name)}&hotspot=${encodeURIComponent(hotspot)}&device_id=${encodeURIComponent(
      device_id,
    )}&kws=${encodeURIComponent(kws)}&order=${order}&pub_status=${pub_status}`,
  );
}

// 保存热点分级
export async function saveHotSpot(id: number, mid: string, hotspot: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/case/set-crawl-hotspot?id=${id}&mid=${mid}&hotspot=${hotspot}`);
}

// 获取动态爬取
export async function getMonitorNewer(last_id: number = 0): Promise<any> {
  return await request.get(`/api/proxy/${appConfig.PUSH_MANNAGER}/content/list?last_id=${last_id}&order=desc`);
}

// 获取动态更新的list列表
export async function getMonitorDiff(unop_ids: number[] = []): Promise<any> {
  // return await request.get(`/api/proxy/${appConfig.PUSH_MANNAGER}/content/check?ids=${unop_ids.join(',')}`);
  return await request.post(`/api/proxy/${appConfig.PUSH_MANNAGER}/content/check`, {
    data: unop_ids,
  });
}
