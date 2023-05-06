import React, { useEffect, useState } from 'react';

import { Table, Select, Form, Card, Button, Tag, Tooltip, Popconfirm, message } from 'antd';
import AddModal from './modal/addmodal';
import DetailsModal from './modal/detailsModal';
import Search from '@/components/Search';
import { Columns } from './modal/tableColumns';
import { SearchContentType, SearchArticleSource } from '@/config/list.config';
import { getFilterDebug, getFilterDebugRunTask } from '@/services/filterRules';

import './index.less';
const AllTasks = ({ form }: any) => {
  const [startButton, setStartButton] = useState<boolean>(false);
  // const [detailButton, setDetailButton] = useState<boolean>(false);
  const [filterDebugList, setFilterDebugList] = useState<any>([]);
  const { getFieldDecorator, validateFields } = form;
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(50);


  useEffect(() => {
    getFilterDebugList();
  }, []);
  const getFilterDebugList = async () => {
    const res: any = await getFilterDebug({});
    if ((res.success = true)) {
      message.success('请求成功');
      setFilterDebugList(res.data);
    }
  };
  const columns: any = [
    ...Columns,
    {
      title: '操作',
      align: 'center',
      width:130,
      render: (text: string, row: any) => {
        return (
          <div key={text}>
            {/* {startButton ? (
              <Button type="link">执行中</Button>
            ) : ( */}
            {row.status === 'RUNNING' && <Button type="link">执行中</Button>}
            {row.status === 'FINISHED' && (
              <>
                <Popconfirm title="您确定开始吗?" onConfirm={() => handleStart(row)} okText="确定" cancelText="取消">
                  <Tag color="#108ee9" style={{ cursor: 'pointer' }} >
                    开始
                  </Tag>
                </Popconfirm>
                <DetailsModal row={row}></DetailsModal>
              </>
            )}
            {row.status === 'WAITING' && (
              <>
               <Popconfirm title="您确定开始吗?" onConfirm={() => handleStart(row)} okText="确定" cancelText="取消">
                  <Tag color="#108ee9" style={{ cursor: 'pointer' }} >
                    开始
                  </Tag>
                </Popconfirm>
              </>
            )}
          </div>
        );
      },
    },
  ];
  const handleStart = async (row: any) => {
    let data = {
      taskId: row.primaryId,
      startTime: '',
    };
    const res: any = await getFilterDebugRunTask(data);
    if ((res.success = true)) {
      handClickBuild();
    }
  };
  const handClickBuild = () => {
    validateFields (async(errors: any, values: any) => {
      if (!errors) {
    const res: any = await getFilterDebug({params:{
          appIdGroup: values.appIdGroup,
          scene: values.scene,
          dataType:values.dataType,
          sourceType:values.sourceType
    }});
     if ((res.success = true)) {
      message.success('请求成功');
      setFilterDebugList(res.data);
     }
      }
    });
  };

  return (
    <>
      <Card bordered={false}>
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Search form={form} values='allTasks'></Search>
          <Form.Item label="数据类型" style={{ marginLeft: 10 }}>
            {getFieldDecorator('dataType', {
              initialValue: '',
            })(
              <Select style={{ width: 130 }} allowClear={true}>
                {SearchContentType.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="文章来源" style={{ marginLeft: 10 }}>
            {getFieldDecorator('sourceType', {
              initialValue: '',
            })(
              <Select style={{ width: 175 }} allowClear={true}>
                {SearchArticleSource.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.key}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClickBuild}>
            查询
          </Button>
          {/* 添加弹出框 */}
          <AddModal successCallback={handClickBuild}></AddModal>
        </Form>
        <Table style={{ marginTop: 10 }} columns={columns} dataSource={filterDebugList} pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => setPage(page),
            onShowSizeChange: (current, pageSize) => {
              setPage(1);
              setPageSize(pageSize);
            },
            showTotal: total => `共 ${total} 条`,
          }} />
      </Card>
    </>
  );
};

export default Form.create()(AllTasks);
