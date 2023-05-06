import React, { FC, useEffect } from 'react';
import { Button, Card, Form, Input, Select, Table } from 'antd';

// import './index.less';
import IndexAddModal from '@/pages/kvAutomation/components/indexAddModal';
import CollocationModal from '@/pages/kvAutomation/components/collocationModal';

const { Option } = Select;

const data = [
  {
    app: 'b',
    scene: '高质量',
    dataType: 'user',
    name: '小库',
  },
  {
    app: '主端',
    scene: '高质量',
    dataType: 'user',
    name: '大库',
  },
];
const KnnIndex = (props: any) => {
  useEffect(() => {}, []);
  // function onChange(value) {
  //   console.log(`selected ${value}`);
  // }
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
      title: '库名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '配置',
      render: (text: any) => {
        return (
          <div key={text}>
            <CollocationModal row={text} form={props.form} indexName="knn"></CollocationModal>
          </div>
        );
      },
    },
  ];
  const handClick = () => {};
  return (
    <div className="FilterList">
      <Card bordered={false} className="FilterList-Card">
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Form.Item label="knn库名">
            {getFieldDecorator('type', {
              initialValue: 'loose',
            })(
              <Select style={{ width: 80 }}>
                <Option value="loose">loose</Option>
                <Option value="small">small</Option>
              </Select>,
            )}
          </Form.Item>
          <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClick}>
            查询
          </Button>
          <IndexAddModal form={props.form}></IndexAddModal>
        </Form>
        <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Form.create()(KnnIndex);
