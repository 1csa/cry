import React from 'react';
import { ColumnType } from 'antd/es/table';

import { YLink } from '@/components';
import { LaunchList, LaunchForm, FormScreen } from '@/types/launch';
import { CARD_PATH, STRAT_PATH } from '@/config/app.config';
import { parseEmailName, parseTimekey } from '@/utils';

export const FORM_ID = 'launch_id';                                         // 投放id
export const FORM_CARD = 'card_id';                                         // 卡片id
export const FORM_STRATEGY = 'strat_id';                                    // 策略id
export const FORM_TITLE = 'launch_name';                                    // 投放名称
export const FORM_REMARK = 'launch_remark';                                 // 投放说明
export const FORM_START = 'launch_start';                                   // 投放开始时间
export const FORM_END = 'launch_end';                                       // 投放结束时间

export const LIST_ID = 'launch_id';                                         // 投放id
export const LIST_CARD = 'card_id';                                         // 卡皮id
export const LIST_STRAT = 'strat_id';                                       // 策略id
export const LIST_TITLE = 'launch_name';                                    // 投放名称
export const LIST_REMARK = 'launch_remark';                                 // 投放说明
export const LIST_STATUS = 'launch_status';                                 // 投放状态
export const LIST_CREATE = 'create_timekey';                                // 创建时间
export const LIST_CREATOR = 'launch_creator';                               // 创建者
export const LIST_START = 'launch_start';                                   // 投放开始时间
export const LIST_END = 'launch_end';                                       // 投放结束时间

export const SCREEN_ID = 'launch_id';
export const SCREEN_CARD = "launch_card";
export const SCREEN_APPID = 'appid';
export const SCREEN_NAME = 'launch_name';
export const SCREEN_CREATER = 'launch_creater';
export const SCREEN_STATUS = 'launch_status';
export const SCREEN_CREATE_START = 'create_start';
export const SCREEN_CREATE_END = 'create_end';
export const SCREEN_LAUNCH_START = 'launch_start';
export const SCREEN_LAUNCH_END = 'launch_end';

// 状态可以写成枚举
export const STATUS_ALL = 0; // 全部
export const STATUS_TODO = 1; // 待投放
export const STATUS_ING = 2; // 投放中
export const STATUS_END = 3; // 投放结束
export const STATUS_STOP = 4; // 人工截止

export const StatusOptions = [
  {
    label: '全部',
    value: STATUS_ALL,
  },
  {
    label: '投放结束',
    value: STATUS_END,
  },
  {
    label: '待投放',
    value: STATUS_TODO,
  },
  {
    label: '投放中',
    value: STATUS_ING,
  },
  {
    label: '人工停止',
    value: STATUS_STOP,
  },
];

export const SELF_DEFINE_TIME = 'self_define';

export const TimeOptions = [
  {
    label: '一天',
    value: 1,
  },
  {
    label: '三天',
    value: 3,
  },
  {
    label: '七天',
    value: 7,
  },
  {
    label: '三十天',
    value: 30,
  },
  {
    label: '自定义',
    value: 0,
  },
];

export const TimeValues = [1, 3, 7, 30];

export const LaunchListColumn: ColumnType<LaunchList>[] = [
  {
    dataIndex: LIST_ID,
    key: LIST_ID,
    title: '投放ID',
  },
  {
    dataIndex: LIST_STRAT,
    key: LIST_STRAT,
    title: '策略ID',
    render: text =>
      text && (
        <YLink to={`${STRAT_PATH}/${text}`} type="link">
          {text}
        </YLink>
      ),
  },
  {
    dataIndex: LIST_CARD,
    key: LIST_CARD,
    title: '卡片ID',
    render: text =>
      text ? (
        <YLink to={`${CARD_PATH}/${text}`} type="link">
          {text}
        </YLink>
      ) : (
        '--'
      ),
  },
  {
    dataIndex: LIST_STATUS,
    key: LIST_STATUS,
    title: '状态',
    width: 90,
    render: value => (value ? StatusOptions.find(option => option.value === value)?.label : '--'),
  },
  {
    dataIndex: LIST_CREATOR,
    key: LIST_CREATOR,
    title: '创建者',
    ellipsis: true,
    width: 100,
    render: text => text ? parseEmailName(text) : '--', // 只保留邮箱前缀
  },
];

export const defaultLaunch: LaunchForm = {
  [FORM_ID]: null,
  [FORM_TITLE]: null,
  [FORM_CARD]: null,
  [FORM_STRATEGY]: null,
  [FORM_REMARK]: null,
  [FORM_START]: Date.now(),
  [FORM_END]: Date.now(),
}

export const defaultScreen: FormScreen = {
  [SCREEN_ID]: null,
  [SCREEN_CARD]: null,
  [SCREEN_APPID]: null,
  [SCREEN_NAME]: null,
  [SCREEN_CREATER]: null,
  [SCREEN_STATUS]: 0,
  [SCREEN_CREATE_START]: null,
  [SCREEN_CREATE_END]: null,
  [SCREEN_LAUNCH_START]: null,
  [SCREEN_LAUNCH_END]: null,
}
