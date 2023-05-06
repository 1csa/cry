import moment from 'moment';
import { getAreaList, getBusinessList, category } from '@/services/featureContent';
import { actionType } from './constants';
import { DATE_FORMAT_SS } from '@/utils/dev_helper';

export const formatDate = (time: Date) => {
  return moment(moment(time).format(DATE_FORMAT_SS), DATE_FORMAT_SS);
};

/**
 * 初始化数据 设置表单的initialValues
 * @param params list行数据
 */
export const initDefaultValue = (params: any) => {
  // console.log('params', params);
  let actionTypeObj = {};
  actionType.forEach(item => {
    Object.assign(actionTypeObj, { [item.value]: item.label });
  });
  // 初始化一些数据
  let obj = {
    time_range: 1,
    enablePinyin: params?.enablePinyin || 0,
    mixDistance: params?.mixDistance || '0:0',
    mixMaxLength: params?.mixMaxLength || 0,
    rangeDate: [formatDate(new Date()), moment(moment().add(1, 'M'), DATE_FORMAT_SS)],
    actions: params?.action || params?.actions || [],
    categoryId: typeof params?.categoryId == 'string' ? params?.categoryId?.split(',') : [],
  };

  // 新建和编辑的 2999/12/31 23:59:59的时候 返回1 是永久
  obj.time_range = !params?.endTime || +params?.endTime === 32503651199000 ? 1 : 2;
  if (obj.time_range === 2) {
    obj.rangeDate = [
      formatDate(new Date(params?.startTime)),
      formatDate(new Date(params?.endTime)),
    ];
  }

  // 回显生效信息表格数据 主要是映射表格内容的Label文字显示
  obj?.actions?.forEach((ele: any) => {
    ele.label = actionTypeObj[ele.actionType];
    // console.log('ele.label', ele.label);

    // actionType.forEach(item => {
    //   if (ele.actionType === item.value) {
    //     ele.label = actionTypeObj[ele.actionType];
    //   }
    // });
  });

  // 切割组合词间距将0:4,0:2切割，判断有几个
  var mixDistanceArr = obj.mixDistance?.split(',');
  var len = mixDistanceArr.length;
  // 用来存储对应几个Input的数据显示
  var newMixDistanceObj = {};
  // 用来存储input数量，格式为[1,2,3,.xxx] 必须是增序，用于字段的_x拼接
  var mixDistanceInputCountList = [];

  for (var i = 0; i <= len - 1; i++) {
    mixDistanceInputCountList.push(i + 1);
    Object.assign(newMixDistanceObj, {
      [`mixDistance_${i + 1}`]: +mixDistanceArr[i].split(':')[1],
    });
  }

  return {
    word: params?.word,
    exemptWord: params?.exemptWord,
    remark: params?.remark,
    wordId: params?.wordId,
    ...obj,
    ...newMixDistanceObj,
    ...{ mixDistanceInputCountList },
  };
};

/**
 * 请求生效区域
 */
export const getArea = async () => {
  try {
    const { code, data } = await getAreaList();
    if (code === 200) {
      return key2Label(data, 'sub');
    } else {
      return [];
    }
  } catch (error) {
    console.log('err', error);
  }
};

/**
 * 请求生效业务方
 */
export const getBusiness = async () => {
  try {
    const { code, data } = await getBusinessList();
    if (code === 200) {
      return key2Label(data, 'business');
    } else {
      return [];
    }
  } catch (error) {
    console.log('err', error);
  }
};

/**
 * 转化请求结果
 * @param list 需要转化的数据
 * @param key 转化的key
 */
const key2Label = (list: any, key: string) => {
  return list.map((ele: any) => {
    return {
      label: ele[`${key}Name`],
      value: ele[`${key}Id`],
    };
  });
};
