import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Button, Card, Form, Input, message, Modal, Select, Table, Tag } from 'antd';
import AddModal from './modal/addModal';

import { getSinkQuery, sinkQuery ,getFilterRuleList} from '@/services/filterRules';
import DeleteModal from './modal/deleteModal';
const Scene = ({ form }: any) => {
  const [addvisible, setAddVisible] = useState<boolean>(false);
  //判断是否是添加框和编辑框
  const [isaddModal, setIsAddModal] = useState<boolean>(false);
  const [updateValue, setUpdateValue] = useState<any>({});

  const [sinkQueryList, setSinkQueryList] = useState<any>([]);
  const [filterRuleList, setFilterRuleList] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(50);

  useEffect(() => {
    getSinkQueryList();
  }, []);

  const getSinkQueryList = async () => {
    const res: any = await getSinkQuery({});
    if ((res.success = true)) {
      message.success('请求成功');
      setSinkQueryList(res.data);
    }
  };
  const handClickClose = () => {
    setAddVisible(false);
    setUpdateValue({});
  };
  const handClickAdd = async() => {
    //根据ID拿到名称的列表（在线）
    const res:any = await getFilterRuleList({params:{
      category:"OpsToolFilter"
    }})
    if (res.success = true) {
       setFilterRuleList(res.data)
    }
    setAddVisible(true);
    setIsAddModal(true);
  };
  const handClickUpdate = async (data: any) => {
     const res:any = await getFilterRuleList({params:{
      category:"OpsToolFilter"
    }})
    if (res.success = true) {
       setFilterRuleList(res.data)
    }
    setAddVisible(true);
    setIsAddModal(false);
    setUpdateValue({ ...data });
  };
  const addModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await sinkQuery({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'add',
        });
        if (res?.success === true) {
          message.success('创建成功');
          setAddVisible(flag);
          getSinkQueryList();
        }
      }
    });
  };
  const editModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await sinkQuery({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'update',
        });
        if (res?.success === true) {
          message.success('更新成功');
          setAddVisible(flag);
          getSinkQueryList();
        }
      }
    });
  };
  const columns: any = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    //   width: 70,
    // },
    {
      title: '在线规则ID',
      dataIndex: 'onlineRuleId',
      key: 'onlineRuleId',
      align: 'center',
    },
    {
      title: '在线规则名称',
      dataIndex: 'onlineRuleName',
      key: 'onlineRuleName',
      align: 'center',
    },
    {
      title: '内容类型',
      dataIndex: 'dataType',
      key: 'dataType',
      align: 'center',
    },
    {
      title: '下沉规则ID',
      dataIndex: 'sinkRuleId',
      key: 'sinkRuleId',
      align: 'center',
    },
    {
      title: '下沉规则名称',
      dataIndex: 'sinkRuleName',
      key: 'sinkRuleName',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'cName',
      key: 'cName',
      align: 'center',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'cTime',
      key: 'cTime',
      align: 'center',
      render: (text: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 150,
      render: (text: string, row: any) => {
        return (
          <div key={text}>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => handClickUpdate(row)}>
              修改
            </Tag>
            <DeleteModal row={row} closeCallback={getSinkQueryList}></DeleteModal>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card bordered={false}>
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Button style={{ marginTop: 4, marginRight: 30 }} type="primary" onClick={handClickAdd}>
            + 新增映射
          </Button>
          <AddModal
            visible={addvisible}
            isAddModal={isaddModal}
            row={updateValue}
            closeCallback={handClickClose}
            addModal={addModal}
            editModal={editModal}
            filterRuleList={filterRuleList}
          ></AddModal>
        </Form>
        <Table style={{ marginTop: 10 }} columns={columns} dataSource={sinkQueryList} pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => setPage(page),
            onShowSizeChange: (current, pageSize) => {
              setPage(1);
              setPageSize(pageSize);
            },
            showTotal: total => `共 ${total} 条`,
          }}/>
      </Card>
    </>
  );
};
export default Form.create()(Scene);
