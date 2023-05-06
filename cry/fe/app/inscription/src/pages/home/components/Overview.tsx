/**
 * 今日数据看板,完整的模块，包括数据请求和数据
 * Q：策略作为一个更新频率有限的项，有没有必要看板列出来，且和常更新项卡片和投放放一起
 * A：可以有必要，表示当前是否有新增策略用于参考，虽然这个值可能长期处于一个
 */

import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { Button, Divider } from 'antd';

import { Reload } from '@/pages/home/components';
import { HomeCurrentItem } from '@/types/other';

interface Overview {}

const demoCurrentData: Array<HomeCurrentItem> = [
  {
    name: 'card',
    title: '今日新建卡片数',
    count: 32,
    minus: -11,
  },
  {
    name: 'strategy',
    title: '今日新建策略数',
    count: 4,
    minus: 2,
  },
  {
    name: 'launch',
    title: '今日新增投放数',
    count: 17,
    minus: 2,
  },
];

const CardItem: React.FC<HomeCurrentItem> = React.memo(({ name, title, count, minus }) => {
  const history = useHistory();

  return (
    <div className="dataitem">
      <div className="dataitem-title">{title}</div>
      <div className="dataitem-content">
        <div className="dataitem-content-count">
          <p>{count}</p>
          <p>较昨日{minus > 0 ? `+${minus}` : minus}</p>
        </div>
        <Button ghost={true} size="small" onClick={() => history.push(`/${name}`)}>
          去新建
        </Button>
      </div>
    </div>
  );
});

const Overview: React.FC<Overview> = ({}) => {
  const handleOverviewReload = useCallback(() => {
    console.log('reload overview');
  }, []);

  return (
    <div className="overview">
      <section className="overview-title">
        <span>当前数据</span>
        <Reload onReload={handleOverviewReload} />
      </section>
      <section className="overview-data">
        {demoCurrentData.map((dataItem, index) => {
          const { name, title, count, minus } = dataItem;
          return (
            <React.Fragment key={dataItem.name}>
              <CardItem name={name} title={title} count={count} minus={minus} />
              {index !== demoCurrentData.length - 1 && <Divider className="overview-divider" />}
            </React.Fragment>
          );
        })}
      </section>
    </div>
  );
};

export default React.memo(Overview);
