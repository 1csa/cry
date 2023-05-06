import React from 'react';
import { Chart, Line, Point } from 'bizcharts';

import { YIcon } from '@/components';
import { IconType } from '@/types/comp';
import './index.less';

interface ChartLineType<LX extends string, LY extends string, LG extends string | undefined> {
  title: string;
  icon?: IconType;
  tip?: string;
  operation?: React.ReactNode;

  data: Array<Record<LX, string> & Record<LY, number>>;
  labelX: LX;
  labelY: LY;
  legend?: LG; //  是否包含多选
  min?: number;
  max?: number;
}

// 这个目前只支持单条折线
class ChartLine<LX extends string, LY extends string, LG extends string | undefined> extends React.Component<
  ChartLineType<LX, LY, LG>
> {
  render() {
    const { title, icon, operation, labelX, labelY, legend, data, min, max } = this.props;
    const chartPosition = `${labelX}*${labelY}`;

    return (
      <div className="chartline">
        <div className="chartline-header">
          <div className="chartline-header-title">
            {icon && <YIcon type={icon} />}
            <span>{title}</span>
          </div>
          <div className="chartline-header-tip">{operation}</div>
        </div>
        <Chart
          autoFit={true}
          height={360}
          padding="auto"
          appendPadding={[20, 0, 0, 0]}
          data={data}
          scale={{ [labelX]: { min: min, max: max } }}
        >
          <Line position={chartPosition} shape="smooth" size={1} label={labelY} color={legend} />
          <Point position={chartPosition} />
        </Chart>
      </div>
    );
  }
}

export default ChartLine;
