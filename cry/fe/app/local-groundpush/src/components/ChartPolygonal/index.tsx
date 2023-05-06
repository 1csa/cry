import React, { useCallback, useRef } from 'react';
import { message, Empty } from 'antd';
import echarts, { EChartOption } from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { optsMap, EventMap } from 'echarts-for-react/lib';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/dataZoom';

import { PolygonalDataType, BasicDataType } from '@/config/app.d';

/**
 * @param T: 规定传到的数据类型,其中必定有timeKey？
 */
interface ListChartsProp<T> {
  dataSource?: PolygonalDataType<T>;
  indicators?: string | string[];
  target?: string; //target为undefined时展示所有数据的变化，target为string表示只展示这一项数据
  legendSelect?: string[]; //设置默认展示图例数据
  chartOption?: optsMap;
  eventsHandler?: EventMap;
  xAxis?: string[];
  title?: string
}

export const ChartPolygonal= <T extends BasicDataType>({
  dataSource, indicators='', target, legendSelect, chartOption={}, eventsHandler={}, xAxis, title
}: ListChartsProp<T>): React.ReactElement<T>=>{
  // 这个React echarts的type声明有问题，所以以ReactEcharts的形式获取到的ref么的getEchartsInstance方法，所以强行改成any
  const echartsInstance = useRef<any>();

  const genLegend = useCallback((dayLists: PolygonalDataType<T>): EChartOption.Legend=>{
    let legendData: string[] = [], chartLegend: EChartOption.Legend;
    let indicatorArr = typeof indicators === 'string' ? [indicators] : indicators;

    legendData = typeof target === 'string' ? indicatorArr : Object.keys(dayLists);
    chartLegend = { type: 'scroll', data: legendData };

    if (legendSelect) {
        let SelectedArr = legendData.map(
            legendItem => legendSelect.includes(legendItem) ? [legendItem, true]: [legendItem, false]
        );
        chartLegend.selected = Object.fromEntries(SelectedArr);
    }
    return chartLegend;
  }, [indicators, target, legendSelect]);

  const genXAxisData = useCallback((dayLists: PolygonalDataType<T>): string[]=>{
    if( xAxis ) {
      return xAxis;
    }
    let alltimes = Object.values(dayLists).map(listItem=>listItem.map(dataItem=>dataItem.timeKey))
    let xAxisArr = Array.from(new Set(alltimes.flat(1))).sort();

    return xAxisArr;
  }, []);

  const genYAxis = useCallback(()=>{
    let yAxis: EChartOption.YAxis | EChartOption.YAxis[];

    if (typeof indicators === 'string') {
        yAxis = { type: 'value' };
    } else {
        yAxis = indicators.map((indicatorItem, index)=>(
            index === 0 ? {
                name: indicatorItem, nameGap: 45, type: 'value', position: 'left', } : {
                name: indicatorItem, nameGap: 45, type: 'value', position: 'right', offset: 50*(index-1)
            }
        ));
    }
    return yAxis;
  }, [indicators]);

  const genSeriesData = useCallback(( originData: PolygonalDataType<T>): EChartOption.Series[]=>{
    if (indicators.length === 0 ){
      console.log('图表指标为空');
      return [];
    }

    let seriesData: EChartOption.Series[] = [];

    if ( typeof indicators === 'string' ) {
      seriesData = Object.entries(originData).map(([key, data])=>({
          name: key,
          type: 'line',
          data: data.map(
              dataItem=>[dataItem['timeKey'], dataItem[indicators as keyof T]]
          )
      }));
    } else {
      let valOfOriginData = Object.values(originData)[0];
      seriesData = indicators.map((indicatorItem, index)=>({
        name: indicatorItem, type: 'bar', yAxisIndex: index,
        data: valOfOriginData.map(dataItem=>[dataItem['timeKey'], dataItem[indicatorItem as keyof PolygonalDataType<T>]])
      }));
    }
    return seriesData;
  }, [indicators]);

   const getChartOption = useCallback((): EChartOption=>{
    if ( !indicators || !dataSource ) {
      return {};
    }

    let options: EChartOption = {}, xAxisData: string[] = [], targetData: PolygonalDataType<T> = dataSource;

    try {
      if( target && target.length !==0 ) {
        let targetDataEntries = Object.entries(dataSource).filter(([key, val])=>key === target)
        targetData = Object.fromEntries(targetDataEntries);
      }

      xAxisData = genXAxisData(targetData);

      options.tooltip = { trigger: "axis", axisPointer: { type: "cross", label: { show: true } } };
      options.toolbox = {
          show: true, orient: 'vertical', itemSize: 16, right: 20,
          feature: {
              mark: {show: true},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {},
              saveAsImage: { show: true, name: title}
          }
      };
      options.dataZoom =[{
          type: 'inside', xAxisIndex: 0, minSpan: 5,
      }, {
          type: 'slider', xAxisIndex: 0, minSpan: 5,
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      }];
      options.legend = genLegend(targetData);
      options.xAxis = { type: 'category' as const, boundaryGap: true, data: xAxisData };
      options.yAxis = genYAxis();
      options.series = genSeriesData(targetData);
    } catch (err) {
      message.error(JSON.stringify(err));
    } finally {
      return options;
    }
  }, [indicators, dataSource, target, title])

  // 返回下载链接的base64 url
  const handleClick = useCallback(()=>{
    let instances = echartsInstance.current && echartsInstance.current.getEchartsInstance();
    let imageSrc = instances && instances.getDataURL({type: 'png', pixelRatio: 2, backgroundColor: '#FFF'});
    return imageSrc
  }, []);

  return <div>{
    dataSource && Object.keys(dataSource).length > 0 ? <ReactEchartsCore
      ref={echartsInstance}
      echarts={echarts}
      option={ getChartOption() }
      notMerge={true}
      lazyUpdate={true}
      theme={'shine'}
      opts={chartOption || {}}
      onEvents={eventsHandler}
    /> : <Empty description="当前暂无数据"/>
  }</div>;
};
