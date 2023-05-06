import { ColumnProps } from 'antd/es/table';
import React from 'react';

import { FormConfig, OppoQuota, TempValue, TempConfig, Temp, Biz } from '@/config/editorpush/push';
import { isNumStr } from '@/utils';

export const default_temp_config: TempConfig = {};
export const default_temp_value: TempValue = {};
export const default_biz: Biz = 'YDZX';
export const default_temp: Temp = undefined;

export const push_type_schema: Record<string, FormConfig> = {
  normal: {
    name: '',
    forms: ['docid', 'title', 'summary'],
  },
  url: {
    name: '',
    forms: ['url', 'title', 'summary'],
  },
  talk: {
    name: 'talk_action_params',
    forms: ['talk', 'title', 'summary'],
  },
  channel_card: {
    name: '',
    forms: ['channel', 'title', 'summary'],
  },
  bottom_tab: {
    name: 'bottom_tab_action_params',
    forms: ['tab', 'channel', 'title', 'summary'],
  },
};
/**
 * 分段式分发有效时间
 */
export const observeTimeAuto: number = 60;
export const observeTimeAutoBreak: number = 15;


/**
 *
 * @returns 接口传输对应数据的数组
 */
 export const request_section_msg = {
  group1: [
    {
      bucketName: 'pabt_horse_1_expA20',
      percent: 20,
    },
    {
      bucketName: 'pabt_horse_1_expB20',
      percent: 20,
    },
    {
      bucketName: 'pabt_horse_1_base60',
      percent: 60,
    },
  ],
  group2: [
    {
      bucketName: 'pabt_horse_2_expA10',
      percent: 10,
    },
    {
      bucketName: 'pabt_horse_2_expB10',
      percent: 10,
    },
    {
      bucketName: 'pabt_horse_2_base80',
      percent: 80,
    },
  ],
  group3: [
    {
      bucketName: 'pabt_horse_3_expA10',
      percent: 10,
    },
    {
      bucketName: 'pabt_horse_3_expB10',
      percent: 10,
    },
    {
      bucketName: 'pabt_horse_3_expC10',
      percent: 10,
    },
    {
      bucketName: 'pabt_horse_3_base70',
      percent: 70,
    },
  ],
};

export const push_section_type = {
  group1: {
    name: '实验组1',
    value: 'group1',
  },
  group2: {
    name: '实验组2',
    value: 'group2',
  },
  group3: {
    name: '实验组3',
    value: 'group3',
  },
};

interface Test {
  name: string;
  flow: string;
  bucket: string;
}
interface Groups {
  [key: string]: Test;
}
interface Section_type {
  group1: Groups;
  group2: Groups;
  group3: Groups;
}
export const push_section_content: Section_type = {
  group1: {
    test1: {
      name: '实验1',
      flow: '20%流量',
      bucket: 'pabt_horse_1_expA20'
    },
    test2: {
      name: '实验2',
      flow: '20%流量',
      bucket: 'pabt_horse_1_expB20'
    },
    test3: {
      name: '实验3',
      flow: '60%流量',
      bucket: 'pabt_horse_1_base60'
    },
  },
  group2: {
    test1: {
      name: '实验1',
      flow: '10%流量',
      bucket: 'pabt_horse_2_expA10'
    },
    test2: {
      name: '实验2',
      flow: '10%流量',
      bucket: 'pabt_horse_2_expB10'
    },
    test3: {
      name: '实验3',
      flow: '80%流量',
      bucket: 'pabt_horse_2_base80'
    },
  },
  group3: {
    test1: {
      name: '实验1',
      flow: '10%流量',
      bucket: 'pabt_horse_3_expA10'
    },
    test2: {
      name: '实验2',
      flow: '10%流量',
      bucket: 'pabt_horse_3_expB10'
    },
    test3: {
      name: '实验3',
      flow: '10%流量',
      bucket: 'pabt_horse_3_expC10'
    },
    test4: {
      name: '实验4',
      flow: '70%流量',
      bucket: 'pabt_horse_3_base70'
    },
  },
};

export const test_message = '实验有效期为：1h，CTR阈值为：0%';

export const duplicate_columns = [
  {
    title: '时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '重复原因',
    key: 'reason',
    render: (text: any, render: any) => {
      switch (text) {
        case 'docid':
          return <span>【docid 重复】 ${render.doc_id}</span>;
        case 'title':
          return <span>【标题重复】 ${render.title}</span>;
        case 'summary':
          return <span>【摘要重复】 ${render.summary}</span>;
        default:
          return '-';
      }
    },
  },
  {
    title: 'docid',
    dataIndex: 'doc_id',
    key: 'doc_id',
  },
  {
    title: '推送方式',
    dataIndex: 'userids',
    key: 'userids',
  },
  {
    title: '推送标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '包含标签',
    dataIndex: 'include_channels',
    render: (text: any, render: any) => {
      return text.length
        ? text.map((item: any) => {
            return (
              <div key={item.channelId}>
                {item.info.topicName || 'null'}({item.channelId})
              </div>
            );
          })
        : '-';
    },
  },
  {
    title: '排除标签',
    dataIndex: 'exclude_channels',
    render: (text: any, render: any) => {
      return text.length
        ? text.map((item: any) => {
            return (
              <div key={item.channelId}>
                {item.info.topicName || 'null'}({item.channelId})
              </div>
            );
          })
        : '-';
    },
  },
  {
    title: 'push type',
    dataIndex: 'push_type',
    key: 'push_type',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
  },
];

export const oppo_columns: ColumnProps<OppoQuota>[] = [
  {
    title: '用户分层',
    dataIndex: 'level_name',
    key: 'level_name',
  },
  {
    title: '配额',
    dataIndex: 'level_avalible_count',
    key: 'level_avalible_count',
  },
  {
    title: '已使用额',
    dataIndex: 'send_count',
    key: 'send_count',
  },
  {
    title: '余额',
    dataIndex: 'remaining_count',
    key: 'remaining_count',
  },
  {
    title: '已使用百分比',
    dataIndex: 'send_percent',
    key: 'send_percent',
    render: (text: string) => {
      return <span>{isNumStr(text) ? (+text * 100).toFixed(2) + '%' : '--'} </span>;
    },
  },
  {
    title: '更新时间',
    dataIndex: 'gmt_create',
    key: 'gmt_create',
  },
];

// 排除推送用户对应的默认项 目前直接前端写死了 后续可以在mongodb修改 pushuser组件里有对应key value
export const arrayTags: Record<string, string[]> = {
  '001': ['e2465900', 'e2465918', 'e2465899', 'e2465915', 'e3144742'],
  '002': ['e2465900', 'e2465918', 'e2465899', 'e2465906', 'e2465909', 'e2465919', 'e2552446', 'e2465905', 'e2960438', 'e2960439', 'e2960440', 'e2960441', 'e3144742'],
  '003': ['e2465900', 'e2465918', 'e2465899', 'e2465915', 'e3144742'],
  // '003': ['e2465900', 'e2465918', 'e2465899', 'e2465906', 'e2465909', 'e2465919', 'e2552446', 'e2465905'],
  '004': [],
};

export const defaultTags: Record<string ,string> = {
  e2465900: 'xiaomi重度沉默用户',
  e2465918: 'xiaomi沉默90天以上用户',
  e2465899: 'xiaomi中度沉默用户',
  e3144742: '华为渠道所有用户'
};

export const defaultTags1: Record<string ,string> = {
  e2465900: 'xiaomi重度沉默用户',
  e2465918: 'xiaomi沉默90天以上用户',
  e2465899: 'xiaomi中度沉默用户',
  e2465915: 'oppo渠道所有用户',
  e3144742: '华为渠道所有用户'
  // e2465904: 'oppo活跃老用户',
};

export const pushStateObj: Record<string ,string> = {
  view_uv: '推送人数',
  view_pv: '推送次数',
  click_uv: '点击人数',
  click_pv: '点击次数',
  arrive_uv: '到达人数',
  arrive_pv: '到达次数',
  click_rate: '点击率',
  convert_rate: '转换率',
  real_click_rate: '真实点击率',
  real_convert_rate: '真实转换率',
};

export const defaultTags2: Record<string ,string> = {
  e2465900: 'xiaomi重度沉默用户',
  e2465918: 'xiaomi沉默90天以上用户',
  e2465899: 'xiaomi中度沉默用户',
  e2465906: 'oppo中度沉默用户',
  e2465909: 'oppo重度沉默用户',
  e2465919: 'oppo沉默90天以上用户',
  e2465904: 'oppo活跃老用户',
  e2552446: 'oppo次活跃老用户',
  e2465905: 'oppo轻度沉默用户',
  e3144742: '华为渠道所有用户'

  // e2961850: 'oppo中度沉默_无种子用户',
  // e2961851: 'oppo重度沉默_无种子用户',
  // e2961852: 'oppo沉默90天以上_无种子用户',

  // ['e2465900', 'e2465918', 'e2465899', 'e2465906', 'e2465909', 'e2465919', 'e2465904', 'e2552446', 'e2465905']
  // 下面这些先隐藏 后续可能再放开
  // e2960438: 'oppo轻度沉默低活用户_不活跃编辑',
  // e2960439: 'oppo中度沉默低活用户_不活跃编辑',
  // e2960440: 'oppo重度沉默低活用户_不活跃编辑',
  // e2960441: 'oppo沉默90天低活用户_不活跃编辑',
};
