import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form, Input, Select, Radio, InputNumber } from 'formik-antd'
import { Modal, Button, Tag, Row, Col } from 'antd'

import 'antd/dist/antd.css'

const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  senseTasteDimensionMapList: object
  [propName: string]: any
}

interface SenseTasteProps {
  taste: string
  stepType: string
  frequency: Array<string>
  start: number | undefined
  end: number | undefined
}

const senseTasteEnum = {
  hotTaste: '热点',
  dirtyTaste: '低俗',
}

const frequencyEnum = {
  high: '重度',
  light: '轻度',
  normal: '普通',
  insensitive: '不敏感'
}

const SenseTasteDialog: React.FC<IProps> = ({ setFieldValue, senseTasteDimensionMapList }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)
  // sense taste map
  const [senseTasteMap, setSenseTasteMap] = useState<{[propName: string]: boolean}>({})
  // sense taste list
  let [senseTasteList, setSenseTasteList] = useState<Array<string>>([])

  useEffect(() => {
    updateSenseTasteList()
  }, [senseTasteMap])

  // init form
  const initSenseTaste = (): SenseTasteProps => {
    return {
      taste: '',
      stepType: 'preset',
      frequency: [],
      start: undefined,
      end: undefined
    }
  }

  // handle ok
  const handleOk = (): void => {
    setFieldValue('sensTaste', senseTasteMap)
    setVisible(false)
  }

  // handle cancel
  const handleCancel = (): void => {
    setVisible(false)
  }

  // handle add
  const handleAdd = (values: SenseTasteProps, resetForm: (obj: SenseTasteProps) => void): void => {
    let { taste, stepType, frequency, start, end } = values
    // no frequency start end return
    if (!frequency.length && (start === undefined && end === undefined)) return
    // stepType === 'custom'
    if (stepType === 'custom' && start !== undefined && end !== undefined) {
      senseTasteMap[`${taste}&&&&${start}-${end}`] = true
    }
    // frequency not null
    if (frequency.length) {
      frequency.forEach(item => {
        senseTasteMap[`${taste}&&&&${item}`] = true
      })
    }

    setSenseTasteMap({...senseTasteMap})
    // reset form
    resetForm(initSenseTaste())
  }

  // handle close
  const handleClose = (item: string): void => {
    let [taste, val] = item.split(' ')
    delete senseTasteMap[`${taste}&&&&${val}`]
    setSenseTasteMap({...senseTasteMap})
  }

  // update sense taste list
  const updateSenseTasteList = (): void => {
    senseTasteList = Object.keys(senseTasteMap).map(item => {
      let [taste, val] = item.split('&&&&')
      taste = senseTasteEnum[taste]
      val = frequencyEnum[val] ? frequencyEnum[val] : val
      return `${taste} ${val}`
    })
    setSenseTasteList([...senseTasteList])
  }

  return (
    <>
      <TextArea
        name="sensTaste"
        readOnly
        value={ senseTasteList }
        placeholder="请选择敏感度"
        onClick={ () => setVisible(true) }
      />
      <Modal
        visible={ visible }
        width={ 1000 }
        onOk={ handleOk }
        onCancel={ handleCancel }
        closable={ false }
      >
        <Formik
          initialValues={ initSenseTaste() }
          onSubmit={ (values) => {} }
          render={ ({ values, setFieldValue, resetForm}) => (
            <Form>
              <Row gutter={10}>
                <Col span={5}>
                  <FormItem name="taste">
                    <Select
                      name="taste"
                      showSearch
                      placeholder="请选择指标"
                      onChange={ () => setFieldValue('frequency', []) }
                    >
                      {
                        Object.entries(senseTasteEnum).map(item => {
                          return <Option key={ item[0] } value={ item[0] }>{ item[1]}</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem name="stepType">
                    <RadioGroup name="stepType">
                      <Radio name="stepType" value="preset">预设</Radio>
                      <Radio name="stepType" value="custom">自定义</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  {
                    values.stepType === 'custom' ? (
                      <Row gutter={10}>
                        <Col span={11}>
                          <FormItem name="start">
                            <InputNumber
                              name="start"
                              style={{ width: '100%' }}
                              placeholder="最小值 -100"
                              min={ -100 }
                              max={ 100 }
                              precision={ 0 }
                            />
                          </FormItem>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                        <Col span={11}>
                          <FormItem name="end">
                            <InputNumber
                              name="end"
                              style={{ width: '100%' }}
                              placeholder="最大值 100"
                              min={ -100 }
                              max={ 100 }
                              precision={ 0 }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    ) : (
                      <FormItem name="frequency">
                        <Select 
                          name="frequency"
                          mode="multiple"
                          showSearch
                        >
                          {
                            (senseTasteDimensionMapList[values.taste] || []).map((item: any) => {
                              return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                            })
                          }
                        </Select>
                      </FormItem>
                    )
                  }
                </Col>
                <Col span={3}>
                  <Button type="primary" icon="plus" onClick={ () => handleAdd(values, resetForm) } style={{ position: 'relative', top: '4px' }}>添加</Button>
                </Col>
              </Row>
            </Form>
          )}
        />
        <h4>结果集</h4>
        <div>
          {
            senseTasteList.map((item, index) => {
              return <Tag key={ item } closable onClose={ () => handleClose(item) }>{ item }</Tag>
            })
          }
        </div>
      </Modal>
    </>
  )
}

export default SenseTasteDialog