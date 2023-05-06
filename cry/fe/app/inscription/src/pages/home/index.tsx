/**
 * 首页信息, 接口数据分开获取
 */
// TODO: 首页数据接口：包含今日数据、卡片统计、每日新建卡片数据、近七天被关联策略数

import React, { useCallback } from 'react';
import { Divider } from 'antd';

import { ChartLine, ChartBar } from '@/components';
import { HomeNewerItem, HomeRelateItem, StatisticItem } from '@/types/other';
import { Overview, Statistic, Reload } from '@/pages/home/components';
import { CHART_CARD_DATA, CHART_CARD_DATE, CHART_STRAT_DATA, CHART_STRAT_NAME } from '@/config/home.config';
import './index.less';

const demoSummary: Array<StatisticItem> = [
  {
    name: 'effective',
    count: 12,
  },
  {
    name: 'total',
    count: 1123,
    minus: 32,
  },
];

const demoCards: Array<StatisticItem> = [
  {
    name: 'video',
    count: 8,
    minus: -11,
  },
  {
    name: 'audio',
    count: 5,
    minus: -11,
  },
  {
    name: 'doc',
    count: 4,
    minus: -11,
  },
  {
    name: 'channel',
    count: 4,
    minus: -11,
  },
];

const demoChartCard: Array<HomeNewerItem> = [
  {
    date: '2020-09-02',
    data: 0,
  },
  {
    date: '2020-09-03',
    data: 20,
  },
  {
    date: '2020-09-04',
    data: 17,
  },
  {
    date: '2020-09-05',
    data: 30,
  },
  {
    date: '2020-09-06',
    data: 29,
  },
];

const demoChartStrat: Array<HomeRelateItem> = [
  {
    name: '电影频道引流',
    data: 23,
  },
  {
    name: '体育热闻',
    data: 12,
  },
  {
    name: '音频卡片',
    data: 33,
  },
  {
    name: '深度频道',
    data: 19,
  },
  {
    name: '沸点视频策略',
    data: 44,
  },
  {
    name: '深度频道',
    data: 99,
  },
  {
    name: '人群定投-明星时尚',
    data: 57,
  },
  {
    name: '人群定投-深度财经',
    data: 23,
  },
];

const Home: React.FC = () => {
  const handleNewerReload = useCallback(() => {
    console.log('newer reload');
  }, []);

  const handleRelateReload = useCallback(() => {
    console.log('related reload')
  }, []);


  return (
    <div className="home">
      <p className="home-title">概览</p>
      <div className="home-main">
        <div className="home-left">
          <Overview />
        </div>
        <div className="home-right">
          <Statistic cards={demoCards} summary={demoSummary} />
          <ChartLine<typeof CHART_CARD_DATE, typeof CHART_CARD_DATA, undefined>
            labelX={CHART_CARD_DATE}
            labelY={CHART_CARD_DATA}
            data={demoChartCard}
            title="每日新建卡片数量概览"
            icon="line-chart"
            operation={<Reload onReload={handleNewerReload} />}
          />
          <Divider />
          <ChartBar<typeof CHART_STRAT_NAME, typeof CHART_STRAT_DATA, undefined>
            labelX={CHART_STRAT_NAME}
            labelY={CHART_STRAT_DATA}
            data={demoChartStrat}
            title="近7天策略被关联数概览"
            icon="bar-chart"
            tip="截止到昨日"
            operation={<Reload onReload={handleRelateReload} />}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
