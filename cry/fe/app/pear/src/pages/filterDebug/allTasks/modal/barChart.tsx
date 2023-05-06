import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';

const BarChart = ({ value }: any) => {
  const { filterDebugTaskDetails, topFilterRatio } = value;
  let data: any = [];
  {
    for (let key in topFilterRatio) {
      let obj = {
        type: key,
        value: topFilterRatio[key],
      };
      data.push({ ...obj });
    }
  }
  const brandColor = '#5B8FF9';
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: brandColor,
    meta: {
      type: {
        alias: '类别',
      },
      value: {
        alias: '过滤千分比',
      },
    },
    label: {
      content: (originData: any) => {
        const val = parseFloat(originData.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
      },
      offset: 10,
    },
    legend: false,
    // xAxis: {
    //   label: {
    //     autoHide: true,
    //     autoRotate: false,
    //   },
    // },
  };
  return <Column {...config} />;
};

export default BarChart;
