import { get, isJSON } from '@/utils/dev_helper';
import { getWords, setRedStrByWords, setRespondDataIntoObj } from './index';

export const MACHINE_STATUS: number = 3102;
export const MACHINE_NOT_PASS_STR: string = '机审不通过';

const getStatus = () => {
  return [
    {
      type: MACHINE_NOT_PASS_STR,
      status: MACHINE_STATUS,
    },
  ];
};

/**
 * 设置修改了哪些信息
 */
const setModifyInfo = (updateStatus: any) => {
  let us = [];
  for (const key in updateStatus) {
    const element = updateStatus[key];
    if (element) {
      us.push(key);
    }
  }
  return us;
};

/**
 * 处理用户资料审核返回的数据
 */
export const setUserprofilePanelResData = (item: any, page_id?: number, item_num?: number) => {
  const material = isJSON(item.material) ? JSON.parse(item.material) : item.material;

  // 将一些数据添加到对象中
  Object.assign(material, setRespondDataIntoObj(item, page_id, item_num, false));

  // 获取各自机审结果
  const nickResult = get(material, 'machine_result.sensitive.nick.result', null);
  const briefResult = get(material, 'machine_result.sensitive.brief.result', null);
  const imgResult = get(material, 'machine_result.sensitive.headImage.result', null);

  // 处理三个模块有机审不通过的情况
  // 有人审的结果肯定是有机审的结果，所以直接先判断如果userResult有数据，就用userResult里的对应的数据，userResult没有数据
  // 则代表是在用户资料审核页面领取任务，因为审核源还没打标签
  material.result_tags_nick = material.userResult.result_tags_nick.length
    ? material.userResult.result_tags_nick
    : nickResult
    ? nickResult === MACHINE_STATUS
      ? getStatus()
      : []
    : [];
  material.result_tags_brief = material.userResult.result_tags_brief.length
    ? material.userResult.result_tags_brief
    : briefResult
    ? briefResult === MACHINE_STATUS
      ? getStatus()
      : []
    : [];
  material.result_tags_header_img = material.userResult.result_tags_header_img.length
    ? material.userResult.result_tags_header_img
    : imgResult
    ? imgResult === MACHINE_STATUS
      ? getStatus()
      : []
    : [];

  // 处理修改变红
  material.update_status = setModifyInfo({
    brief: material.b_user_brief_update,
    header_img: material.b_user_head_image_url_update,
    nick: material.b_user_nick_update,
  });
  // 默认显示的头像和昵称的字符串
  const normalShowText: Array<string> = [material.user_nick, material.user_brief];
  // 处理敏感词列表合并去重
  const words =
    material &&
    getWords({
      fv: material.machine_result.sensitive.nick.words,
      sv: material.machine_result.sensitive.brief.words,
    });
  // 设置关键字飘红
  const [user_nick, user_brief] = words.length ? setRedStrByWords(words, normalShowText) : normalShowText;
  material.user_brief = user_brief;
  material.user_nick = user_nick;
  return material;
};

/**
 * 人审核打的标签
 * @param item 当前用户资料item
 */
export const userReviewStatus = (item: any) => {
  const result = [
    {
      update: item.b_user_brief_update,
      arr: item.result_tags_brief,
    },
    {
      update: item.b_user_head_image_url_update,
      arr: item.result_tags_header_img,
    },
    {
      update: item.b_user_nick_update,
      arr: item.result_tags_nick,
    },
  ]
    .filter(item => item.update)
    .map(e => e.arr);
  let status: number = 0;
  // // 没打标签，审核通过
  if (!result.length) {
    status = 3001;
  } else {
    // 都打标签 审核不通过
    if (result.every(ele => ele.length)) {
      status = 3002;
    } else if (result.every(ele => !ele.length)) {
      // 用户修改了 但是都审核通过 没打标签
      status = 3001;
    } else {
      status = 3003;
    }
  }
  return status;
};

/**
 * 用户资料审核给接口的参数
 * @param item
 */
export const userprofileToApiParams = (item: any) => {
  return {
    data_id: item.data_id,
    manual_status: userReviewStatus(item),
    // audit_level: item.audit_level,
    audit_level: item.audit_level === -1 ? 1 : item.audit_level,
    manual_result: JSON.stringify({
      result_tags_brief: item.result_tags_brief,
      result_tags_header_img: item.result_tags_header_img,
      result_tags_nick: item.result_tags_nick,
    }),
  };
};
