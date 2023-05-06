import { PushFormProps } from "@/config/pushForm/push";

export interface FormItem {
  name: string;
  rstype: string;
  section?: boolean;
  index?: number
}

export interface DocidForm extends FormItem { }

export interface TitleForm extends FormItem { }

export interface SummaryForm extends FormItem { }

export interface UrlForm extends FormItem { }

export interface TalkForm extends FormItem { }

export interface ChannelForm extends FormItem { }

export interface ThemeForm extends FormItem { }

export interface TabForm extends FormItem { }

export type FormConfig = {
  name: string,
  forms: string[]
}

// 暂时通过原有的定义来兼容
export type PushData = Partial<PushFormProps>;

export type TagType = {
  id: string;
  name: string;
  count: string;
}

export type OppoQuota = {
  app_id: string;
  dt: string;
  gmt_create: string;
  id: string;
  level_avalible_count: string;
  level_name: string;
  level_percent: string;
  level_sort: string;
  level_uv: string;
  remaining_count: string;
  remaining_percent: string;
  send_count: string;
  send_percent: string;
  total_avalible_count: string;
}

export type PushType = 'userids' | 'auto' | 'auto_break' | 'all_break' | 'appids';
export type Biz = "YDZX" | "LOCALSIDE" | "METRO";
export type Temp = string | undefined;
export type TempValue = PushData;
export type TempConfig = Record<string, string[]>;

export type PushDocInfo = {
  docid: string;
  title?: string;
  summary?: string;
  error?: string;
}

export type DocInfo = {
  image?: string;
  image_urls?: Array<string>;
  ncat?: string;
  nsubcat?: string;
  rec_tags?: Record<string, string>;
  serving_status?: boolean;
  summary?: string;
  title?: string;
}
