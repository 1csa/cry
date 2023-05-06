import React, { FC, useEffect } from 'react';
import { Button, Card, Form, Input, Select, Table } from 'antd';

import AddModal from './addModal';
// import './index.less';

const { Option } = Select;

const MetaSetting = (props: any) => {
  useEffect(() => {}, []);
  // function onChange(value) {
  //   console.log(`selected ${value}`);
  // }
  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: '端',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '场景',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '数据类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  const handClickBuild = () => {};
  return (
    <Card bordered={false}>
      <Form layout="inline" style={{ paddingLeft: '5%' }}>
        <Form.Item label="端">
          {getFieldDecorator('type', {
            initialValue: 'loose',
          })(
            <Select style={{ width: 80 }}>
              <Option value="loose">loose</Option>
              <Option value="small">small</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="场景">
          {getFieldDecorator('libType', {
            initialValue: 'loose',
          })(
            <Select style={{ width: 80 }}>
              <Option value="loose">loose</Option>
              <Option value="small">small</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="数据类型" style={{ marginLeft: 10 }}>
          {getFieldDecorator('libType', {
            initialValue: '',
          })(
            <Select style={{ width: 80 }}>
              <Option value="big">big</Option>
              <Option value="small">small</Option>
            </Select>,
          )}
        </Form.Item>
        <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClickBuild}>
          查询
        </Button>
        <AddModal form={props.form}></AddModal>
      </Form>
      <Table style={{ marginTop: 10 }} columns={columns} />
    </Card>
  );
};

export default Form.create()(MetaSetting);
