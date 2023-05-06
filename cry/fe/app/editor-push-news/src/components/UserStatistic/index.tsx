import React, { useState, useEffect, ReactNode } from 'react'
import { Table, Radio, message, Divider } from 'antd'
import { Chart, Interval, Axis, Tooltip, Coordinate, Legend, Label } from 'bizcharts'
import DataSet from '@antv/data-set'
import { ColumnProps } from 'antd/es/table'
import { UserStatisticProps, PushStatisticProps, AppStatisticProps } from '@/config/analyse/analyse'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

interface IProps {
  pushStatistic: Array<PushStatisticProps>
  appStatistic: Array<AppStatisticProps>
  statistic: Array<UserStatisticProps>
  userid: string
  getAppAndPushStatistic: (userid: string, type: string) => Promise<any>
}

const dayMap = {
  seven_day: '近 7 天',
  one_month: '近 1 个月',
  three_month: '近 3 个月',
}

const columns: ColumnProps<UserStatisticProps>[] = [{
  title: '时间范围',
  dataIndex: 'day',
  key: 'day',
  align: 'center',
  render: (text: string) => {
    return <span>{ dayMap[text] }</span>
  }
}, {
  title: '客户端',
  children: [{
    title: '曝光文章数',
    dataIndex: 'client_review_cnt',
    key: 'client_review_cnt',
    align: 'center'
  }, {
    title: '点击文章数',
    dataIndex: 'client_click_cnt',
    key: 'client_click_cnt',
    align: 'center'
  }, {
    title: '点击率',
    dataIndex: 'client_ctr',
    key: 'client_ctr',
    align: 'center'
  }]
}, {
  title: 'push 侧',
  children: [{
    title: 'push 文章数',
    dataIndex: 'push_arrive_cnt',
    key: 'push_arrive_cnt',
    align: 'center'
  }, {
    title: '点击文章数',
    dataIndex: 'push_click_cnt',
    key: 'push_click_cnt',
    align: 'center'
  }, {
    title: '点击率',
    dataIndex: 'push_ctr',
    key: 'push_ctr',
    align: 'center'
  }]
}]

const UserStatistic: React.FC<IProps> = ({ pushStatistic, appStatistic, statistic, userid, getAppAndPushStatistic }) => {
  // type
  const [type, setType] = useState<string>('SEVEN_DAY')

  // useEffect(() => {
  //   async function getAppAndPushStatisticFn () {
  //     const { status, data } = await getAppAndPushStatistic(userid, type)

  //     if (status === 'success') {
  //       appStatistic = data.map((item: any) => {
  //         return { cat: item.cat, client: item.client }
  //       })
  //       pushStatistic = data.map((item: any) => {
  //         return { cat: item.cat, push: item.push }
  //       })
  //     } else {
  //       message.error('获取点击比例数据失败!')
  //     }

  //   }

  //   getAppAndPushStatisticFn()
  // }, [type])

  // render chart
  const renderChart = (data1: Array<PushStatisticProps>, data2: Array<AppStatisticProps>): ReactNode => {
    if (!data1.length) {
      return 
    }
    if (!data2.length) {
      return 
    }
    const ds = new DataSet()
    const dv1 = ds.createView().source(data1)
    const dv2 = ds.createView().source(data2)

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div>
          <h4 style={{ textAlign: 'center' }}>push 文章点击比例</h4>
          <Chart
            height={ data1.length * 30 }
            width={ window.innerWidth >= 1920 ? 600 : 480 }
            padding={[0, 20, 20, 70]}
            data={ dv1.rows }
            autoFit
          >
            <Legend position="bottom" />
            <Coordinate transpose reflect="x" />
            <Axis name="cat" visible={ false } />
            <Tooltip />
            <Interval 
              position="cat*push" 
              label={["push", { offsetX: -50 }]} 
              color="#3fc5b2" 
            />
          </Chart>
        </div>
        <div>
          <h4 style={{ textAlign: 'center' }}>主端文章点击比例</h4>
          <Chart
            height={ data2.length * 30 }
            width={ window.innerWidth >= 1920 ? 600 : 480 }
            padding={[0, 50, 20, 50]}
            data={ dv2.rows }
            autoFit
          >
            <Legend />
            <Coordinate transpose />
            <Tooltip />
            <Interval 
              position="cat*client" 
              label="client" 
              color="#f66f6c" 
            />
          </Chart>
        </div>
      </div>
    )
  }

  return (
    <>
      <Table
        columns={ columns }
        dataSource={ statistic }
        rowKey={ (render: UserStatisticProps ) => render.day }
        size="small"
        pagination={ false }
        bordered
      />
      {/* <RadioGroup 
        defaultValue={ type } 
        buttonStyle="solid" 
        style={{ margin: '25px 0' }}
        onChange={ (e) => setType(e.target.value) }
      >
        <RadioButton value="SEVEN_DAY">近 7 天</RadioButton>
        <RadioButton value="ONE_MONTH">近 1 个月</RadioButton>
        <RadioButton value="THREE_MONTH">近 3 个月</RadioButton>
      </RadioGroup> */}
      {
        (pushStatistic.length > 0 || appStatistic.length > 0) &&
        <>
          <Divider orientation="left">兴趣匹配情况</Divider>
          { renderChart(pushStatistic, appStatistic) }
        </>
      }
    </>
  )
}

export default UserStatistic