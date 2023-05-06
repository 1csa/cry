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
  female: number;
  male: number;
  [propName: string]: any;
}

const areEqual = (prevProps:any, nextProps:any) => {
	return prevProps === nextProps
}
const Gender = memo<ageProps>(props => {
  const {male, female} = props.genderInfo;
  const data = [
    {
      title: '男',
      percent: male,
      // percent: Number(male*100).toFixed(2)+'%',
    },
    {
      title: '女',
      percent: female,
      // percent: Number(female*100).toFixed(2)+'%',
    },
  ];
  // return  <List
  //   grid={{ gutter: 16, column: 2 }}
  //   dataSource={data}
  //   renderItem={item => (
  //     <List.Item>
  //       <Card title={item.title}>{item.percent}</Card>
  //     </List.Item>
  //   )}
  // />
  return  <Chart height={200} data={data} autoFit>
    <Coordinate type="theta" radius={0.75} />
    <Tooltip showTitle={false} />
    <Axis visible={false} />
    <Interval
      position="percent"
      adjust="stack"
      color="title"
      style={{
        lineWidth: 1,
        stroke: '#fff',
      }}
      label={['percent', {
        content: (data) => {
          return `${data.title}: ${data.percent * 100}%`;
        },
      }]}
    />
    <Interaction type='element-single-selected' />
  </Chart>
}, areEqual);

export default Gender
