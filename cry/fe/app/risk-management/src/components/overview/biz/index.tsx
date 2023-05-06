import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import {
  Chart,
  Interval,
  Axis,
  Tooltip,
} from "bizcharts";

interface propsType {
  dataList: any[]
}

const Container: React.FC<propsType> = (props) => {
  const { dataList } = props
  const [name, setName] = useState<string>('');
  return (
    <div>
      <Chart height={400} data={dataList} autoFit>
				<Tooltip shared />
        <Axis
          name="p_day"
          label={{
            offset: 12
          }}
        />
        <Interval
          adjust={[{ type: 'stack' }]}
          position="p_day*value"
          color={"type"}
					style={{
						fillOpacity:0.75
					}}
          label={['value', { position: 'middle', offset: 0, style: { fill: '#fff' }, layout: { type: 'limit-in-shape' } }]}
        />
      </Chart>
    </div>
  );
};

export default Container;
