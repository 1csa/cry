import React, {memo} from 'react';
import { List, Card } from 'antd';
import { string } from 'prop-types';
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction
} from 'bizcharts';
interface ageProps {
  A_0_24: string;
  A_25_29: string;
  A_30_39: string;
  [propName: string]: any;
}

const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const Age = memo<ageProps>(props => {
  const {A_0_24, A_25_29, A_30_39} = props.ageInfo;
  const data = [
    {
      item: '0-24岁',
      percent: Number(A_0_24.toFixed(2)),
      // percent: Number(A_0_24*100).toFixed(2)+'%',
    },
    {
      item: '25-29岁',
      percent: Number(A_25_29.toFixed(2)),
      // percent: Number(A_25_29*100).toFixed(2)+'%',
    },
    {
      item: '30-39岁',
      percent: Number(A_30_39.toFixed(2)),
      // percent: Number(A_30_39*100).toFixed(2)+'%',
    },
    {
      item: '40岁以上',
      percent: 1-Number(A_0_24.toFixed(2))-Number(A_25_29.toFixed(2))-Number(A_30_39.toFixed(2)),
      // percent: ((1-Number(A_0_24+A_25_29+A_30_39))*100).toFixed(2)+'%',
    },
  ];
  // return  <List
  //   grid={{ gutter: 16, column: 4 }}
  //   dataSource={data}
  //   renderItem={item => (
  //     <List.Item>
  //       <Card title={item.title}>{item.percent}</Card>
  //     </List.Item>
  //   )}
  // />
  return  <Chart height={200} data={data} autoFit>
    <Coordinate type="polar" innerRadius={0.2} />
    <Tooltip showTitle={false} />
    <Axis visible={false} />
    <Interval
      position="item*percent"
      adjust="stack"
      color="item"
      element-highlight
      style={{
        lineWidth: 1,
        stroke: '#fff',
      }}
    />
    <Interaction type='element-single-selected' />
  </Chart>
}, areEqual);

export default Age
