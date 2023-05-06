import { RecItemProps, TopItemProps } from '@/config/topNews.js';
import { MouseEvent } from 'react';
import { saveLog } from '../../../common/Logger.js';

const isProd = process.env.NODE_ENV === 'production';

export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

export const formatNumber = (val: number | string | undefined): string => {
  if (val) {
    return val.toString().indexOf('.') > -1
      ? val.toLocaleString()
      : val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  return '';
};

export const jumpToIFrame = (
  event: MouseEvent<HTMLAnchorElement>,
  url: string,
  docid: string,
): void => {
  event.preventDefault();
  // document.querySelector("#ifr-article")!.src = url
  // document.querySelector(".ifr-docid")!.innerHTML = docid
};

export function saveKibana({ detail, docidList, actionMethod, channelid }: any): void {
  saveLog({
    log_source: { tag: isProd ? 'channelnew' : 'channeltest' },
    target_data: {
      detail: JSON.stringify(detail),
      docid: JSON.stringify(docidList),
      channelid: channelid,
    },
    action_method: actionMethod,
  });
}

// 两个数组对象对比key和value 返回两者不同的值
export function compare(preArr: any, nowArr: any) {
  let newList = Array(nowArr.length);
  for (let index = 0; index < nowArr.length; index++) {
    const preItem = preArr[index];
    const nowItem = nowArr[index];
    if (nowItem && preItem) {
      newList[index] = JSON.parse(JSON.stringify(nowItem));
      if (nowItem) {
        Object.keys(nowItem).map(item => {
          if (nowItem[item] === preItem[item]) {
            if (item !== 'docid') {
              delete newList[index][item];
            }
          }
        });
      }
    } else if (!preItem) {
      newList[index] = JSON.parse(JSON.stringify(nowItem));
    }
  }
  return newList;
}

export function formatNewsData(v: RecItemProps | TopItemProps) {
  let tmp: TopItemProps = {
    date: v.date || '',
    count: v.count || 0,
    title: v.title || '',
    fromid: v.fromid || '',
    fromid_hw: v.fromid_hw || '',
    docid: v.docid || '',
    source: v.source || '',
    image: v.image || '',
    image_urls: v.image_urls || [],
    tag: v.tag || '',
    is_news: v.is_news || 0,
    dtype: v.dtype || 0,
    group: v.group || '',
    ctype: v.ctype || '',
    global: v.global || false,
    editorOnly: v.editorOnly || null,
    editorEventLevel: v.editorEventLevel || '',
    last_update_ts: v.last_update_ts || Date.now(),
    feedback_forbidden: v.feedback_forbidden || false,
    toptype: 'top', // 强制变成top 后续看一下是否有影响 推荐里没这个字段
    // block_appids: v.block_appids || []
  };
  // if (v.subjectCover) {
  //   tmp.subjectCover = v.subjectCover;
  //   updateSubCover(v.docid, v.subjectCover);
  // }
  // if (v.title_new) {
  //   tmp.title_new = v.title_new;
  // }
  if (v.feedback_forbidden) {
    tmp.feedback_forbidden = v.feedback_forbidden;
  }
  // if (v.type){
  //   tmp.type = v.type;
  // }
  // if (v.dtype) {
  //   tmp.dtype = v.dtype;
  // } else {
  //   tmp.dtype = 0;
  // }
  if (v.audience_type) {
    tmp.audience_type = v.audience_type;
  }
  // if (v.cate) {
  //   tmp.cate = v.cate;
  // }
  // if (v.localization) {
  //   tmp.localization = v.localization;
  // }
  if (v.security || v.security == 0) {
    tmp.security = v.security;
  }
  // if (v.toptype) {
  //   tmp.toptype = v.toptype;
  // }
  // if (v.block_appids) {
  //   tmp.block_appids = v.block_appids
  // }
  return tmp;
}

export const hasAuth = (auth: Array<number>, fromid: string): boolean => {
  if (!auth.includes(135) && fromid === 'homepage') {
    // 首页置顶
    return false;
  }
  if (!auth.includes(136) && fromid === 'promotion') {
    // 推广专用
    return false;
  }
  if (!auth.includes(137) && fromid === 'hot') {
    //要闻
    return false;
  }
  if (!auth.includes(272) && fromid === 'hotpolitic') {
    //要闻指令
    return false;
  }
  if (!auth.includes(214) && fromid === '19thBig') {
    //十九大
    return false;
  }
  return true;
};

export const isDocid = (value: string) => {
  if (
    (value.length === 8 && value.search(/^\w+$/) === 0) ||
    /V_\w+$/.test(value) ||
    /K_\w+$/.test(value) ||
    /T_\w+$/.test(value) ||
    /J_\w+$/.test(value) ||
    /A_\w+$/.test(value) ||
    /N_\w+$/.test(value) ||
    /C_\w+$/.test(value) ||
    /E_\w+$/.test(value)
  ) {
    return true;
  }
  return false;
};
