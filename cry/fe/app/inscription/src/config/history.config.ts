import { ColumnType } from 'antd/es/table';
import { HistoryList } from '@/types/other';
import { parseTimekey } from '@/utils';

// 列表字段
export const LIST_ID = "id";                                        // ID-同没明白ID是啥理解为操作id往前提了一下
export const LIST_TARGET = "target_type";                           // 对象ID
export const LIST_TYPE = "operation_type";                          // 操作
export const LIST_NAME = "target_title";                            // 名称-没明白这个名称是啥
export const LIST_TARGET_ID = "target_id";                          // 操作对象id
export const LIST_OPERATOR = "operation_creator";                    // 操作人
export const LIST_TIMEKEY = "create_timekey";                              // 操作时间

// 筛选字段
export const SCREEN_TARGET = "target_type";
export const SCREEN_TYPE = "operation_type";
export const SCREEN_CARD_TYPE = "cardType";                         // 针对某个类型卡片的操作信息
export const SCREEN_OPERATOR = "operation_creator";
export const SCREEN_START = "create_start";
export const SCREEN_END = "create_end";

// 操作对象，这里没有能表示出不同类型卡片的区分
export const targetOptions = [
  { label: "卡片管理", value: 'card' },
  { label: '策略管理', value: "strategy" },
  { label: "负反馈策略", value: "feedback" },
  { label: "投放管理", value: "launch" }
];

// 操作类型
export const typeOptions = [
  { label: "新增", value: "add" },
  { label: "修改", value: "update" },
  { label: "停用", value: "stop" },
  { label: "删除", value: "delete" },
  { label: "恢复", value: "reuse" },
  { label: "复制", value: "copy" }
];

export const HistoryColumnConfig: ColumnType<HistoryList>[] = [
  {
    title: "ID",
    key: LIST_ID,
    dataIndex: LIST_ID,
  }, {
    title: "操作类型",
    key: LIST_TYPE,
    dataIndex: LIST_TYPE,
    render: text => text ? typeOptions.find(item => item.value === text)?.label : '--'
  }, {
    title: "操作对象",
    key: LIST_TARGET,
    dataIndex: LIST_TARGET,
    render: text => text ? targetOptions.find(item => item.value === text)?.label : '--' // 会有值map
  }, {
    title: "名称",
    key: LIST_NAME,
    dataIndex: LIST_NAME,
    render: text => text ? text : '--'
  }, {
    title: "对象ID",
    key: LIST_TARGET_ID,
    dataIndex: LIST_TARGET_ID,
  }, {
    title: "操作人",
    key: LIST_OPERATOR,
    dataIndex: LIST_OPERATOR,
    render: text => text ? decodeURIComponent(text).replace("@yidian-inc.com", '') : '--'
  }, {
    title: "操作时间",
    key: LIST_TIMEKEY,
    dataIndex: LIST_TIMEKEY,
    render: text => text ? parseTimekey(text) : '--'
  }
]
