// table 每一条记录
export type PushHistoryProps = {
  docid: string
  title: string
  head: string
  date: string
  channel: Array<string>
  userids: string
  operator: string
  push_id: string
  push_type: number
  pushID: string
  count: number
  push_type_name: string
  pause?: boolean
}
