import { type } from "os"

export type ExperimentListProps = {
  id: string
  bucket_name: string
  bucket_info: string
  bucket_creator: string
  create_time: string
  update_time: string
  expire_time: string
  expire_offline_time: string
  bucket_appids: string
  bucket_config: Array<ExperimentConfig | undefined>
}

type ExperimentConfig = {
  bucket_mode: string
  bucket_ratio: string
  bucket_shuffle: string
  bucket_mode_id: number
}

export type ExperimentDetailListProps = {
  create_time: string
  bucket_name: string
  bucket_mode: string
  user_layer: string
  days: string
  gid: string
  push_type: string
  priority: string
  ctr_pv: string
  real_ctr_pv: string
  transform_pv: string
  noti_off_uv: string
  real_transform_pv: string
  [key: string]: any
}

export type ExperimentSearchProps = {
  bucket_name: string
  bucket_mode?: string
  user_layer?: string
  gid?: string
  push_type?: string
  priority?: string
}

export type ExperimentSettingProps = {
  email: string | null
  days: Array<string>
  bucket_name: string
  bucket_mode: Array<string>
  user_layer: Array<string>
  gid: Array<string>
  push_type: Array<string>
  priority: Array<string>
}

export type ExperimentIndicatorDetailListProps = {
  p_day: string
  recall_pv: Map
  strategy_pv: Map
  push_pv: Map
  arrive_pv: Map
  dau: string
  noti_off_rate: string
  // uninstall_rate: string
}

type Map = {
  base: string
  exp: string
}