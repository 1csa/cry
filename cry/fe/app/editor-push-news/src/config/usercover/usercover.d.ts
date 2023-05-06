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
  gender: string | undefined
  gender_score: number
  age: Array<string> | undefined
  age_score: number
  regionType: string
  lbsProfile: Array<string> | undefined
  sctCanClick: boolean
  sct: Array<string> | undefined
  sctScore: number | null
  vsctCanClick: boolean
  vsct: Array<string> | undefined
  vsctScore: number | null
  radius: number | null
  [propsName: string]: any
}
