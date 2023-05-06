export type Blackinfo = {
  mobile: string, // 手机号
  userid: string, // 加入黑名单时关联userid
  operator: string, // 操作人
  op_from: string, // 操作来源
  state: string, // 是否生效，1为生效，0为不生效
  create_time: string, // 记录创建时间
  update_time: string // 记录更新时间
}
