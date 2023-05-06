import produce from 'immer';

import { dropDownProps } from '@/types';
import { get } from '@/utils/dev_helper';
import { fetchCount } from '@/services/commonServices';
import { reviewAreaConst, negFeedbackUserTag, commentUserTag } from '@/data/constants';

/**
 * 下拉菜单数据是从接口获取的，这里处理了将数据赋值给下拉菜单，并且做了需要联动处理的逻辑
 * @param formList 数据驱动formModel的data
 * @param dropDownItem 接口请求或者dva里获取的下拉菜单数据包含很多
 * @param cascaderItem 需要联动的项
 */
export const dropDownInitAndCascader = (formList: any, dropDownItem: any, isNeedCount: boolean, cascaderItem?: Object) => {
  const obj = {
    business_type: '10001',
    material_type: '10002',
    business_unit_type: '10006',
    status: '10007',
  };
  const newState = produce(formList, (draft: any) => {
    draft.forEach((item: any) => {
      // 赋值初始化下拉菜单数据
      if (item.sourceData && !item.sourceData.length) {
        // 过滤掉用户资料审核
        item.sourceData = handleDDlItem(dropDownItem[obj[item.name]], isNeedCount);
        // item.sourceData = dropDownItem[obj[item.name]] && dropDownItem[obj[item.name]].cat.filter((ele: dropDownProps) => {
        //   return ele.id !== 101
        // }).map((ele: dropDownProps) => {
        //   return {
        //     label: isNeedCount ? `${ele.cn} - 0` : ele.cn,
        //     value: ele.id
        //   }
        // })
      }
      // 有联动则处理联动 这里的联动是单级别联动不是多选的那种联动
      if (cascaderItem) {
        // 处理联动
        if (Reflect.has(cascaderItem, item.name)) {
          // 将vm里return的数据重新赋值给formModel
          item.sourceData = cascaderItem[item.name];
        }
      }
    });
  });
  return newState;
};

/**
 *
 * @param material_type 类型
 * @param clsexp 需不需要分类展开统计 -1不传， 大于1都存在
 */
export const fetchCounts = async (material_type: Array<number>, clsexp: number) => {
  const op = clsexp ? {} : { clsexp: 1 };
  try {
    const { errorno, data } = await fetchCount({
      material_type,
      stts_count_audit: 1,
      stt_audited_curauditor_curday: 1,
      ...op,
    });
    if (errorno === 0) {
      const { stts_count_audit, stt_audited_curauditor_curday } = data;
      return {
        stts_count_audit,
        stt_audited_curauditor_curday,
      };
    }
  } catch (error) {
    console.log('error', error);
  }
};

/**
 * 获取数据中的 敏感词word 用来匹配飘红
 * @param sourceData 需要获取源数据
 * @param valuePath 获取数据的路径
 */

export const getWords = (valuePath: { [K: string]: any[] }) => {
  const getData = (value: any[]) => {
    return Array.isArray(value) && value.length ? value.map((item: any) => item.word) : [];
  };
  let newWordList: any[] = [];
  // 避免一个一个取对象，遍历的方式获取，传入的key的数量不定
  for (const key in valuePath) {
    const element = valuePath?.[key];
    newWordList = [...newWordList, ...getData(element)];
  }
  return [...new Set(newWordList)];
};

/**
 * 利用获取的命中敏感词的列表，匹配需要飘红的数据
 * @param words 敏感词命中的列表
 * @param material 需要飘红的原始数据
 */
export const setRedStrByWords = (words: Array<string>, material: any) => {
  const result: Array<string> = [];
  // 设置关键字飘红
  // 用material遍历是为了保证material的顺序
  material.forEach((item: string) => {
    // if (words.includes(item)) {
    //   result.push(item.replaceAll(item, `^${item}&`));
    // } else {
    //   result.push(item);
    // }
    result.push(item);
  });
  return result;
};

/**
 * 接口返回值里有些数据是不包含在固定json里，需要前端自己加进去处理
 * @param item 有很多值的json串
 * @param page_id
 * @param item_num
 * @param extend 是否需要扩展字段 否则用默认的
 */
export const setRespondDataIntoObj = (item: any, page_id?: number | null, item_num?: number, extend: boolean = false) => {
  const extendsObj = {
    docid: get(item, 'docid', null),
    part_zone: get(item, 'part_zone', null),
    business_id: get(item, 'business_id', null),
    business_unit_id: get(item, 'business_unit_id', null),
  };
  const normalObj = {
    machine_status: item.machine_status,
    machine_result: typeof item.machine_result === 'string' ? JSON.parse(item.machine_result) : item.machine_result,
    tmrecord: item.tmrecord,
    tmmanul: item.tmmanul,
    time_receive: item.time_receive,
    data_id: item.data_id,
    page_id: page_id,
    item_num: item_num,
    status_l1: item.status_l1,
    status_l2: item.status_l2,
    status_l3: item.status_l3,
    result_l1: item.result_l1,
    result_l2: item.result_l2,
    result_l3: item.result_l3,
    audit_level: item.audit_level,
    material_type: item.material_type,
    userResult: item.result_l3
      ? JSON.parse(item.result_l3)
      : item.result_l2
      ? JSON.parse(item.result_l2)
      : item.result_l1
      ? JSON.parse(item.result_l1)
      : {
          result_tags_brief: [],
          result_tags_header_img: [],
          result_tags_nick: [],
        },
  };
  if (!extend) {
    return normalObj;
  } else {
    return { ...normalObj, ...extendsObj };
  }
};

/**
 * 下拉选择，初始化的时候根据 material_type 默认值取值来获取下拉菜单数据
 * 初始化设置下菜单的内容类型和审核分区的联动 默认每个页面传固定的内容类型 然后根据其处理分区下拉数据
 * @param key 默认值的取值key
 * @param initialValues 默认值
 * @param item 下拉数据的
 */
export const setInitSelectByMT = (initialValues: any) => {
  const key = Array.isArray(initialValues['material_type']) ? initialValues['material_type'][0] : initialValues['material_type'];
  if (initialValues && initialValues['material_type']) {
    return {
      value: reviewAreaConst[key],
    };
  } else {
    return {};
  }
};

/**
 * 设置下拉菜单的数据
 * @param ddlItem 下拉选项的某一项
 * @param needCount 需不需要拼接count
 */
export const handleDDlItem = (ddlItem: any, needCount: boolean = false) => {
  return (
    ddlItem &&
    ddlItem.cat.map((ele: dropDownProps) => {
      return {
        label: needCount ? `${ele.cn} - 0` : ele.cn,
        value: ele.id,
      };
    })
  );
};

/**
 * 封装 以当前的内容类型 material_type 102 103等 去匹配审核分区的下拉列表
 */
export const handlePartZonesDDL = (ddlData: any, value: number, needCount: boolean = false) => {
  const part_zones = {
    part_zones: handleDDlItem(ddlData[value], needCount),
  };
  return part_zones;
};

/**
 * 获取用户审核的标签类型 也就是点击按钮的文案
 * @param id 业务id 101 102 103 104等
 */
export const getUserReviewTag = (id: number) => {
  return id === 104 ? commentUserTag : id !== 101 ? negFeedbackUserTag : {};
};

// 格式化参数 客户端参数 -> 服务端参数
/**
 * 提交结果 因为用户资料审核的一些字段不一样的 在另一个文件中设置
 * @param item 接口有返回的数据中的字段再传给接口
 * @param manual_status 人审核状态
 * @param desc 描述信息
 * @param labels 曝光审核传递话术标签
 */
export const submitTaskParamsInAuditOperation = (item: any, manual_status: number | string, desc: string, labels?: any[]) => {
  return {
    business_id: item.business_id,
    business_unit_id: item.business_unit_id,
    data_id: item.data_id,
    audit_level: item.audit_level === -1 ? 1 : item.audit_level,
    manual_status,
    manual_result: labels
      ? JSON.stringify({
          status: manual_status,
          desc,
          labels,
        })
      : JSON.stringify({
          status: manual_status,
          desc,
        }),
    part_zone: item.part_zone,
    docid: item.docid,
  };
};
