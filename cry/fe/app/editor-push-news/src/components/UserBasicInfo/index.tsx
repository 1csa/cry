import React, { ReactNode } from 'react'
import { Descriptions, Icon, Tooltip } from 'antd'
import { UserBasicInfoProps } from '@/config/analyse/analyse'

const DescriptionsItem = Descriptions.Item

const lableIconStyle = {
  verticalAlign: 'middle',
  marginLeft: 2,
  marginTop: -2,
  color: '#1d92ff'
}

interface IProps {
  userBasicInfo: UserBasicInfoProps
}

const UserBasicInfo: React.FC<IProps> = ({ userBasicInfo }) => {
  // render 
  const renderFunc = (data: {[key: string]: number} | undefined): ReactNode => {
    return data && Object.entries(data).map(item => {
      const [key, value] = item
      return <span key={ key }>{ key }: { value }  </span> 
    })
  }

  return (
    <Descriptions title="" bordered column={ 4 }>
      <DescriptionsItem label="城市">{ userBasicInfo.geoCity || '-' }</DescriptionsItem>
      <DescriptionsItem label={
        <>
          性别
          <Tooltip title="> 0.65时具有可信度">
            <Icon
              type="question-circle"
              style={ lableIconStyle }
            />
          </Tooltip>
        </>
      }>
        { renderFunc(userBasicInfo.ens_gender) || '-' }
      </DescriptionsItem>
      <DescriptionsItem label={
        <>
          年龄
          <Tooltip title="> 0.5时具有可信度">
            <Icon
              type="question-circle"
              style={ lableIconStyle }
            />
          </Tooltip>
        </>
        } span={ 2 }
      >
        { renderFunc(userBasicInfo.ens_age) || '-' }
      </DescriptionsItem>
      <DescriptionsItem label="设备信息">{ userBasicInfo.deviceName || '-' }</DescriptionsItem>
      <DescriptionsItem label="操作系统">{ userBasicInfo.os || '-' }</DescriptionsItem>
      <DescriptionsItem label="APPID">{ userBasicInfo.appid || '-' }</DescriptionsItem>
      <DescriptionsItem label="版本">{ userBasicInfo.version || '-' }</DescriptionsItem>
      <DescriptionsItem label="注册时间">{ userBasicInfo.createDate || '-' }</DescriptionsItem>
      <DescriptionsItem label="最近一次活跃时间">{ userBasicInfo.lastUpdateDate || '-' }</DescriptionsItem>
      <DescriptionsItem label="最近30天活跃天数">{ userBasicInfo.active_user_thirty_dyd === -1 ? '-' : userBasicInfo.active_user_thirty_dyd }</DescriptionsItem>
    </Descriptions>
  )
}

export default UserBasicInfo