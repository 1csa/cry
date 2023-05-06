import React, { memo, useState, useEffect, useCallback } from 'react';

import { usePost } from '@/services/common';
import { ChartPolygonal } from '@/components';
import { PolygonalDataType } from '@/config/app.d';
import ListTeamInfo from './ListTeamInfo';
import { RealtimeType, HourDataType } from '@/config/dashboard/dashboard.d';
import '../index.less';

const RealtimeData =()=>{
  const { data: teamData, fetchData: fetchTeamData } = usePost<RealtimeType[]>('/home/overView');
  const { data: hourData, fetchData: fetchHourData } = usePost<PolygonalDataType<HourDataType>>('/home/hourData');

  const [ allTeamcards, setAllTeamCards ] = useState<RealtimeType[]>([]);
  const [ teamDataToShow, setTeamDataToShow ] = useState<RealtimeType>();

  // 私以为这个定时没啥意义，不如给一个手动刷新按钮
  useEffect(()=>{
    let initialFetch = ()=> {
      fetchTeamData();
      fetchHourData({});

      return initialFetch;
    }
    let timeout = setInterval(initialFetch(), 5*60*1000);
    return ()=>{
      clearInterval(timeout);
    }
  }, []);

  useEffect(()=>{
    if ( !teamData ) { return; }

    let totalCard: RealtimeType = { teamId: 0, teamName: '全部' }, newAllTeamcards: RealtimeType[];

    totalCard.pushManCount = teamData.reduce((prev,team)=> prev+ (team.pushManCount || 0), 0);
    totalCard.activationCount = teamData.reduce((prev,team)=> prev+ (team.activationCount || 0), 0);
    totalCard.repeatCount = teamData.reduce((prev, team)=> prev + ( team.repeatCount || 0), 0);

    newAllTeamcards = [totalCard, ...teamData];
    setAllTeamCards(newAllTeamcards);
    setTeamDataToShow(totalCard);
  }, [teamData]);

  const handleTeamChange=useCallback((newTeamToShow: number): void=>{
    let newTargetTeamData = allTeamcards.find((dataItem)=>dataItem.teamId === newTeamToShow);

    setTeamDataToShow(newTargetTeamData);
    fetchHourData({teamId: newTeamToShow === 0 ? undefined : newTeamToShow}); //选择全部时不传相应的参数
  }, [allTeamcards]);

  const genDefaultXAxis = useCallback(()=>{
    let defaultXAxis = [];
    for (let i =0; i < 24; i++ ){
      let xAxisString = i<10 ? `0${i}:00` : `${i}:00`;
      defaultXAxis.push(xAxisString);
    }
    return defaultXAxis;
  }, []);

  return (
    <>
      <div className="dashboard-title">
        <h3>实时数据</h3>
        <span>以当天0时起为起始时间累计统计，每5分钟更新一次</span>
      </div>
      <div className="dashboard-container realtime">
        <ListTeamInfo
          teamCardData={allTeamcards} onTeamNameChange={handleTeamChange} teamCardOnShow={teamDataToShow}
        />
        <div className="realtime-hourChart">
          <h3>小时数据</h3>
          <ChartPolygonal<HourDataType>
            dataSource={hourData}
            indicators="activationCount"
            xAxis={genDefaultXAxis()}
            title="小时数据"
          />
        </div>
      </div>
    </>
  );
};

export default memo(RealtimeData);
