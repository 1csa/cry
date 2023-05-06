type dropDownKeyType = 'classify' | 'id' | 'parent' | 'priority';

export interface dropDownProps extends Partial<Record<dropDownKeyType, number>> {
  cn: string;
}
// 负反馈审核操作人审按钮
export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | undefined;

// 曝光审核需要加入的一些按钮类型
export type BtnGroupTypes = {
  label: string;
  name: string;
  code: number | string;
  type: ButtonType;
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
  desc?: string;
  keyname?: string;
  keycode?: string | number;
  hasInput?: boolean;
  group?: string;
  groupCn?: string;
  // 子标签
  subLabels?: Array<{ label: string; value: string | number }>;
};

// 机器审核标签命中信息
export type SensitiveGroupType = {
  categoryName: string;
  highlightColor: string | string[];
  sort: number;
  words: string[];
};

type WordTypeInfo = {
  start: number;
  end: number;
  wordId: number;
  text: string;
  wordRemark: string[];
  actionType: string[];
};

// 敏感词高亮组
type NewWordsKeyList = 'highlightColor' | 'word';

export interface NewWordsListType extends Record<NewWordsKeyList, string> {}

type WordItemType = Pick<SensitiveGroupType, 'highlightColor' | 'words'>;
// 右侧显示敏感词的类型
export type ComposeWordsType = SensitiveGroupType & Partial<WordTypeInfo>;

// 用于 html 匹配敏感词的类型
type MatchNumberList = 'actionType' | 'start' | 'end' | 'wordId';
type MatchStringList =
  | 'cateOneCode'
  | 'cateOneName'
  | 'cateTwoCode'
  | 'cateTwoName'
  | 'expression'
  | 'highlightColor'
  | 'matchType'
  | 'text'
  | 'word'
  | 'wordRemark'
  | 'wordType';

export type IMatchWordsToHtml = Partial<Record<MatchNumberList, number> & Record<MatchStringList, string>>;

export interface IDefaultDropDownItem {
  label: string;
  value: number;
}


export interface exportCloumnsType {
  title: string,
  key: string,
  dataIndex?: string;
  [keyValue: string]: any;
}