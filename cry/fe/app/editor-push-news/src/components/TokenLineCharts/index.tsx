import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Radio, Typography } from 'antd';
import { Line } from '@ant-design/charts';
import { groupBy, get } from '@antv/util';
import './index.less';
import { LineData, LineDataObject, ListTYPE } from '@/config/charts/token';

type IProps = Readonly<{
  List: string[];
  onChange: (index: string | number) => void;
}>;

const ChannelRadio: React.FC<IProps> = React.memo(({ List, onChange }) => {
  const [tagList, setTagList] = useState<string>();
  console.log('[ tagList ]', tagList);
  const handleChange = (e: any) => {
    onChange(e.target.value);
    setTagList(e.target.value);
  };
  useEffect(() => {
    console.log('[ List ]', List);
    setTagList(List[0]);
  }, [List]);
  return (
    <div className="channel-list">
      <Radio.Group onChange={handleChange} value={tagList}>
        {List.map((item: string) => {
          return (
            <Radio.Button value={item} key={item}>
              {item}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
});

type ChartsProps = {
  title: string;
  lineConfig: {
    chartsData: LineData | LineDataObject;
    channelList?: string[];
  };
};
export const TokenLineCharts: React.FC<ChartsProps> = React.memo(({ lineConfig, title }) => {
  const [selectData, setSelectData] = useState<
    {
      date: string;
      channel: string;
      category: string;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    if (lineConfig.channelList !== undefined) {
      setSelectData(lineConfig.chartsData[lineConfig.channelList[0]]);
    } else {
      setSelectData(
        (lineConfig.chartsData as unknown) as {
          date: string;
          channel: string;
          category: string;
          value: number;
        }[],
      );
    }
    console.log('lineConfig', lineConfig);
  }, [lineConfig]);
  const channelChange = (e: string | number) => {
    setSelectData(lineConfig.chartsData[e]);
  };

  const COLOR_PLATE_10 = ['#5B8FF9', '#5AD8A6', '#E8684A', '#5D7092', '#F6BD16', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3'];
  const config = {
    data: selectData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    color: COLOR_PLATE_10,
    xAxis: {
      type: 'timeCat',
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
    point: {
      shape: 'circle',
    },
  };

  return (
    <Card className="line-card">
      <h3 className="charts-title">{title}</h3>
      {lineConfig.channelList && <ChannelRadio List={lineConfig.channelList} onChange={e => channelChange(e)} />}

      {JSON.stringify(lineConfig.chartsData) !== '{}' ? <Line {...config} /> : <div>暂无数据</div>}
    </Card>
  );
});
