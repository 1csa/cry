import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Card, Form, Input, message, Modal, Select, Table, Tag } from 'antd';

import { businessScene, getBusinessScene } from '@/services/filterRules';
import AddModal from './modal/addModal';
import DeleteModal from './modal/deleteModal';
import Search from '@/components/Search';

const Scene = ({ form }: any) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [addvisible, setAddVisible] = useState<boolean>(false);
  const [deletevisible, setDeletevisible] = useState<boolean>(false);
  //判断是否是添加框和编辑框
  const [isaddModal, setIsAddModal] = useState<boolean>(false);
  const [updateValue, setUpdateValue] = useState<any>({});

  const [sceneList, setSceneList] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(50);

  const { getFieldDecorator, validateFieldsAndScroll } = form;

  useEffect(() => {
    getBusinessSceneList();
  }, []);

  const getBusinessSceneList = async () => {
    setLoading(true);
    let data = {
      params: {
        appIdGroup: '',
        scene:''
      },
    };
    const res: any = await getBusinessScene(data);
    if ((res.success = true)) {
      message.success('请求成功');
      setLoading(false);
      setSceneList(res.data);
    }
  };

  const handClickBuild = () => {
    setLoading(true);
    validateFieldsAndScroll(async (err: any, values: any) => {
      const res: any = await getBusinessScene({
        params: {
          appIdGroup: values.appIdGroup,
          scene: values.scene,
        },
      });
      setLoading(false);
      if ((res.success = true)) {
        message.success('查询成功');
        setSceneList(res.data);
      }
    });
  };
  const handClickClose = () => {
    setAddVisible(false);
    setDeletevisible(false);
    setUpdateValue({});
  };
  const handClickAdd = () => {
    setAddVisible(true);
    setIsAddModal(true);
  };
  const handClickUpdate = (data: any) => {
    setAddVisible(true);
    setIsAddModal(false);
    setUpdateValue({ ...data });
  };
  const handClickdelete = (data: any) => {
    setDeletevisible(true);
    setUpdateValue({ ...data });
  };
  const addModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await businessScene({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'add',
        });
        if (res?.success === true) {
          message.success('创建成功');
          setAddVisible(flag);
          handClickBuild();
        }
      }
    });
  };
  const editModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await businessScene({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'update',
        });
        if (res?.success === true) {
          message.success('更新成功');
          setAddVisible(flag);
          handClickBuild();
        }
      }
    });
  };
  const deleteModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res: any = await businessScene({
          ...values,
          username: localStorage.getItem('user')?.split('@')[0],
          type: 'delete',
        });
        if (res?.success === true) {
          message.success('更新成功');
          setDeletevisible(flag);
          handClickBuild();
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
      title: '端',
      dataIndex: 'appIdGroup',
      key: 'appIdGroup',
      align: 'center',
    },
    {
      title: '场景',
      dataIndex: 'scene',
      key: 'scene',
      align: 'center',
    },
    {
      title: 'fromId',
      dataIndex: 'fromId',
      key: 'fromId',
      align: 'center',
    },
    {
      title: 'appId',
      dataIndex: 'appId',
      key: 'appId',
      align: 'center',
    },
    {
      title: 'fakeAppId',
      dataIndex: 'fakeAppId',
      key: 'fakeAppId',
      align: 'center',
    },
    {
      title: '场景名称',
      dataIndex: 'scenarioName',
      key: 'scenarioName',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'cName',
      key: 'cName',
      align: 'center',
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
      width:150,
      render: (text: string, row: any) => {
        return (
          <div key={text}>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => handClickUpdate(row)}>
              修改
            </Tag>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => handClickdelete(row)}>
              删除
            </Tag>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card bordered={false}>
        <Form layout="inline" style={{ paddingLeft: '5%' }}>
          <Search form={form} values='allTasks'></Search>
          <Button style={{ marginTop: 4, marginLeft: 10 }} type="primary" icon="search" onClick={handClickBuild}>
            查询
          </Button>
          <Button style={{ marginTop: 4, marginLeft: 30 }} type="primary" onClick={handClickAdd}>
            + 新增场景
          </Button>
          <AddModal
            visible={addvisible}
            isAddModal={isaddModal}
            row={updateValue}
            closeCallback={handClickClose}
            addModal={addModal}
            editModal={editModal}
          ></AddModal>
          <DeleteModal visible={deletevisible} row={updateValue} closeCallback={handClickClose} deleteModal={deleteModal}></DeleteModal>
        </Form>
        <Table style={{ marginTop: 10 }} loading={loading} columns={columns} dataSource={sceneList} pagination={{
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
export default Form.create()(Scene);
