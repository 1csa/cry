declare module '*.css';
declare module '*.png';
declare const APP_ENV: string;
declare const PANDORA_TOOL_ID: string | number;

declare interface SLIDE {
  id: string,
  url: string
}

declare interface TOPIC {
  id?: string,
  name: string,
  creator: string,
  operator: string,
  fromid?: string[],
  summary?: string,
  image?: string,
  icon_color?: string,
  icon_text?: string,
  tags_id?: number,
  key?: string,
  status?: number
  add_time?: string,
  update_time?: string,
  content_num?: number
}

declare interface SEARCH_CONDITION {
  id?: string,
  name?: string,
  creator?: string,
  createAt?: string[],
  order?: string,
  // city?: string,
  status?: string
}

declare interface DOC {
  docid: string
  title: string
  date: string
  removed: boolean
  talk_id: number
  checked?: boolean
}
