import React, { useState, useEffect, useCallback } from 'react'
import { Formik } from 'formik'
import { Form, Input, InputNumber, Select } from 'formik-antd'
import { Modal, Button, Tag, Row, Col } from 'antd'

import 'antd/dist/antd.css'

const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option

interface IProps {
  name: string
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  interestTagDimensionMapList: Array<OptionProps>
  disabled: boolean
  [propName: string]: any
}

interface InterestTagProps {
  largeTags: string
  smallTags: Array<string>
}

interface OptionProps {
  key: string,
  value: string,
  properties: {
    [key: string]: any
  }
}

const InterestTagDialog: React.FC<IProps> = ({ name, setFieldValue, interestTagDimensionMapList, disabled }) => {
  // modal show
  const [visible, setVisible] = useState<boolean>(false)
  
  // interest tag list
  const [interestTagList, setInterestTagList] = useState<Array<string>>([])

  // dMap
  const [dMap, setDMap] = useState<{[key: string]: any}>({})

  useEffect(() => {
    if (Array.isArray(interestTagDimensionMapList)) {
      setDMap(formatDMap(interestTagDimensionMapList))
    }
  }, [interestTagDimensionMapList])

  // format dMap
  const formatDMap = useCallback((data: Array<OptionProps>, dMap: object = {}): object => {
    console.log('format dmap')
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
    console.log(dMap, Object.keys(dMap).length)
    return dMap
  }, [interestTagDimensionMapList])

  // init
  const initInterestTag = (): InterestTagProps => {
    return {
      largeTags: '',
      smallTags: [],
    }
  }

  // handle ok
  const handleOk = (): void => {
    setFieldValue(name, interestTagList)
    setVisible(false)
  }

  // handle cancel
  const handleCancel = (): void => {
    setVisible(false)
  }

  // handle add
  const handleAdd = (values: InterestTagProps, resetForm: (obj: InterestTagProps) => void): void => {
    let { largeTags, smallTags } = values
    // no largeTags return
    if (!largeTags) return
    
    let interestTagSet = new Set(interestTagList)
    if (!smallTags || (smallTags && !smallTags.length)) {
      const key = `${largeTags}/全部`
      interestTagSet.add(key)
    } else if (smallTags.length) {
      smallTags.forEach(item => {
        interestTagSet.add(item)
      })
    }

    setInterestTagList([...interestTagSet])
    resetForm(initInterestTag())
  }

  // handle close
  const handleClose = (tag: string): void => {
    const index = interestTagList.findIndex(item => item === tag)
    if (index !== -1) {
      interestTagList.splice(index, 1)
    }
    setInterestTagList([...interestTagList])
  }

  return (
    <>
      <TextArea
        name={ name }
        readOnly
        value={ interestTagList }
        disabled={ disabled }
        placeholder="请选择兴趣标签，无选项时默认为全部"
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
          initialValues={ initInterestTag() }
          onSubmit={ (values) => {} }
          render={ ({ values, setFieldValue, resetForm }) => (
            <Form>
              <Row gutter={5}>
                <Col span={5}>
                  <FormItem name="largeTags">
                    <Select
                      name="largeTags"
                      showSearch
                      placeholder="标签大类"
                      onChange={ () => setFieldValue('smallTags', []) }
                    >
                      {
                        (interestTagDimensionMapList || []).map((item: any) => {
                          return <Option key={ item.key } value={ item.key }>{ item.value }</Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={16}>
                  <FormItem name="smallTags">
                    <Select
                      name="smallTags"
                      mode="multiple"
                      showSearch
                      placeholder="标签小类，不选默认全部"
                    >
                      {
                        (dMap[values.largeTags] || []).map((item: any) => {
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
            interestTagList.map((item: string) => {
              return <Tag key={ item } closable onClose={ () => handleClose(item) }>{ item }</Tag>
            })
          }
        </div>
      </Modal>
    </>
  )
}

export default InterestTagDialog