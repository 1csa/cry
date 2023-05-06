import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form } from 'formik-antd'
import { Card, Button, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import TagSearch from '@/components/TagSearch'
import { TagProps } from '@/config/pushForm/push'
import * as PushService from '@/services/pushService'

import "./index.less";

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { sm: { span: 4 }},
  wrapperCol: { sm: { span: 20 }}
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 20, offset: 4 }}
}

const PushTag: React.FC = () => {
  // channels
  // const [channels, setChannels] = useState<{[key: string]: string}>({})
  const [formatChannels, setFormatChannels] = useState<TagProps>([])
  // exclude_channels
  // const [excludeChannels, setExcludeChannels] = useState<{[key: string]: string}>({})
  const [formatExcludeChannels, setFormatExcludeChannels] = useState<TagProps>([])


  useEffect(() => {
    async function getDefaultChannelsAndExcludeChannels () {
      const { status, channels, exclude_channels } = await PushService.getEditorInfo()
      if (status === 'active') {
        // setChannels(channels)
        // setExcludeChannels(exclude_channels)

        let tempFormatChannels = Object.entries(channels).map(item => {
          const [fromId, name] = item
          return { fromId, name }
        })

        let tempFormatExcludeChannels = Object.entries(exclude_channels).map(item => {
          const [fromId, name] = item
          return { fromId, name }
        })

        setFormatChannels(tempFormatChannels)
        setFormatExcludeChannels(tempFormatExcludeChannels)
      }
    }
    getDefaultChannelsAndExcludeChannels()
  }, [])

  // save 
  const save = async (values: { channels: Array<TagProps | undefined>, exclude_channels: Array<TagProps | undefined> }) => {
    const { channels, exclude_channels } = values
    let channels_obj = {}, exclude_channels_obj = {}
    channels.forEach((item: any) => channels_obj[item.fromId] = item.name)
    exclude_channels.forEach((item: any) => exclude_channels_obj[item.fromId] = item.name)
    
    const { status } = await PushService.saveEditorTag({ channels: channels_obj, exclude_channels: exclude_channels_obj })
    if (status === 'success') {
      message.success('更新常用标签成功!')
    } else {
      message.error('更新常用标签失败!')
    }
  }

  return (
    <div className="tag">
      <PageHeader currentMenu="常用标签管理" currentSubMenu="常用标签管理" />
      <Card className="tag-content">
        <div style={{ width: '800px', margin: '0 auto' }}>
          <Formik
            initialValues={{ channels: formatChannels, exclude_channels: formatExcludeChannels }}
            onSubmit={ (values) => save(values) }
          >
            {
              ({ setFieldValue }) => (
                <Form {...formItemLayout}>
                  <FormItem name="channels" label="常用标签">
                    <TagSearch 
                      name="channels"
                      defaultTags={ formatChannels }
                      defaultSelectedTags={ [] }
                      tagType="closable"
                      isShowPushUserCount={ false }
                      setFieldValue={ setFieldValue }
                    />
                  </FormItem>
                  <FormItem name="exclude_channels" label="常用排除标签">
                    <TagSearch 
                      name="exclude_channels"
                      defaultTags={ formatExcludeChannels }
                      defaultSelectedTags={ [] }
                      tagType="closable"
                      isShowPushUserCount={ false }
                      setFieldValue={ setFieldValue }
                    />
                  </FormItem>
                  <FormItem name="operate" {...tailFormItemLayout}>
                    <Button type="primary" icon="save" htmlType="submit">保存</Button>
                  </FormItem>
                </Form>
              )
            }
          </Formik>
        </div>
      </Card>
    </div>
  )
}

export default PushTag