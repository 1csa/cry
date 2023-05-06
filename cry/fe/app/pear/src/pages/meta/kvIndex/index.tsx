import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Form, Input, Select, Table, Tag } from 'antd';

// import './index.less';
import IndexAddModal from '@/pages/kvAutomation/components/indexAddModal';
import CollocationModal from '@/pages/kvAutomation/components/collocationModal';

const { Option } = Select;
const data = [
  {
    app: 'b',
    scene: '高质量',
    dataType: 'user',
    oneIndex: '1',
    twoIndex: '2',
  },
  {
    app: '主端',
    scene: '高质量',
    dataType: 'user',
    oneIndex: '3',
    twoIndex: '4',
  },
];
const KvIndex = (props: any) => {
  const [indexName, sefIndexName] = useState<string>('kv');
  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: '端',
      dataIndex: 'app',
      key: 'app',
    },
    {
      title: '场景',
      dataIndex: 'scene',
      key: 'scene',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: '一级索引',
      dataIndex: 'oneIndex',
      key: 'oneIndex',
    },
    {
      title: '二级索引',
      dataIndex: 'twoIndex',
      key: 'twoIndex',
    },
    {
      title: '操作',
      render: (text: any) => {
        return (
          <div key={text}>
            <CollocationModal row={text} form={props.form} indexName={indexName}></CollocationModal>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }}>
              删除
            </Tag>
          </div>
        );
      },
    },
  ];
  const handClickBuild = () => {};
  return (
    <div className="FilterList">
      <Card bordered={false} className="FilterList-Card">
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Form.Item label="一级类型">
            {getFieldDecorator('type', {
              initialValue: 'loose',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">loose</Option>
                <Option value="small">small</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="二级类型">
            {getFieldDecorator('libType', {
              initialValue: 'loose',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">loose</Option>
                <Option value="small">small</Option>
              </Select>,
            )}
          </Form.Item>
          <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClickBuild}>
            查询
          </Button>
          <IndexAddModal form={props.form}></IndexAddModal>
        </Form>
        <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} rowKey={Item => Item.app} />
      </Card>
    </div>
  );
};

export default Form.create()(KvIndex);
