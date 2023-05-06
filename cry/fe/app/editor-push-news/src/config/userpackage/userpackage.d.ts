export type LabelList = {
  labelName: string;
}[];
export type TagLabelProps = {
  labelName: string;
  subLabelList: LabelList;
}[];
export type UserTagProps = {
  userTagCode: string;
  userTagName: string;
  todayIncre: string | number;
};
export type UserTagListProps = UserTagProps[];

export type queryTagListProps = {
  userTagList: UserTagListProps;
};

export type SearchFormProps = {
  primaryLabel: string;
  subLabel?: string;
  userTagCode: string;
  keywords?: string | null;
  userId?: string | null;
};

export type DocListProps = {
  docId: string;
  title: string;
  click: number;
  primaryLabelName: string;
  subLabelName: string;
  source: string;
  checked?: boolean;
};

// 折线图数据格式
export type LineData = {
  date: string;
  channel: string;
  category: string;
  value: number;
}[];

// 折线图数据格式
export type LineDataObject = {
  [x: string]: LineData;
};

// 通用折现图数据格式(有渠道)
export type GeneralLineData = {
  chartsData: {
    [x: string]: LineData;
  };
  channelList: string[];
};
