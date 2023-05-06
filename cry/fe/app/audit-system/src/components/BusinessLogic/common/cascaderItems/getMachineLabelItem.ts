import { fetchMachineLabel } from '@/services/commonServices';
import { message } from 'antd';

/**
 * 获取机审标签模型
 * 接口地址【http://ydoc.int.yidian-inc.com/doc.html#/blizzard-manual-audit/%E6%9C%BA%E5%99%A8%E6%A0%87%E7%AD%BE%E6%8E%A5%E5%8F%A3/queryUsingGET_1】
 * @param businessId
 * @param businessUnitId
 */
type payloadKeyProps = 'businessId' | 'businessUnitId';

export async function saveMachineLabel(payload: Record<payloadKeyProps, number>): Promise<any> {
  try {
    const paramsIsComplete = Object.values(payload)
      ?.flat(1)
      ?.every(e => e);
    if (paramsIsComplete) {
      const { errorno, data, desc } = await fetchMachineLabel({
        businessId: payload.businessId,
        businessUnitId: payload.businessUnitId,
      });
      if (errorno === 0) {
        return data;
      } else {
        message.error(`获取机审标签模型接口失败，原因：${desc}`);
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}
