/**
 * actionType 每次添加一个类型都需要在css样式文件中对应的增加一个样式
 */
import { SelectOptionsType } from '@/types';
export const actionType: Array<Omit<SelectOptionsType, 'count'>> = [
  { label: '无', value: -1 },
  { label: '屏蔽', value: 1 },
  { label: '进审', value: 2 },
  { label: '仅自己可见', value: 3 },
  { label: '提示', value: 4 },
  { label: '监控', value: 5 },
];

export const wordStatus: {
  [K: string]: string;
} = {
  notEffect: '未生效',
  effect: '生效中',
  expired: '已失效',
};

export const status: Array<Omit<SelectOptionsType, 'count'>> = [
  {
    label: '禁用',
    value: 1,
  },
  {
    label: '未生效',
    value: 2,
  },
  {
    label: '生效中',
    value: 3,
  },
  {
    label: '已失效',
    value: 4,
  },
];

export const stepsItem: Array<{
  title: string;
}> = [
  {
    title: '上传文件以及关联业务',
  },
  {
    title: '内容写入',
  },
];
