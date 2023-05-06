export type RealtimeType = {
  teamId: number,
  teamName?: string,
  pushManCount?: number,
  activationCount?: number,
  repeatCount?: number
}

export type HourDataType = {
  id: number,
  timeKey: string,
  type: number,//1、当日数据 2、昨日数据 7、七天前数据
  teamId: number,
  activationCount: number
}
