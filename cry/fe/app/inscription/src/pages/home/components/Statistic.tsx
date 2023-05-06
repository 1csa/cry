/**
 * 顶部的数据卡片, 数据自取
 */

import React, { useCallback } from 'react';
import { Card, Row, Col } from 'antd';

import { StatItemMap, StatSummaryMap } from '@/config/home.config';
import { StatisticItem } from '@/types/other';
import { Reload } from '@/pages/home/components';

const CardItem: React.FC<StatisticItem> = React.memo(({ name, count, minus }) => {
  return (
    <Card className="statistic-content-card card" bodyStyle={{ padding: '12px 8px' }}>
      <p className="card-title">
        <span>今日新建</span>
        <span>{StatItemMap[name]}卡片</span>
      </p>
      <p className="card-count">{count}</p>
      <p className="card-minus">
        较昨日
        {minus === undefined ? (
          '--'
        ) : minus > 0 ? (
          <span className="positive">{`+${minus}`}</span>
        ) : (
          <span className="negative">{minus}</span>
        )}
      </p>
    </Card>
  );
});

const SummaryItem: React.FC<StatisticItem> = React.memo(({ name, count, minus }) => {
  return (
    <Card className="statistic-content-card summary" bodyStyle={{ padding: '12px 8px' }}>
      <p className="summary-title">{StatSummaryMap[name]}</p>
      <p className="summary-count">{count}</p>
      <p className="summary-minus">
        较昨日
        {minus === undefined ? (
          '--'
        ) : minus > 0 ? (
          <span className="positive">{`+${minus}`}</span>
        ) : (
          <span className="negative">{minus}</span>
        )}
      </p>
    </Card>
  );
});

interface Statistic {
  cards: StatisticItem[];
  summary: StatisticItem[];
}

const Statistic: React.FC<Statistic> = ({ cards, summary }) => {
  const handleReload = useCallback(() => {
    console.log('statistic reload');
  }, []);

  return (
    <Card type="inner" className="statistic" bodyStyle={{ padding: '16px 12px' }}>
      <section className="statistic-header">
        <span>卡片统计</span>
        <Reload onReload={handleReload} />
      </section>
      <section className="statistic-content">
        <Row align="bottom" gutter={{ xs: 6, md: 12 }} justify="space-between">
          {cards.map(cardItem => (
            <Col key={cardItem.name} span={6}>
              <CardItem {...cardItem} />
            </Col>
          ))}
        </Row>
        <Row align="bottom" gutter={{ xs: 6, md: 12 }} justify="start">
          {summary.map(sumItem => (
            <Col key={sumItem.name} span={6}>
              <SummaryItem {...sumItem} />
            </Col>
          ))}
        </Row>
      </section>
    </Card>
  );
};

export default React.memo(Statistic);
