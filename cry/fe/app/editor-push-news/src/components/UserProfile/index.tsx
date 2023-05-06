import React, { ReactNode } from 'react'
import { Chart, Coordinate, Axis, Tooltip, Interval } from 'bizcharts'
import DataSet from '@antv/data-set'
import { UserProfileProps, UserProfileItem } from '@/config/analyse/analyse'
import { userprofileMap } from '@/data'

interface IProps {
  profile: UserProfileProps
}

const UserProfile: React.FC<IProps> = ({ profile }) => {
  // 遍历 profile 找到 value 最大的长度 动态去改变 chart-list 的高度
  let maxChartLength = Object.values(profile).reduce((prev: number, cur: Array<UserProfileItem>) => {
    return cur.length > prev ? cur.length : prev
  }, 0)

  let style = {
    height: maxChartLength > 30 ? '600px' : 'auto'
  }

  const renderChartList = (): ReactNode => {
    return (
      <div className="chart-list" style={ style }>
        {
          Object.entries(profile).map(item => {
            const [title, d] = item
            return (
              <div className="chart-list-item" key={ title }>
                <h3>{ title }（{ userprofileMap[title] }）</h3>
                { renderChart(d) }
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderChart = (data: any): ReactNode => {
    const ds = new DataSet()
    const dv = ds.createView().source(data)
    dv.source(data).transform({
      type: 'sort',
      callback: (a, b) => a.mean - b.mean
    })

    return (
      <Chart
        data={ dv }
        height={ data.length * 20 }
        width={ window.innerWidth >= 1920 ? 320 : 325 }
        padding={[0, 50, 0, 100]} /* 这个表示的是 真正的图表距离 Chart 的距离 */
        autoFit
      >
        <Coordinate transpose />
        <Axis name="name" />
        <Axis name="mean" visible={ false } />
        <Tooltip />
        <Interval position="name*mean" label="mean" size={ 10 } />
      </Chart>
    )
  }
  
  return (
    <>
      { renderChartList() }
    </>
  )
}

export default UserProfile