import { fetchAuditResultMenuTags } from '@/services/commonServices';
import { message } from 'antd';

/**
 * TODO: wxj 获取人审结果/标签
 * 获取 审核结果 和 用户审核标签
 * 接口地址【http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=55717705】
 * @param business_type、business_unit_type
 * @param 后期可能需要改成 businessId和businessUnitId
 */
export async function saveAuditRetUserReviewTags(payload: {
  business_type: number[];
  business_unit_type: number[];
}): Promise<any> {
  try {
    const paramsIsComplete = Object.values(payload)
      ?.flat(1)
      ?.every(e => e);
    if (paramsIsComplete) {
      const { errorno, data, desc } = await fetchAuditResultMenuTags({
        business_type: payload.business_type,
        business_unit_type: payload.business_unit_type,
      });
      if (errorno === 0) {
        return data;
      } else {
        message.error(`请求审核标签接口失败，原因：${desc}`);
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}
