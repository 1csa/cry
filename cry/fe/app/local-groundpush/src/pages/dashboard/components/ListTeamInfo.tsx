import React, { memo, useMemo, ReactNode } from 'react';
import { Card, Icon, Menu, Popover, Tooltip } from 'antd';

import { RealtimeType } from '@/config/dashboard/dashboard.d';
import '../index.less';

interface TeamInfoProp {
  teamCardData: RealtimeType[];
  teamCardOnShow?: RealtimeType;
  onTeamNameChange: (newTeamToShow: number) => void;
}

type InfoCard = {
  cntitle: string;
  enTitle: string;
  description?: string;
}

const InfoCnMap: { [key: string]: string } = {
  teamName: '地推团队', pushManCount: '地推人员', activationCount: '新增激活量', repeatCount: '激活失败量'
};

const InfoCnMapCopy: InfoCard[] = [{
  enTitle: 'teamName', cntitle: '地推团队',
}, {
  enTitle: 'pushManCount', cntitle: '地推人员',
}, {
  enTitle: 'activationCount', cntitle: '新增激活量', description: '二次扫码成功的uid，次日会按设备、作弊、特征等过滤无效用户'
}, {
  enTitle: 'repeatCount', cntitle: '激活失败量', description: '二次扫码失败的uid，该uid为老用户或未开gps用户'
}];

const ListTeamInfo: React.FC<TeamInfoProp> = (props) => {
  const { teamCardData, teamCardOnShow, onTeamNameChange } = props

  const TeamMenu: ReactNode = useMemo(() => (
    <Menu
      className="realtime-teaminfo-menu"
      onClick={({ key }) => {
        onTeamNameChange(parseInt(key, 10))
      }}
    >{
        teamCardData.map(
          cardItem => <Menu.Item key={cardItem.teamId}>{cardItem.teamName}</Menu.Item>
        )
      }</Menu>
  ), [teamCardData]);

  const TeamSelect: ReactNode = useMemo(() => (
    <Popover content={TeamMenu} placement="leftTop" trigger="click">
      <Icon type="unordered-list" />
    </Popover>
  ), [TeamMenu]);

  return <div className="realtime-teaminfo">{
    InfoCnMapCopy.map(({ cntitle, enTitle, description }, index) => (
      <Card
        className="realtime-teaminfo-card"
        key={enTitle}
        title={<div>
          <span style={{ marginRight: 5 }}>{cntitle}</span>
          {description && <Tooltip title={description} placement="rightTop"><Icon type="question-circle" /></Tooltip>}
        </div>}
        extra={index === 0 ? TeamSelect : ''}
      >
        <span>当前</span>
        <span className="realtime-teaminfo-card-data">{
          teamCardOnShow !== undefined ? teamCardOnShow[enTitle] === '全部' ? teamCardData.length - 1 : teamCardOnShow[enTitle] : '-'
        }</span>
      </Card>
    ))
  }</div>;
}

export default memo(ListTeamInfo);
