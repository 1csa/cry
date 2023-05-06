import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import moment from 'moment';

const MetaLine = (value:any) => {
  const [data, setData] = useState([]);
  useEffect(() => {
   value && ooo(value)
  }, [value])
  const ooo =(value:any)=>{
    setData(value.value)
  }
  const config = {
    data,
    xField: 'time',
    yField: 'data',
    seriesField: 'type',
    smooth:true,
    // xAxis:{
    //   label:{
    //     formatter:(v:any)=>{
    //       return  moment(v).format('YYYY-MM-DD:HH')     
    //       }
    //     }
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
  };

  return <Line {...config} />;
};

export default MetaLine