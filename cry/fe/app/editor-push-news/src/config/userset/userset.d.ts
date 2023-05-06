import { Moment } from 'moment'

// properties
type PropertyProps = {
  [propName: string]: string
}

// 维度
export type DimensionProps = {
  key: string
  interests: string[]
  properties?: Array<PropertyProps> | null
}

// table 每一条记录
export type UserSetProps = {
  userSetId: number // 群组 id
  userSetName: string // 群组名
  userSetAliasName: string // 群组别名
  userEstimateFull: number // 用户量级
  createTime: number // 创建时间
  userEstimateUpdateTimeFull: number // 更新时间
  partitionTime: number // 快照时间
  author: string // 创建人邮箱
  authorName: string // 创建人姓名
  dimensions: Array<DimensionProps> // 维度
  deletable: boolean // 是否删除
  usage: 'GENERAL' | 'FREQUENT' // 是否个人收藏
}

// 搜索条件
export type SearchFormProps = {
  userSetIdOrName: string 
  authorEmails: Array<string> 
  timeStamp: Array<Moment> 
}

// email
export type EmailListProps = {
  email: string
  emailNickName: string
}

// form
export type UserSetFormProps = {
  name: string
  aliasName: string
  appid: Array<string>
  appidGroup: Array<string>
  gender: string | undefined
  gender_score: number
  age: Array<string> | undefined
  age_score: number
  persona: Array<string> | undefined
  appCareer: Array<string> | undefined
  lbs_user_group: Array<string> | undefined
  lbsBlock: string
  regionType: string
  lbsTier: Array<string> | undefined
  lbsProfile: Array<string> | undefined
  distributionChannel: Array<string> | undefined
  deviceName: Array<string> | undefined
  osVersion: Array<string> | undefined
  osVersion_iosCanClick: boolean
  osVersion_iostype: string | undefined
  osVersion_iosvalue: string | undefined
  osVersion_androidCanClick: boolean
  osVersion_androidtype: string | undefined
  osVersion_androidvalue: string | undefined
  dynamicVersion: Array<string> | undefined
  dynamicVersion_iosCanClick: boolean
  dynamicVersion_iostype: string | undefined
  dynamicVersion_iosvalue: string | undefined
  dynamicVersion_androidCanClick: boolean
  dynamicVersion_androidtype: string | undefined
  dynamicVersion_androidvalue: string | undefined
  createDays: undefined
  activationTime: undefined
  clickDaysInPassed30Days: undefined
  clickDaysInPassed30Days_start: number | undefined
  clickDaysInPassed30Days_end: number | undefined
  activeDays: undefined
  activeDays_start: number | undefined
  activeDays_end: number | undefined
  userBehavior: object | undefined
  sensTaste: object | undefined
  ctypeTaste: object | undefined
  sctCanClick: boolean
  sct: Array<string> | undefined
  sctScore: number | null
  vsctCanClick: boolean
  vsct: Array<string> | undefined
  vsctScore: number | null
  [propsName: string]: any
}
