import { PushData } from "@/config/editorpush/push";

export type SearchFormProps = {
  user_name?: string | undefined
}

export interface AccountProps extends AccountFormProps {
  user_name: string
  // user_email: string
  // permission: Array<string>
  operator: number
  last_update_time: string
  status: string
}

export interface AccountFormProps {
  user_email: string
  switch: string
  permission: Array<string>
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 这个不知道咋用。。。
export type Response<T=any> = {
  status: string
  code: number
  count?: number
  editor_info?: Array<T>
  reason?: string
}

export type EditorAuthes = {
  permission: string[];
  push_key: string;
  channels: Record<string, string>;
  exclude_channels: Record<string, string>;
}

export type ToolAuthes = string[]

export type TempType = {
  temp_id: string;
  temp_name: string;
  forms: Record<string, string[]>;
  values: Partial<PushData>;
}

export type AccountInfo = {
  name?: string;
  email?: string;
  avatar?: string;
}
