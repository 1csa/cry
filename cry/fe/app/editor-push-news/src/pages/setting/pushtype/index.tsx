import React, { useState, useEffect, useCallback, ReactNode } from 'react' 
import PageHeader from '@/components/PageHeader'
import { Form, Input, InputNumber, Radio, Checkbox, Select } from 'formik-antd'
import { Formik } from 'formik'
import { Button, Card, Table, Modal, Divider, message, Popconfirm, Tooltip, Icon } from 'antd'
import TagSearch from '@/components/TagSearch'
import { connect } from 'dva'
import { Dispatch, ConnectState, PushtypeModelState } from '@/models/connect'
import { PaginationProps } from 'antd/lib/pagination'
import { ColumnProps } from 'antd/es/table'
import { GidProps } from '@/config/gid/gid'
import { PushtypeProps } from '@/config/pushtype/pushtype'
import * as ValidateGid from '@/validation/gid'
import * as Validate from '@/validation/pushtype'
import * as PushtypeServices from '@/services/pushtypeService'

import 'antd/dist/antd.css'
import "./index.less";

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { sm: { span: 4 }},
  wrapperCol: { sm: { span: 20 }}
}

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 8, offset: 4 }}
}

interface PushtypeEnumProps {
  dispatch: Dispatch,
  pushtype: PushtypeModelState
}

const PushtypeList: React.FC<PushtypeEnumProps> = ({ dispatch, pushtype }) => {
  // table loading
  const [loading, setLoading] = useState<boolean>(false)
  // table data
  const [pushtypeList, setPushtypeList] = useState<PushtypeProps[]>([])
  const [pushtypeListTotal, setPushtypeListTotal] = useState<number>(0)
  // page
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 10,
    total: pushtypeListTotal,
    current: 1
  })
  // modal visible
  const [visible, setVisible] = useState<boolean>(false)
  // isAdd judge is add or edit
  const [isAdd, setIsAdd] = useState<boolean>(true)
  // current pushtype
  const [currentPushtype, setCurrentPushtype] = useState<PushtypeProps>({})
  // gid
  const [gidList, setGidList] = useState<GidProps[]>([])
  const [gidMap, setGidMap] = useState<{[key: string]: any}>({})

  const columns: ColumnProps<PushtypeProps>[] = [{
    title: '#',
    key: 'index',
    width: 60,
    render: (text: any, record: any, index: number): number => {
      return (pagination.current! - 1) * pagination.pageSize! + index + 1
    },
    fixed: 'left'
  }, {
    title: 'pushtype',
    dataIndex: 'id',
    key: 'pushtype id',
    width: 100,
    fixed: 'left'
  }, {
    title: 'pushtype name',
    dataIndex: 'name',
    key: 'pushtype name',
    width: 150,
    fixed: 'left'
  }, {
    title: 'gid',
    dataIndex: 'gid.gid',
    key: 'gid',
    width: 100
  }, {
    title: 'gid name',
    dataIndex: 'gid.name',
    key: 'gid name',
    width: 150
  }, {
    title: '推送类型',
    dataIndex: 'triggerType',
    key: 'triggerType',
    width: 120
  }, {
    title: 'users',
    dataIndex: 'users',
    key: 'users',
    width: 250,
    render: (text: string[], record: PushtypeProps): string => {
      return text.join(',') || '-'
    }
  }, {
    title: '状态(用作展示)',
    dataIndex: 'status',
    key: 'status',
    width: 200,
    render: (text: number, record: PushtypeProps): string => {
      return text === 1 ? '线上使用中' : text === 0 ? '线上未使用，可复用' : '线上未使用，被其他模块写死等导致不可复用'
    }
  }, {
    title: 'score',
    dataIndex: 'score',
    key: 'score',
    width: 100
  }, {
    title: '生效 appid',
    dataIndex: 'includeAppIds',
    key: 'includeAppIds',
    width: 250,
    render: (text: string[], record: PushtypeProps): string => {
      return text.join(',') || '-'
    }
  }, {
    title: '排除 appid',
    dataIndex: 'excludeAppIds',
    key: 'excludeAppIds',
    width: 250,
    render: (text: string[], record: PushtypeProps): string => {
      return text.join(',') || '-'
    }
  }, {
    title: '默认排除标签',
    dataIndex: 'excludeFromids',
    key: 'excludeFromids',
    width: 250,
    render: (text: string[], record: PushtypeProps): string => {
      return text.join(',') || '-'
    }
  }, {
    title: '操作',
    key: 'operate',
    width: 140,
    render: (text: any, record: PushtypeProps): ReactNode => {
      return (
        <span>
          <a onClick={ () => handleEdit(record) }>编辑</a>
          <Divider type="vertical" />
          {
            [0, 1].includes(record.status) &&
            <Popconfirm
              title={ `确定要${ record.status === 1 ? '删除' : '恢复' } pushtype 为 ${record.id}，name 为 ${record.name} 的记录吗?` }
              okText="确定"
              cancelText="取消"
              onConfirm={ () => handleChangeStatus(record.id!, record.status === 1 ? 0 : 1)}
            >
              <a>{ record.status === 1 ? '删除' : '恢复'}</a>
            </Popconfirm>
          }
        </span>
      )
    },
    fixed: 'right'
  }]

  const { pushtypeEnum } = pushtype

  useEffect(() => {
    getPushtypeList()
    getGidList()
    if (!Object.keys(pushtypeEnum).length) {
      dispatch({ type: 'pushtypeEnum/getPushtypeEnum'})
    }
  }, [])

  useEffect(() => {
    setGidMap(formatGidMap(gidList))
  }, [gidList])

  // format gidMap {gid: name}
  const formatGidMap = useCallback((data: Array<GidProps>, map: object = {}): object => {
    data.forEach(item => {
      map[item.gid!] = {
        name: item.name,
        status: item.status
      }
    })
    return map
  }, [gidList])

  // change pagination
  const handleTableChange = (pagination: PaginationProps): void => {
    setPagination(pagination)
  }

  const getGidList = async () => {
    const { status, data } = await PushtypeServices.getGidList()
    if (status === 'success') {
      setGidList(data)
    } else {
      message.error('获取 gid 失败!')
    }
  }

  // get pushtype list
  const getPushtypeList = async () => {
    setLoading(true)
    const { status, data } = await PushtypeServices.getPushtypeList()
    if (status === 'success') {
      setPushtypeList(data)
      setPushtypeListTotal(data.length)
      setLoading(false)
    } else {
      setLoading(false)
      message.error('获取 pushtype 失败!')
    }
  }

  // change pushtype status
  const handleChangeStatus = async (id: number, pushtypeStatus: number) => {
    const { status } = await PushtypeServices.changePushtypeStatus(id, pushtypeStatus)
    if (status === 'success') {
      message.success('pushtype 状态修改成功!')
      getPushtypeList()
    } else {
      message.error('pushtype 状态修改失败!')
    }
  }

  // init form
  const initForm = (): PushtypeProps => {
    let init = {
      gid: {
        gid: undefined,
        name: undefined,
        status: undefined
      },
      id: undefined,
      name: undefined,
      triggerType: 'EDITOR',
      users: [],
      status: 0,
      score: 0,
      includeAppIds: [],
      excludeAppIds: [],
      excludeFromids: [],
      desc: undefined
    }
    return isAdd ? init : currentPushtype
  }

  const handleAdd = (): void => {
    setVisible(true)
    setIsAdd(true)
  }

  const handleEdit = (record: PushtypeProps): void => {
    setVisible(true)
    setCurrentPushtype(record)
    setIsAdd(false)
  }

  // save pushtype
  const save = async (values: PushtypeProps) => {
    if (isAdd) {
      const { status } = await PushtypeServices.addPushtype(values)
      if (status === 'success') {
        message.success('新增 pushtype 成功!')
        getPushtypeList()
        // initForm()
        setVisible(false)
      } else {
        message.error('新增 pushtype 失败!')
      }
    } else {
      const { status } = await PushtypeServices.updatePushtype(values)
      if (status === 'success') {
        message.success('更新 pushtype 成功!')
        getPushtypeList()
        setVisible(false)
      } else {
        message.error('更新 pushtype 失败!')
      }
    }
  }

  // change gid set gidname
  const handleChangeGid = (val: string, setFieldValue: any): void => {
    let { name, status } = gidMap[val]
    setFieldValue('gid', {
      gid: val,
      name,
      status
    })
  }

  const renderGidOptions = (): ReactNode => {
    return gidList.map((item: any) => {
      return (
        <Option key={ item.gid } value={ item.gid }>{ item.gid } - { item.name }</Option>
      )
    })
  }

  const renderAppIdsOptions = (): ReactNode => {
    return pushtypeEnum.appidEnum.map((item: any) => {
      return (
        <Option key={ item.value } value={ item.value }>{ item.label }</Option>
      )
    })
  }

  return (
    <div className="pushtype">
      <PageHeader currentMenu="pushtype 管理" currentSubMenu="列表" />
      <Card className="pushtype-content">
        <Button type="primary" icon="plus" style={{ marginBottom: '24px' }} onClick={ handleAdd }>新增</Button>
        <Table
          columns={ columns }
          dataSource={ pushtypeList }
          rowKey={ (render: PushtypeProps) => render.id! + '' }
          bordered
          scroll={{ x: '100%' }}
          pagination={ pagination }
          loading={ loading }
          onChange={ handleTableChange }
        />
      </Card>
      <Modal
        title={ isAdd ? '新增 pushtype' : '编辑 pushtype' }
        visible={ visible }
        width={ 1000 }
        footer={ null }
        onCancel={ () => setVisible(false) }
      >
        <Formik
          initialValues={ initForm() }
          onSubmit={ (values) => save(values) }
          enableReinitialize={ true }
        >
          {
            ({ values, setFieldValue, handleReset }) => (
              <Form {...formItemLayout}>
                <FormItem name="gid.gid" label="gid" validate={ ValidateGid.validateGid }>
                  <Select 
                    name="gid.gid"
                    placeholder="请选择 gid"
                    style={{ width: '40%' }}
                    onChange={ (val) => handleChangeGid(val, setFieldValue) }
                    allowClear
                  >
                    { renderGidOptions() }
                  </Select>
                  <Tooltip placement="right" title="若没有对应的 gid 组，请先到 gid 管理创建 gid">
                    <Icon type="question-circle" style={{ marginLeft: '8px', fontSize: '16px' }} />
                  </Tooltip>
                </FormItem>
                <FormItem name="gid.name" label="gid name" validate={ ValidateGid.validateGidName }>
                  <Input
                    name="gid.name"
                    style={{ width: '40%' }}
                    disabled
                    value={ values.gid.name }
                  />
                </FormItem>
                <FormItem name="id" label="pushtype" validate={ Validate.validatePushtype }>
                  <InputNumber 
                    name="id"
                    style={{ width: '40%' }}
                    placeholder="请输入 pushtype"
                    disabled={ !isAdd }
                  />
                </FormItem>
                <FormItem name="name" label="pushtype name" validate={ Validate.validatePushtypeName }>
                  <Input
                    name="name"
                    style={{ width: '40%' }}
                    placeholder="请输入 pushtype name"
                  />
                </FormItem>
                <FormItem name="triggerType" label="推送类型">
                  <RadioGroup 
                    name="triggerType"
                    options={ pushtypeEnum.triggerTypeEnum }
                  />
                </FormItem>
                <FormItem name="users" label="users">
                  <CheckboxGroup
                    name="users"
                    options={ pushtypeEnum.usersEnum }
                  />
                </FormItem>
                <FormItem name="status" label="状态(用作展示)">
                  <RadioGroup 
                    name="status"
                    options={ pushtypeEnum.statusEnum }
                  />
                </FormItem>
                <FormItem name="score" label="score">
                  <InputNumber 
                    name="score"
                    style={{ width: '40%' }}
                    placeholder="请输入 score"
                  />
                </FormItem>
                <FormItem name="includeAppIds" label="生效 appid">
                  <Select 
                    name="includeAppIds"
                    mode="multiple"
                    style={{ width: '40%' }}
                  >
                    { renderAppIdsOptions() }
                  </Select>
                </FormItem>
                <FormItem name="excludeAppIds" label="排除 appid">
                  <Select 
                    name="excludeAppIds"
                    mode="multiple"
                    style={{ width: '40%' }}
                  >
                    { renderAppIdsOptions() }
                  </Select>
                </FormItem>
                <FormItem name="excludeFromids" label="默认排除标签">
                  <TagSearch
                    name="excludeFromids"
                    defaultTags={ [] }
                    defaultSelectedTags={ currentPushtype.excludeFromids || [] }
                    tagType="checkable"
                    setFieldValue={ setFieldValue }
                  />
                </FormItem>
                <FormItem name="desc" label="描述">
                  <TextArea
                    name="desc"
                    placeholder="请添加描述"
                  />
                </FormItem>
                <FormItem {...tailFormItemLayout} name="operate">
                  <Button type="primary" icon="save" htmlType="submit">保存</Button>
                  <Button type="primary" icon="rollback" style={{ marginLeft: '20px' }} onClick={ handleReset }>重置</Button>
                </FormItem>
              </Form>
            )
          }
        </Formik>
      </Modal>
    </div>
  )
}

export default connect((state: ConnectState) => {
  return { pushtype: state.pushtypeEnum, }
})(PushtypeList)