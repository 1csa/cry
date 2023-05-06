export interface TeamProps {
  id: 4,
  teamName: string,
  leaderName: string,
  leaderPhone: string,
  leaderWx?: string,
  cooperationStartTime: string,
  cooperationEndTime: string,
  status: 0 | 1,
  stopReason: string,
  createTime: string,
  updateTime: string,
  updateUser: string,
  citys: {
    id: number,
    cityName: 'string',
    parentId: number,
    teamId: number
  }[]
}

export interface TeamScreenParams {
  offset: number,
  limit: number,
  teamIds: number[],//查询团队id
  cityIds: number[],//团队所负责城市id
  status: 0 | 1//状态1、服务中 0、停止服务
}
