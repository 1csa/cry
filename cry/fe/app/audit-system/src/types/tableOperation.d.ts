import { BtnGroupTypes } from '@/types';

export type TableItemType = {
  dataIndex?: number | string | Array<string>;
  title: string | React.ReactNode;
  key: string;
  width?: number | string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
};

export type ColumnsType = {
  columns?: TableItemType[];
  operation: TableItemType[];
};

export type ManualStatus = {
  type: string;
  status: number;
};

// 初始化接口返回的一些字段
type InitTypes = 'code' | 'label' | 'desc' | 'keyname' | 'keycode' | 'group';

export type ToInitButtonGroupType = Pick<Partial<BtnGroupTypes>, InitTypes>;

export type ManualType = {
  result_tags_brief: ManualStatus[];
  result_tags_header_img: ManualStatus[];
  result_tags_nick: ManualStatus[];
  desc: string;
  labels?: ToInitButtonGroupType[];
};
