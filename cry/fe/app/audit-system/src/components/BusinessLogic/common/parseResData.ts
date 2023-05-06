import { isJSON } from '@/utils/dev_helper';

/**
 * 接口返回值处理parse json
 * @param item 返回值的item
 * @param page_id
 * @param item_num
 */
export const parseRespondData = (item: any) => {
  item.machine_result = isJSON(item.machine_result) ? JSON.parse(item.machine_result) : item.machine_result;
  item.material = isJSON(item.material) ? JSON.parse(item.material) : item.material;
  item.result_l1 = item?.result_l1 && item.result_l1 ? (isJSON(item.result_l1) ? JSON.parse(item.result_l1) : item.result_l1) : null;
  item.result_l2 = item?.result_l2 && item.result_l2 ? (isJSON(item.result_l2) ? JSON.parse(item.result_l2) : item.result_l2) : null;
  item.result_l3 = item?.result_l3 && item?.result_l3 ? (isJSON(item.result_l3) ? JSON.parse(item.result_l3) : item.result_l3) : null;
  return item;
};
