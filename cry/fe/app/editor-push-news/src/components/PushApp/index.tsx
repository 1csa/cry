import React, { useEffect, ReactNode } from 'react'
import { Form, Input, Select } from 'formik-antd'
import { PushFormProps } from '@/config/pushForm/push'
import * as Data from '@/data'

import 'antd/dist/antd.css'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { sm: { span: 4 }},
  wrapperCol: { sm: { span: 20 }}
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 20, offset: 4 }}
}

interface IProps {
  values: PushFormProps
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  syncPlatformList: Array<{[key: string]: string}>
  appidList: Array<{[key: string]: string}>
  getSyncPlatformList: () => void
  getAppidList: () => void
}

const PushApp: React.FC<IProps> = ({ values, setFieldValue, syncPlatformList, appidList, getSyncPlatformList, getAppidList }) => {
  // app group list
  // const [appgroupList, setAppgroupList] = useState<Array<{[key: string]: string}>>([])

  useEffect(() => {
    if (!syncPlatformList.length) {
      getSyncPlatformList()
    }
    if (!appidList.length) {
      getAppidList()
    }
  }, [])

  // render platform option
  const renderPlatformOptions = (): ReactNode => {
    return Data.platform_list.map((item: any) => {
      return <Option key={ item.value } value={ item.value}>{ item.label }</Option>
    })
  }

  // render sync platform option
  const renderSyncPlatformOptions = (): ReactNode => {
    return syncPlatformList.map((item: any) => {
      return <Option key={ item.id } value={ item.id }>{ item.name }</Option>
    })
  }

  // render appid option
  const renderAppidOptions = (): ReactNode => {
    return appidList.map((item: any) => {
      return <Option key={ item.value } value={ item.value }>{ item.label }</Option>
    })
  }

  // // render app group option
  // const renderAppgroupOptions = (): ReactNode => {
  //   return appgroupList.map((item: any) => {
  //     return <Option key={ item.value } value={ item.value }>{ item.label }</Option>
  //   })
  // }

  return (
    <>
      {/* <div>{ JSON.stringify(values) }</div> */}
      <FormItem name="platform" label="platform">
        <Select
          name="platform"
          mode="multiple"
          placeholder="platform"
        >
          { renderPlatformOptions() }
        </Select>
      </FormItem>
      <FormItem name="sync_platform" label="sync_platform">
        <Select
          name="sync_platform"
          mode="multiple"
          placeholder="platform"
        >
          { renderSyncPlatformOptions() }
        </Select>
      </FormItem>
      {/* mobilephone 应该是没用了 */}
      {/* <FormItem name="mobilePhone" label="手机型号">
        <Select
          name="mobilePhone"
          placeholder="platform"
          allowClear
        >

        </Select>
      </FormItem> */}
      <FormItem name="inVersion" label="最小 api 版本">
        <Input 
          name="inVersion"
          placeholder="逗号分隔"
        />
      </FormItem>
      <FormItem name="exVersion" label="排除 api 版本">
        <Input 
          name="exVersion"
          placeholder="逗号分隔"
        />
      </FormItem>
      <FormItem name="inClientVersion" label="包含客户端版本">
        <Input 
          name="inClientVersion"
          placeholder="逗号分隔"
        />
      </FormItem>
      <FormItem name="exClientVersion" label="排除客户端版本">
        <Input 
          name="exClientVersion"
          placeholder="逗号分隔"
        />
      </FormItem>
      <FormItem name="appid" label="包含 appid">
        <Select 
          name="appid"
          mode="multiple"
          placeholder="请选择包含 appid"
        >
          { renderAppidOptions() }
        </Select>
      </FormItem>
      <FormItem name="exappid" label="排除 appid">
        <Select 
          name="exappid"
          mode="multiple"
          placeholder="请选择排除 appid"
        >
          { renderAppidOptions() }
        </Select>
      </FormItem>
      {/* appgroup 应该是不用了 */}
      {/* <FormItem name="appGroup" label="appgroup">
        <Select
          name="appGroup"
          onChange={ () => handleChangeAppGroup(values, setFieldValue) }
          placeholder="请选择 appgroup"
          showSearch
          optionFilterProp="children"
          allowClear
        >
          { renderAppgroupOptions() }
        </Select>
      </FormItem> */}
    </>
  )
}

export default PushApp