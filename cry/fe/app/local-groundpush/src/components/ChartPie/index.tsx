import React, { memo, useCallback } from 'react';
import { Empty } from 'antd';
import echarts, { EChartOption } from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';

import { PieDataType } from '@/config/app.d';
import './index.less';

interface ChartPieProps {
  title?: string;
  dataSource?: PieDataType[],
}

const ChartPie: React.FC<ChartPieProps> =({title, dataSource=[]})=>{
  const genLegends = useCallback((): EChartOption.Legend=>{
    let legendData = dataSource.map(dataItem=>dataItem.name)

    return {
      type: 'scroll', orient: 'vertical', selectedMode: false, left: 50, top: 30, bottom: 30, data: legendData
    }
  }, [dataSource]);

  const getOptions =useCallback((): EChartOption=>{
    let options: EChartOption = {};

    if (dataSource.length !== 0 ) {
      options.toolbox = {
        show: true, orient: 'vertical', itemSize: 24, right: 50,
        feature: {
            saveAsImage: {
              show: true, title: '保存为png', name: title
          }
        }
      };
      options.tooltip = { trigger: 'item', formatter: "{b} : {c} ({d}%)" };
      options.legend = genLegends();
      options.series = [{
        type: 'pie', radius: 100, center: ['50%', '50%'], data: dataSource, itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }]
    }

    return options;
  }, [dataSource, title]);

  return (
    <div className='chartpie'>
      { title && <h4>{title}</h4> }
      {
        dataSource && dataSource.length > 0 ? <ReactEchartsCore
          echarts={echarts}
          option={ getOptions() }
          notMerge={true}
          lazyUpdate={true}
          theme={'shine'}
          opts={{}}
        /> : <Empty description="当前暂无数据"/>
      }
    </div>
  )
}

export default memo(ChartPie);
