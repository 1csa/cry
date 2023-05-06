export type CommomTeamType = {
  timeKey: string;
  teamId: number;
  activationCount: number;
  cheaterCount: number;
  oneDayRetention: number;
  sevenDayRetention: number;
  thirtyDayRetention: number;
}
export type TeamProps = {
  teamName: string;
} & CommomTeamType;

export type TeamChartProps = {
  [key: string]: CommomTeamType
}

export type UserProps = {
  timeKey: string//激活time
  teamName: string,//团队名称
  teamId: number,//团队id
  userId: number,//用户id
  appVersion: string,//版本号
  brand: string, //机型
  activationTime: string,//激活时间
  city: string, //城市名称
  cityId: string,//城市id
  lng: string,//经度
  lat: string,//维度
  userName: string,//用户姓名
  pushManId: number,//推广人id
  pushManName: string,//推广人姓名
  isCheater: 0 | 1,//是否作弊用户 0 否 1 是
  os: 0 | 1,//机型 0 ios 1 android
  activationDate: string, //
  effectStatus: 0 | -1 | 1, //有效状态 0、待确定 1、有效 、-1 无效
  cheatReason: string //作弊或者无效原因
}

export type BasicTeamScreen = {
  startTime: string;
  endTime: string;
}

export type TeamScreenProps = {
  startTime: string;
  endTime: string;
} & ({ cityIds: number[] } | { teamIds: number[] })

export type TeamScreenWithPager = BasicTeamScreen & {
  offset: number,
  limit: number,
  desc: "asc" | undefined;
}

export type BasicUserScreen = {
  limit: number;
  offset: number;
  desc: "asc" | undefined;
}

export type UserScreenProps = BasicUserScreen & (
  { userIds: number[] } | { pushManIds: number[] } | { teamIds: number[] }
);

// export type UserScreenProps = {
//   limit: number;
//   offset: number;
//   userIds?: number[];
//   teamIds?: number[];
//   pushManIds?: number[];
//   startTime: string;
//   endTime: string;
// }
