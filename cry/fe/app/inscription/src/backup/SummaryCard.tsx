import React from 'react';
import { Card } from 'antd';
import {} from '@/config/home.config';
import { ActionTypes } from '@/config/card.config';

interface SummaryItem {
  key?: keyof typeof ActionTypes;
  title?: string; // 备选
  total: number;
  minus?: number;
}
const SummaryItem: React.FC<SummaryItem> = React.memo(({ key, total, title, minus }) => {
  const label = ActionTypes.find(item => item.value === key)?.label;
  return (
    <Card className="summary-item">
      <div>
        {key ? (
          <>
            <p>今日新建</p>
            <p>{label}跳转卡片数</p>
          </>
        ) : (
          title
        )}
      </div>
      <div>{total}</div>
      {minus !== undefined ? (
        <div>
          <span>较昨日</span>
          <span className={minus > 0 ? 'positive' : 'negative'}>{minus}</span>
        </div>
      ) : null}
    </Card>
  );
});

interface SummaryCard {
  summarys: SummaryItem[];
}

const SummaryCard: React.FC<SummaryCard> = ({ summarys }) => {
  return (
    <>
      <div>
        <h4>卡片统计</h4>
        <p>每30分钟更新</p>
      </div>
      <div>
        {summarys.map(summaryItem => (
          <SummaryItem {...summaryItem} />
        ))}
      </div>
    </>
  );
};

export default React.memo(SummaryCard);
