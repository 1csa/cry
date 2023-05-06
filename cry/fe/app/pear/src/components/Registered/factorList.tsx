import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
interface FactorLisProps {
  form: any;
  onChange: any;
  item: any;
  addEdlVisible: boolean;
  queryListType: any;
}
const FactorList: React.FC<FactorLisProps> = ({ onChange, item, addEdlVisible, form, queryListType }) => {
  const { getFieldDecorator } = form;

  const onValueChange = (e: any) => {
    setTimeout(() => {
      form.validateFields().then((data: any) => {
        addEdlVisible ? onChange({ factor: item, ...data }) : onChange({ ...item, ...data });
      });
    }, 1000);
  };

  return (
    <>
      <Form layout="inline" onChange={onValueChange}>
        <Row>
          {addEdlVisible ? (
            ''
          ) : (
            <Col span={6} push={1}>
              <Form.Item label="factor">
                {getFieldDecorator('factor', {
                  initialValue: item.factor,
                })(
                  <Select style={{ width: 140 }} onChange={onValueChange}>
                    {queryListType?.factors?.map((item: any) => {
                      return <Select.Option key={item}>{item}</Select.Option>;
                    })}
                  </Select>,
                )}{' '}
                :
              </Form.Item>
            </Col>
          )}

          <Col span={addEdlVisible ? 8 : 6} push={1}>
            <Form.Item label="预期异常率">
              {getFieldDecorator('expectExceptionRatio', {
                initialValue: addEdlVisible ? 0 : item.expectExceptionRatio,
                rules: [{ required: true, message: '不能为空' }],
              })(<Input style={{ width: 68 }}></Input>)}
            </Form.Item>
          </Col>

          <Col span={addEdlVisible ? 8 : 6}>
            <Form.Item label="预期耗时">
              {getFieldDecorator('expectLatency', {
                initialValue: addEdlVisible ? 10 : item.expectLatency,
                rules: [{ required: true, message: '不能为空' }],
              })(<Input style={{ width: 68 }}></Input>)}
            </Form.Item>
          </Col>

          <Col span={addEdlVisible ? 8 : 6} pull={1}>
            <Form.Item label="预期空结果率">
              {getFieldDecorator('expectEmptyRatio', {
                initialValue: addEdlVisible ? 0 : item.expectEmptyRatio,
                rules: [{ required: true, message: '不能为空' }],
              })(<Input style={{ width: 68 }}></Input>)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Form.create()(FactorList);
