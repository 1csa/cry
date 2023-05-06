import { GidProps } from '@/config/gid/gid'

declare enum TriggerType {
  EDITOR,
  ROBOT,
  API,
}

declare enum Users {
  ALL_BREAK,
  ALL,
  ALL_LIGHT,
  AUTO,
  AUTO_BREAK,
  AUTO_ADD,
  USER_ID,
  APP_IDS,
}

export type PushtypeProps = {
  id: number | undefined
  name: string | undefined
  gid: GidProps
  triggerType: TriggerType | undefined 
  users: Users | undefined 
  status: number
  includeAppIds: Array<string> | undefined
  excludeAppIds: Array<string> | undefined
  excludeFromids: Array<string> | undefined
  score: number | undefined
  desc: string | undefined
}
