/**
 * 处理数据
 */
export function handleLineData (data: Array<any>, dataDefault: Array<any>, num: Number){
  if (data.hourDatas) {
    data.hourDatas.map(item => {
      dataDefault[num].dataArr.unshift(item.userCount)
      dataDefault[num].bDataArr.unshift(`${item.day} ${item.hour}时数据`)
    })
  }
  if (data.totalData) {
    dataDefault[num].totalData = num === 3 ? ((data.totalData.userCount*100).toFixed(2))+'%':data.totalData.userCount
  }
  if (data.grewData) {
    dataDefault[num].grewData = data.grewData.userCount
  }
  return dataDefault
}

export function handleBarData (data: Array<any>, dataDefault: Array<any>, num: Number){
  data.map(item => {
    dataDefault[num].dataArr.unshift({
      name: item.enName,
      value: item.userCount,
      cnName: item.cnName ? item.cnName : item.enName
    })
    dataDefault[num].bDataArr.unshift(item.enName)
  })
  return dataDefault
}

export function handleMapData (data: Array<any>){
  let exportData =[]
  data.map(item => {
    if (provices.includes(item.cnName)) {
      const { cnName, allUserCount, errorUserCount, warnUserCount } = item
      exportData.push({
        name: cnName,
        value: allUserCount ? allUserCount:Number(errorUserCount+warnUserCount),...item
      })
    }
  })
  return exportData
}

export function handleLastTime(data: Array<any>) {
  let newArr = [], maxTime = '',maxYear = null, maxMonth = null, maxDay = null, maxHour = null
  data.map(item => {
    const newDay = item.day.split('-').join('')
    newArr.push(newDay+item.hour)
  })
  maxTime = Math.max(...newArr)
  maxYear = maxTime.toString().substring(0,4)
  maxMonth = maxTime.toString().substring(4,6)
  maxDay = maxTime.toString().substring(6,8)
  maxHour = maxTime.toString().substring(8,10)
  return `24小时数据，截止${maxYear}年${maxMonth}月${maxDay}日${maxHour}点` 
}

/**
 * 处理配置
 */
export function handleLineOption(data) {
  const {name, color, colorStart, colorStop, dataArr, bDataArr} = data;
  return {
    title: {
      text: name,
      y: 'bottom',
      x:'left',
      textStyle:{
        fontSize: 13,
      },
      padding: [0,0,35,25],
    },
    tooltip : {
      trigger: 'item',
      position: 'top',
      padding: [5,10,5,10],
    },
    xAxis: {
      type: 'category',
      data: bDataArr,
      boundaryGap: false,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    series: [{
      data: dataArr,
      type: 'line',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: colorStart, // 0% 处的颜色
          }, {
            offset: 1, color: colorStop, // 100% 处的颜色
          }],
        }
      },
      lineStyle:{
        color: color,
      },
      itemStyle: {
        color: color,
      },
      smooth: true,
    }]
  }
}

export function handleBarOption(data) {
  const {color, bDataArr, dataArr} = data;
  return {
    color: color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      padding: [5,10,5,10],
      formatter: function(params) {
        return params[0].data.cnName + ': ' + params[0].data.value;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'category',
        data: bDataArr,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    xAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        data: dataArr,
      }
    ]
  }
}
const provices = [
  '澳门',
  '台湾',
  '河北',
  '山西',
  '内蒙古',
  '辽宁',
  '吉林',
  '黑龙江',
  '江苏',
  '浙江',
  '安徽',
  '福建',
  '江西',
  '山东',
  '河南',
  '湖北',
  '湖南',
  '广东',
  '广西',
  '海南',
  '四川',
  '贵州',
  '云南',
  '西藏',
  '陕西',
  '甘肃',
  '青海',
  '宁夏',
  '新疆',
  '北京',
  '天津',
  '上海',
  '重庆',
  '香港',
  '南海诸岛',
]
export function handleMapOption(data) {
  let valueArr = [], minValue = 0, maxValue = 0;
  data.map(item => valueArr.push(item.value))
  minValue = valueArr.length > 0 ? Math.min(...valueArr) : 0
  maxValue = Math.max(...valueArr,0)
  return {
    tooltip: {
      trigger: 'item',
      textStyle: {
        lineHeight: 20,
      },
      padding: [10, 30, 5, 10],
      formatter: function(params) {
        console.log(params.data)
        return (
          `<div>
            <p>${params.data.name}</p>
            <ul>
              <li>异常：${params.data.errorUserCount}</li>
              <li>疑似：${params.data.warnUserCount}</li>
              <li>合计：${params.data.value}</li>
            </ul>

          </div>`
        );
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: {readOnly: true},
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      padding: [0,0,50,40],
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered']
      }
    },
    series: [
      {
        name: '区域数据',
        type: 'map',
        mapType: 'china', // 自定义扩展图表类型
        label: {
            show: true
        },
        data: data,
      }
    ]
  }
}
