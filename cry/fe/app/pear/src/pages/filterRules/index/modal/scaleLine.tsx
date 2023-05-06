import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import moment from 'moment';

const ScaleLine = (values:any) => {
   const [data, setData] = useState<any>(values.values)
    useEffect(() => {
     console.log(values,'====>values');
     ooo(values)
   }, [values.values.length])
  const ooo = (values:any)=>{
    let datas = values.values
    setData(datas)
  }
  const config = {
    data,
    xField: 'time',
    yField: 'data',
    seriesField: 'type',
    smooth:true,
    // xAxis:{
    // label:{
    //   formatter:(v:any)=>{
    //     return  v 
    //     }
    //   }
    // },
    point: {//显示数据点以及显示形状
      visible: true,
      size: 2,
      shape: 'circular',
    },
    yAxis: {
      title: {
        text: '(千分比)',
        style: {
          fontSize: 16,
        },
      },
    }
  }

  return <Line {...config} />;
};

export default ScaleLine
