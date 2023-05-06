import React, { FC, useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import { handleLineData, handleLastTime, handleBarData, handleMapData, handleLineOption, handleBarOption, handleMapOption } from '@/utils/handle_chart';

var echarts = require('echarts');
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/map');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/map/js/china'); // echarts5无法用地图，所以必须用5以下的版本

const DataTodayPage: FC = () => {
  const [lastTime, setLastTime] = useState<string>('')
  const [linedata, setLinedata] = useState<Array<any>>([
    {
      name: '今日识别用户',
      color: '#51D1EE',
      colorStart: '#A7E6F5',
      colorStop: '#F8FDFF',
      dataArr: [],
      bDataArr: [],
      totalData: 0,
      grewData: 0,
    },
    {
      name: '异常人数',
      color: '#FF7165',
      colorStart: '#FF958A',
      colorStop: '#FFFBFB',
      dataArr: [],
      bDataArr: [],
      totalData: 0,
      grewData: 0,
    },
    {
      name: '疑似人数',
      color: '#FFC985',
      colorStart: '#FFE0BC',
      colorStop: '#FFFEFD',
      dataArr: [],
      bDataArr: [],
      totalData: 0,
      grewData: 0,
    },
    {
      name: '异常占比',
      color: '#96E2AA',
      colorStart: '#C2EECE',
      colorStop: '#F8FEF9',
      dataArr: [],
      bDataArr: [],
      totalData: 0,
      grewData: 0,
    },
  ]);
  const [bardata, setBardata] = useState<Array<any>>([
    {
      color: ['#5596F5'],
      dataArr: [],
      bDataArr: [],
    },
    {
      color: ['#5596F5'],
      dataArr: [],
      bDataArr: [],
    },
  ]);
  const [mapdata, setMapdata] = useState<Array<any>>([]);
  useEffect(() => {
    renderLineChart();
    renderBarChart();
    renderMapChart();
    initData()
  }, [])

  const initData = async () => {
    // const res = await axios.get('http://10.136.130.25:7752/ugp/control/finds?keys=channel_name&keys=channel_name_distribution_channel&keys=user_active_app_id&keys=user_active_type')
    const res = await axios({
      method: "get",
      url: 'http://10.136.130.25:7752/ugp/control/finds?keys=channel_category&keys=channel_category_distribution_channel&keys=channel_name_distribution_channel',
      // url: 'http://127.0.0.1:7753/ugp/control/finds?keys=channel_name&keys=channel_name_distribution_channel&keys=user_active_app_id&keys=user_active_type',
    })
    console.log(res)
  }

  const getChartData = async (num,name) =>{
    const url = `/api/proxy/${appConfig.API_HOST}/statistic/${name}`
    const response = await axios.post(url,{type: num})
    return await response
  }
  const renderLineChart = async () => {
    // 循环并行
    const promises = linedata.map((item,index) => getChartData(index+1,'record'))
    for (var i=0;i<promises.length;i++) {
      const column = await promises[i]
      if (column.data.status === 200) {
        const newData = handleLineData(column.data.data,linedata,i)
        if (i===0) {
          const newLastTime = handleLastTime(column.data.data.hourDatas)
          setLastTime(newLastTime)
        }
        setLinedata(newData)
        const option = handleLineOption(newData[i])
        var myChart = echarts.init(document.getElementById(`chart${i+1}`), 'light');
        myChart.setOption(option);
      }
    }
  }

  const renderBarChart = async () => {
    // 循环并行
    const promises = bardata.map((item,index) => getChartData(index+1,'byNameRecord'))
    for (var i=0;i<promises.length;i++) {
      const column = await promises[i]
      if (column.data.status === 200) {
        const newData = handleBarData(column.data.data,bardata,i)
        setBardata(newData)
        const option = handleBarOption(newData[i])
        var myChart = echarts.init(document.getElementById(`chart${i+5}`), 'light');
        myChart.setOption(option);
      }
    }
  }
  
  const renderMapChart = async () => {
    const res = await getChartData(3,'byNameRecord')
    if (res.data.status === 200) {
      const newData = handleMapData(res.data.data)
      setMapdata(newData)
      const option = handleMapOption(newData)
      var myChart = echarts.init(document.getElementById('chart7'), 'light');
      myChart.setOption(option);
    }
  }
  
  return (
    <> 
      <div className="main-content">
      {/* <iframe style={{width: '100%', height: '600px'}} src="http://localhost:8000/chartList" /> */}
        <PageHeader current="今日概览" home="数据中心"/>
        <Card bordered={false} style={{ minHeight: 380 , marginTop: '-25px'}}>
          <h3 style={{fontSize: '18px',paddingLeft:'20px',paddingRight:'10px',lineHeight:'25px'}}>基本概览 <span style={{fontSize:'13px'}}>每1个小时更新</span>{lastTime?<span style={{float:'right',fontSize:'13px'}}>{lastTime}</span>:''}</h3>
          {linedata && linedata.map((item,index) => {
            return(
              <div style={{width: '25%',display:'inline-block'}} key={'chart'+(index+1)}>
                <div id={'chart'+(index+1)} style={{height: '200px',width: '100%', marginTop: '-45px', marginBottom: '-20px'}}>&nbsp;</div>
                <div style={{padding: '0 28px'}}>
                  <h3 style={{float: 'left',color: item.color,fontSize: '24px',lineHeight: '25px'}}>{item.totalData === 0 ? '--':item.totalData}</h3>
                  <span style={{float: 'right',fontSize: '13px',lineHeight: '25px'}}>较昨日{item.grewData === 0 ? '--':(item.grewData*100).toFixed(0)+'%'}</span>
                </div>
              </div>
            )}
          )}
          <div style={{width: '50%',display:'inline-block',marginTop: '40px'}}>
            <h3 style={{fontSize: '18px',paddingLeft:'20px',paddingRight:'10px',lineHeight:'25px'}}>TOP10策略排名<span style={{float:'right',fontSize:'13px'}}>昨日数据</span></h3>
            <div id="chart5" style={{height: '400px',width: '100%', marginTop: '-45px', marginBottom: '-30px'}}>&nbsp;</div>
          </div>
          <div style={{width: '50%',display:'inline-block',marginTop: '40px'}}>
            <h3 style={{fontSize: '18px',paddingLeft:'20px',paddingRight:'10px',lineHeight:'25px'}}>TOP10异常设备<span style={{float:'right',fontSize:'13px'}}>近7日数据</span></h3>
            <div id="chart6" style={{height: '400px',width: '100%', marginTop: '-45px', marginBottom: '-30px'}}>&nbsp;</div>
          </div>
          <div style={{width: '100%',display:'inline-block',marginTop: '80px'}}>
            <h3 style={{fontSize: '18px',paddingLeft:'20px',paddingRight:'10px',lineHeight:'25px'}}>地域数据<span style={{float:'right',fontSize:'13px'}}>近30日数据</span></h3>
            <div id="chart7" style={{height: '600px',width: '100%', marginTop: '-45px', marginBottom: '-30px'}}>&nbsp;</div>
          </div>
        </Card>
      </div>
    </>
  );
}
export default DataTodayPage;
