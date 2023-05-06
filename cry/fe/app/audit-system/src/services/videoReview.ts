import request from '@/utils/request';
import appConfig from '@/config/app.config';

export async function screenShot(data: any): Promise<any> {
  return request.post(`/api/proxy/${appConfig.SCREENSHOT_URL}`, { data });
}

// 重新获取视频可播放地址
// 将视频url解析为一个有过期时间的临时播放地址，可以拿到不同分辨率的url。内容不会改变
export async function urlConvert(params: any): Promise<any> {
  return request(`/api/proxy/${appConfig.MANUAL_AUDIT_URL}/video/url/convert`, { params });
}
