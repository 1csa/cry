import React, { useState, useEffect, ReactNode } from 'react';
import PageHeader from '@/components/PageHeader';
import { Form, Input, InputNumber } from 'formik-antd';
import { Formik } from 'formik';
import { Button, Card, Table, Modal, Divider, message, Popconfirm } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { GidProps } from '@/config/gid/gid';
import * as Validate from '@/validation/gid';
import * as PushtypeService from '@/services/pushtypeService';

import 'antd/dist/antd.css';
import './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { sm: { span: 4 } },
  wrapperCol: { sm: { span: 8 } },
};

const tailFormItemLayout = {
  wrapperCol: { sm: { span: 8, offset: 4 } },
};

const GidList: React.FC = () => {
  // table loading
  const [loading, setLoading] = useState<boolean>(false);
  // table data
  const [gidList, setGidList] = useState<GidProps[]>([]);
  const [gidListTotal, setGidListTotal] = useState<number>(0);
  // page
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 10,
    total: gidListTotal,
    current: 1,
  });
  // modal visible
  const [visible, setVisible] = useState<boolean>(false);
  // isAdd judge is add or edit
  const [isAdd, setIsAdd] = useState<boolean>(true);
  // current gid
  const [currentGid, setCurrentGid] = useState<GidProps>({});

  useEffect(() => {
    getGidList();
  }, []);

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: any, record: any, index: number): number => {
        return (pagination.current! - 1) * pagination.pageSize! + index + 1;
      },
    },
    {
      title: 'gid',
      dataIndex: 'gid',
      key: 'gid',
    },
    {
      title: 'gid name',
      dataIndex: 'name',
      key: 'gid name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: number, record: GidProps): string => {
        return text === 1 ? '线上使用中' : text === 0 ? '线上未使用，可复用' : '线上未使用，被其他模块写死等导致不可复用';
      },
    },
    {
      title: '操作',
      key: 'operate',
      render: (text: any, record: GidProps): ReactNode => {
        return (
          <span>
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            {[0, 1].includes(record.status) && (
              <Popconfirm
                title={`确定要${record.status === 1 ? '删除' : '恢复'} gid 为 ${record.gid}，name 为 ${record.name} 的记录吗?`}
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleChangeStatus(record.gid!, record.status === 1 ? 0 : 1)}
              >
                <a>{record.status === 1 ? '删除' : '恢复'}</a>
              </Popconfirm>
            )}
            {record.status === -1 && <span>不可恢复</span>}
          </span>
        );
      },
    },
  ];

  // change pagination
  const handleTableChange = (pagination: PaginationProps): void => {
    setPagination(pagination);
  };

  // get gid list
  const getGidList = async () => {
    setLoading(true);
    const { status, data } = await PushtypeService.getGidList();
    if (status === 'success') {
      setGidList(data);
      setGidListTotal(data.length);
      setLoading(false);
    } else {
      setLoading(false);
      message.error('获取 gid 失败!');
    }
  };

  // change gid status
  const handleChangeStatus = async (gid: number, gidStatus: number) => {
    const { status } = await PushtypeService.changeGidStatus(gid, gidStatus);
    if (status === 'success') {
      message.success('gid 状态修改成功!');
      getGidList();
    } else {
      message.error('gid 状态修改失败!');
    }
  };

  // init form
  const initForm = (): GidProps => {
    // console.log(isAdd, currentGid)
    return isAdd ? { gid: undefined, name: '', status: 0 } : currentGid;
  };

  const handleAdd = (): void => {
    setVisible(true);
    setIsAdd(true);
  };

  const handleEdit = (record: GidProps): void => {
    setVisible(true);
    setCurrentGid(record);
    setIsAdd(false);
  };

  // save gid
  const save = async (values: GidProps) => {
    if (isAdd) {
      const { status } = await PushtypeService.addGid(values);
      if (status === 'success') {
        message.success('新增 gid 成功!');
        getGidList();
        setVisible(false);
      } else {
        message.error('新增 gid 失败!');
      }
    } else {
      const { status } = await PushtypeService.updateGid(values);
      if (status === 'success') {
        message.success('更新 gid 成功!');
        getGidList();
        setVisible(false);
      } else {
        message.error('更新 gid 失败!');
      }
    }
  };

  return (
    <div className="gid">
      <PageHeader currentMenu="gid 管理" currentSubMenu="列表" />
      <Card className="gid-content">
        <Button type="primary" icon="plus" style={{ marginBottom: '24px' }} onClick={handleAdd}>
          新增
        </Button>
        <Table
          columns={columns}
          dataSource={gidList}
          rowKey={(render: GidProps) => render.gid + ''}
          bordered
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      <Modal title={isAdd ? '新增 gid' : '编辑 gid'} visible={visible} width={1000} footer={null} onCancel={() => setVisible(false)}>
        <Formik initialValues={initForm()} onSubmit={values => save(values)} enableReinitialize={true}>
          {({ handleReset }) => (
            <Form {...formItemLayout}>
              <FormItem name="gid" label="gid" validate={Validate.validateGid}>
                <InputNumber name="gid" style={{ width: '100%' }} placeholder="请输入 gid" disabled={!isAdd} />
              </FormItem>
              <FormItem name="name" label="gid name" validate={Validate.validateGidName}>
                <Input name="name" style={{ width: '100%' }} placeholder="请输入 gid name" />
              </FormItem>
              <FormItem {...tailFormItemLayout} name="operate">
                <Button type="primary" icon="save" htmlType="submit">
                  保存
                </Button>
                <Button type="primary" icon="rollback" style={{ marginLeft: '20px' }} onClick={handleReset}>
                  重置
                </Button>
              </FormItem>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default GidList;
