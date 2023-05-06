import React, { useEffect, ReactNode } from 'react'
import { Form, Input, Select, Switch, DatePicker } from 'formik-antd'
import TagSearch from '@/components/TagSearch'
import { EditorInfoProps, PushFormProps } from '@/config/pushForm/push'
import { Moment } from 'moment'
import * as Validate from '@/validation/push'
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
  editorInfo: EditorInfoProps
  categoryList: Array<{[key: string]: string}>
  userLayerChannelList: Array<{[key: string]: string}>
  getCategoryList: () => void
  getUserLayerChannelList: () => void
}

const PushLaunch: React.FC<IProps> = ({ values, setFieldValue, editorInfo, categoryList, userLayerChannelList, getCategoryList, getUserLayerChannelList }) => {
  useEffect(() => {
    if (!categoryList.length) {
      getCategoryList()
    }
    if (!userLayerChannelList.length) {
      getUserLayerChannelList()
    }
    setFieldValue('key', editorInfo.push_key)
  }, [])

  // render push type option
  const renderPushTypeOptions = (): ReactNode => {
    return editorInfo.permission && editorInfo.permission.map((item: string) => {
      return <Option key={ item } value={ item }>{ item }</Option>
    })
  }

  // render retrieve strategy option
  const renderRetrieveStrategyOptions = (): ReactNode => {
    return Data.retrieve_strategy_list.map((item: any) => {
      return <Option key={ item.value } value={ item.value }>{ item.label }</Option>
    })
  }

  // render category option
  const renderCategoryOptions = (): ReactNode => {
    return categoryList.map((item: any) => {
      return <Option key={ item.id + encodeURIComponent(item.name) } value={ item.id }>{ item.name }</Option>
    })
  }

  // render expire time option
  const renderExpireTimeOptions = (): ReactNode => {
    return Data.expire_time_list.map((item: any) => {
      return <Option key={ item.value } value={ item.value }>{ item.label }</Option>
    })
  }

  // render deliver scope option
  const renderDeliverScopeOptions = (): ReactNode => {
    return Data.deliver_scope_list.map((item: any) => {
      return <Option key={ item.value } value={ item.value }>{ item.label }</Option>
    })
  }

  // render user layer channel option
  const renderUserLayerChannelOptions = (): ReactNode => {
    return userLayerChannelList.map((item: any) => {
      return <Option key={ item.id } value={ item.id }>{ item.name }</Option>
    })
  }

  // render tag required
  const isTagRequired = (retrieve_strategy: string = ''): boolean => {
    return retrieve_strategy !== 'only_veins'
  }

  // render delay push time required
  const isDelayPushTimeRequired = (delay_push: string): boolean => {
    return delay_push === '1'
  }

  return (
    <>
      {/* <div>{ JSON.stringify(values) }</div> */}
      <FormItem name="pushType" label="推送类别" validate={ Validate.validatePushType } required>
        <Select
          name="pushType"
          placeholder="请选择 pushtype"
        >
          { renderPushTypeOptions() }
        </Select>
      </FormItem>
      {
        values.pushType === 'userid' &&
        <FormItem name="userids" label="uids">
          <Input
            name="userids"
            placeholder="Userid: id1, id2, ..."
          />
        </FormItem>
      }
      <FormItem name="retrieve_strategy" label="热点脉络推送方式">
        <Select
          name="retrieve_strategy"
          placeholder="请选择热点脉络推送方式"
          allowClear
        >
          { renderRetrieveStrategyOptions() }
        </Select>
      </FormItem>
      {
        values.retrieve_strategy &&
        <FormItem name="veins_docids" label="热点脉络文章">
          <Input
            name="veins_docids"
            placeholder="请输入热点脉络文章 docid，逗号分隔"
          />
        </FormItem>
      }
      <FormItem name="cate" label="分类" validate={ Validate.validateCate } required>
        <Select
          name="cate"
          placeholder="请选择分类"
          allowClear
        >
          { renderCategoryOptions() }
        </Select>
      </FormItem>
      <FormItem name="expireTime" label="过期时间">
        <Select
          name="expireTime"
          placeholder="请选择过期时间"
        >
          { renderExpireTimeOptions() }
        </Select>
      </FormItem>
      {
        // todo 还有权限 329
        ['auto_add', 'auto', 'auto_break'].includes(values.pushType) &&
        <FormItem name="deliver_scope" label="分发范围">
          <Select
            name="deliver_scope"
            placeholder="请选择分发范围"
            allowClear
          >
            { renderDeliverScopeOptions() }
          </Select>
        </FormItem>
      }
      <FormItem name="user_layer_channel" label="用户层级">
        <Select
          name="user_layer_channel"
          mode="multiple"
          placeholder="用户层级"
        >
          { renderUserLayerChannelOptions() }
        </Select>
      </FormItem>
      <FormItem name="tags" label="Tags" validate={ (val) => Validate.validateTags(val, values.retrieve_strategy) } required={ isTagRequired(values.retrieve_strategy) }>
        <TagSearch
          name="tags"
          defaultTags={ editorInfo.format_channels }
          defaultSelectedTags={ [] }
          tagType="checkable"
          setFieldValue={ setFieldValue }
        />
      </FormItem>
      <FormItem name="excludeTags" label="排除 Tags">
        <TagSearch
          name="excludeTags"
          defaultTags={ editorInfo.format_exclude_channels }
          defaultSelectedTags={ [] }
          isShowPushUserCount={ false }
          tagType="checkable"
          setFieldValue={ setFieldValue }
        />
      </FormItem>
      <FormItem name="delay_push" label="定时推送">
        <Switch
          name="delay_push"
          checked={ values.delay_push === '1' }
          checkedChildren="开"
          unCheckedChildren="关"
          onChange={ (val) => setFieldValue('delay_push', val ? '1' : '0') }
        />
      </FormItem>
      {
        values.delay_push === '1' &&
        <FormItem name="delay_push_time" label="发送时间" validate={ (val) => Validate.validateDelayPushTime(val, values.delay_push) } required={ isDelayPushTimeRequired(values.delay_push) }>
          <DatePicker
            name="delay_push_time"
            showTime={ true }
            placeholder="请选择发送时间"
            onChange={ (val: Moment) => setFieldValue('delay_push_time', val.unix()) }
          />
        </FormItem>
      }
    </>
  )
}

export default PushLaunch
