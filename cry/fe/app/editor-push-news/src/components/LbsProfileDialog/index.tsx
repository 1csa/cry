import React, { useState, useEffect, useCallback } from 'react'
import { Formik } from 'formik'
import { Form, Select, Input } from 'formik-antd'
import { Row, Col, Button, Tag } from 'antd'
import { Modal } from 'antd'

const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option

interface IProps {
  lbsProfile: Array<string> | undefined
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  lbsProfileDimensionMapList: Array<OptionProps>
  [propName: string]: any
}

interface LbsProfileProps {
  province: string
  city: string
  county: string[]
}

interface OptionProps {
  key: string,
  value: string,
  properties: {
    [key: string]: any
  }
}

const LbsProfileDialog: React.FC<IProps> = ({ lbsProfile, setFieldValue, lbsProfileDimensionMapList }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)

  // lbs profile list
  const [lbsProfileList, setLbsProfileList] = useState<Array<string> | undefined>(lbsProfile)

  // dMap
  const [dMap, setDMap] = useState<{[key: string]: any}>({})

  useEffect(() => {
    if (Array.isArray(lbsProfileDimensionMapList)) {
      setDMap(formatDMap(lbsProfileDimensionMapList))
    }
  }, [lbsProfileDimensionMapList])

  // format dMap
  const formatDMap = useCallback((data: Array<OptionProps>, dMap: object = {}): object => {
    data.forEach(item => {
      const { key, properties } = item
      if (properties && properties.CHILD) {
        properties.CHILD.forEach((it: any) => {
          let newKey = ''
          if (it.key.indexOf('/') > -1) {
            newKey = it.key
          } else {
            newKey = `${key}/${it.key}`
          }
          it['key'] = newKey
          if(it.properties && it.properties.CHILD) {
            dMap[newKey] = it.properties.CHILD
            dMap = formatDMap(it.properties.CHILD, dMap)
          }
        })
        dMap[key] = properties.CHILD
      }
    })
    return dMap
  }, [lbsProfileDimensionMapList])

  // init form
  const initLbsProfile = (): LbsProfileProps => {
    return {
      province: '',
      city: '',
      county: []
    }
  }

  // modal ok
  const handleOk = (): void => {
    setFieldValue('lbsProfile', lbsProfileList)
    setVisible(false)
  }

  // modal cancel
  const handleCancel = (): void => {
    setVisible(false)
  }

  // change province clear city county cityList countyList
  const handleChangeProvince = (values: LbsProfileProps, setFieldValue: (field: string, value: any) => void): void => {
    const { province } = values
    setFieldValue('city', '')
    setFieldValue('county', [])
  }

  // change city clear county countyList
  const handleChangeCity = (values: LbsProfileProps, setFieldValue: (field: string, value: any) => void): void => {
    const { city } = values
    setFieldValue('county', [])
  }

  // handle add
  const handleAdd = (values: LbsProfileProps, resetForm: (obj: LbsProfileProps) => void): void => {
    const { province, city, county } = values
    // not province return 
    if (!province) return
    
    // lbsProfileList set
    let lbsProfileSet = new Set(lbsProfileList)

    if (city && (!county || (county && !county.length))) {
      const key = `${city}/全部`
      lbsProfileSet.add(key)
    } else if (county.length) {
      county.forEach(item => {
        lbsProfileSet.add(`${city}/${item}`)
      })
    } else if (province) {
      const key = `${province}/全部/全部`
      lbsProfileSet.add(key)
    }

    setLbsProfileList([...lbsProfileSet])
    // reset form
    resetForm(initLbsProfile())
  }

  // handle close
  const handleClose = (tag: string): void => {
    const index = lbsProfileList!.indexOf(tag)
    if (index !== -1) {
      lbsProfileList!.splice(index, 1)
    }
    setLbsProfileList([...lbsProfileList!])
  }

  return (
    <>
      <TextArea
        name="lbsProfile"
        readOnly
        value={ lbsProfileList }
        placeholder="请选择行政区划，无选项时默认为全部"
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
          initialValues={ initLbsProfile() }
          onSubmit={ (values) => {} }
          render={ ({ values, setFieldValue, resetForm }) => (
            <Form>
              <Row gutter={5}>
                <Col span={7}>
                  <FormItem name="province">
                    <Select
                      name="province"
                      allowClear
                      placeholder="省, 不选默认全部"
                      onChange={ () => handleChangeProvince(values, setFieldValue) }
                    >
                      {
                        lbsProfileDimensionMapList.map((item: any) => {
                          return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem name="city">
                    <Select
                      name="city"
                      allowClear
                      placeholder="市，不选默认全部"
                      onChange={ () => handleChangeCity(values, setFieldValue) }
                    >
                      {
                        (dMap[values.province] || []).map((item: any) => {
                          return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem name="county">
                    <Select
                      name="county"
                      mode="multiple"
                      placeholder="县/区，不选默认全部"
                      // onChange={ () => handleChangeCity(values, setFieldValue) }
                    >
                      {
                        (dMap[values.city] || []).map((item: any) => {
                          return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
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
            lbsProfileList!.map((item: string) => {
              return <Tag key={ item } closable onClose={ () => handleClose(item) }>{ item }</Tag>
            })
          }
        </div>
      </Modal>
    </>
  )
}

export default LbsProfileDialog