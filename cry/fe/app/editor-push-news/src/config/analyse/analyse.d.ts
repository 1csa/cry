import { number } from "prop-types"

export type UserProfileItem = {
  id: string,
  name: string,
  mean: number
}

type Gender = {
  male: number
  female: number
}

type Age = {
  A_0_24: number
  A_25_29: number
  A_30_39: number
  'A_40+': number // key has + ????
  [key: string]: number
}

export type SampleUsersProps = {
  day: string
  user_id: string
  ch_label: string
}

export type UserBasicInfoProps = {
  geoCity: string
  ens_gender: Gender
  ens_age: Age
  deviceName: string
  os: string
  appid: string
  version: string
  createDate: string
  lastUpdateDate: string
  active_user_thirty_dyd: number
}

export type UserProfileProps = {
  [key: string]: Array<UserProfileItem>
}

export type AppDocDetailProps = {
  day: string
  doc_id: string
  cat: Array<string>
  title: string
  summary: string
  subject: string
  is_from_push: string
  complete_region: string
  kws: Array<string>
}

export type PushDocDetailProps = {
  day: string
  push_id: string
  doc_id: string
  cat: Array<string>
  score: string
  score_model: string
  title: string
  summary: string
  priority: string
  channels_with_name: string
  exclude_channels_with_name: string
  gid: string
  gid_name: string
  push_type: string
  push_type_name: string
  action_push_ts: string
  action_arrival_ts: string
  action_click_ts: string
  subject: string
  complete_rate: string
  doc_recall_reason: string
  kws: Array<string>
}

export type UserStatisticProps = {
  day: string
  client_review_cnt: string
  client_click_cnt: string
  client_ctr: string
  push_arrive_cnt: string
  push_click_cnt: string
  push_ctr: string
}

export type AppStatisticProps = {
  cat: string
  client: number
}

export type PushStatisticProps = {
  cat: string
  push: number
}