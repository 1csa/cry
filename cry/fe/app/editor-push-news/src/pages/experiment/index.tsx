import React, { useState, useEffect, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { Card, Button, Table, Row, Col, Tooltip } from 'antd'
import PageHeader from '@/components/PageHeader'
import { ColumnProps } from 'antd/es/table'
import { ExperimentListProps } from '@/config/experiment/experiment'
import { getExperimentList } from '@/services/experimentService'

import 'antd/dist/antd.css'
import "./index.less";

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { sm: { span: 6 }},
  wrapperCol: { sm: { span: 18 }},
}

const ExperimentList: React.FC = () => {
  const [experimentList, setExperimentList] = useState<Array<ExperimentListProps>>([])

  const history = useHistory()

  const columns: ColumnProps<ExperimentListProps>[] = [{
    title: '实验名称（bucket_name）',
    dataIndex: 'bucket_name',
    key: 'bucket_name',
    width: 300,
    fixed: 'left',
    render: (text: string, record: ExperimentListProps): ReactNode => {
      return <a onClick={ () => history.push({ pathname: `/experiment/${text}` }) }>{ text }</a>
    }
  }, {
    title: '负责人',
    dataIndex: 'bucket_creator',
    key: 'bucket_creator',
    width: 100,
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 190
  }, {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: 190
  }, {
    title: '实验过期时间',
    dataIndex: 'expire_time',
    key: 'expire_time',
    width: 190
  }, {
    title: '离线过期时间',
    dataIndex: 'expire_offline_time',
    key: 'expire_offline_time',
    width: 190
  }, {
    title: 'appid',
    dataIndex: 'bucket_appids',
    key: 'bucket_appids',
    width: 400,
    ellipsis: true,
    render: (text: string, record: ExperimentListProps) => {
      return <Tooltip placement="top" title={ text }>{ text }</Tooltip>
    }
  }]

  useEffect(() => {
    search()
  }, [])

  const search = async (values?: { kws: string }) => {
    const kws = values ? values.kws : ''
    const { status, data } = await getExperimentList(kws)

    if (status === 'success') {
      setExperimentList(data)
    }
  }

  return (
    <div className="experiment">
      <PageHeader currentMenu="实验列表" currentSubMenu="列表" />
      <Card className="experiment-content">
        <Formik
          initialValues={{ kws: '' }}
          onSubmit={ (values) => search(values) }
        >
          {
            () => (
              <Form>
                <Row gutter={ 24 }>
                  <Col span={ 8 }>
                    <FormItem name="kws" label="名称/负责人" {...formItemLayout}>
                      <Input
                        name="kws"
                        placeholder="请输入实验名称或负责人进行模糊匹配搜索"
                      />
                    </FormItem>
                  </Col>
                  <Col span={ 8 }>
                    <FormItem name="operate">
                      <Button type="primary" icon="search" htmlType="submit">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            )
          }
        </Formik>
        <Table
          columns={ columns }
          dataSource={ experimentList }
          rowKey={ (render: ExperimentListProps) => render.id }
          scroll={{ x: '100%' }}
          bordered
        />
      </Card>
    </div>
  )
}

export default ExperimentList