// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { Card, Form, Input, Button, Table, Popconfirm, Tooltip, Tag, message } from 'antd';

import AddModal from './add';
import MoveModal from './move';
import { factorType } from './config';

import { fetchFactorList, fetchFactorDelete } from '@/services/knnAutomation';
import { getTypeData } from '@/services/knnAutomation';

import UserPermissions from '@/utils/user_whitelist';
import { ConnectState } from '@/models/connect';
import './index.less';

const tipsConfig = {
  cpuIdle: {
    error: 40,
    warning: 70,
  },
  systemLoad: {
    error: 80,
    warning: 50,
  },
  memoryFree: {
    error: 20,
    warning: 40,
  },
  diskFree: {
    error: 20,
    warning: 40,
  },
};

const statusTag = (text: string | number, status: string) => {
  const tags = {
    error: () => <Tag color="#c00">{text}</Tag>,
    warning: () => <Tag color="rgb(228, 139, 22)">{text}</Tag>,
    default: () => text,
  };

  return tags[status] ? tags[status]() : tags.default();
};

const Machine = (props: any) => {
  const defaultPageSize = 20;
  const { getFieldDecorator, validateFields } = props.form;
  const [values, setValues] = useState({ host: '' });
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: defaultPageSize });
  const [factorList, setFactorList] = useState([]);

  useEffect(() => {
    fetchTypeData();
    queryList(values);
  }, []);

  const fetchTypeData = async () => {
    const res = await getTypeData({});
    if (res.success) {
      const factor = (res?.data?.machineFactor || []).map(item => {
        return {
          text: item,
          value: item,
        };
      });
      setFactorList(factor);
    }
  };

  const queryList = async ({ host }: { host: string }) => {
    setLoading(true);
    const { success, data } = await fetchFactorList({ host });
    setLoading(false);
    if (success) {
      const formatData = data.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
        };
      });
      setList(formatData);
    }
  };

  const del = async (hosts: string[]) => {
    const res = await fetchFactorDelete({ hosts });
    if (res.success) {
      if (selectedRowKeys.length) {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      }
      message.success('删除成功');
      queryList(values);
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const batchDel = () => {
    const hosts: string[] = selectedRows.map(item => item.host);
    if (hosts.length === 0) {
      message.error('请选择要删除的机器！');
      return;
    }
    del(hosts);
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      render: (_: any, __: any, index: number) => index + 1 + (pagination.current - 1) * defaultPageSize,
    },
    {
      title: '机器factor',
      key: 'factor',
      dataIndex: 'factor',
      onFilter: (value: any, record: any) => record.factor === value,
      filters: factorList,
    },
    {
      title: '主机IP',
      key: 'host',
      dataIndex: 'host',
    },
    {
      title: '机器类型',
      key: 'machineType',
      dataIndex: 'machineType',
      onFilter: (value: any, record: any) => record.machineType === value,
      filters: factorType,
    },
    {
      title: 'CPU IDLE',
      key: 'cpuIdlePercent',
      dataIndex: 'cpuIdlePercent',
      sorter: (a: any, b: any) => a.cpuIdlePercent - b.cpuIdlePercent,
      render: (text: number) => {
        const status = text < tipsConfig.cpuIdle.error ? 'error' : text < tipsConfig.cpuIdle.warning ? 'warning' : 'default';
        return statusTag(text, status);
      },
    },
    {
      title: '负载率(%)',
      key: 'systemLoadPercent',
      dataIndex: 'systemLoadPercent',
      sorter: (a: any, b: any) => a.systemLoadPercent - b.systemLoadPercent,
      render: (text: number) => {
        const status = text > tipsConfig.systemLoad.error ? 'error' : text > tipsConfig.systemLoad.warning ? 'warning' : 'default';
        return statusTag(text, status);
      },
    },
    {
      title: '内存剩余(%)',
      key: 'memFreePercent',
      dataIndex: 'memFreePercent',
      sorter: (a: any, b: any) => a.memFreePercent - b.memFreePercent,
      render: (text: number) => {
        const status = text < tipsConfig.memoryFree.error ? 'error' : text < tipsConfig.memoryFree.warning ? 'warning' : 'default';
        return statusTag(text, status);
      },
    },
    {
      title: '磁盘剩余(%)',
      key: 'diskFreePercent',
      dataIndex: 'diskFreePercent',
      sorter: (a: any, b: any) => a.diskFreePercent - b.diskFreePercent,
      render: (text: number) => {
        const status = text < tipsConfig.diskFree.error ? 'error' : text < tipsConfig.diskFree.warning ? 'warning' : 'default';
        return statusTag(text, status);
      },
    },
    {
      title: 'KNN库列表',
      key: 'types',
      dataIndex: 'types',
      render: (text: string[]) => {
        const showText = text?.slice(0, 1) || '';
        return (
          <Tooltip title={text?.join('\n') || ''} overlayStyle={{ whiteSpace: 'pre-line' }}>
            {showText ? `${showText}${text.length > 1 ? '...' : ''}` : ''}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, row: any) => {
        return (
          <>
            {UserPermissions(props.user.currentUser.name) ? (
              <div>
                <Popconfirm title={`是否要删除？${row.host}`} onConfirm={() => del([row.host])}>
                  <Button type="link">删除</Button>
                </Popconfirm>
                <MoveModal host={row.host} factor={row.factor || ''} successCallback={submit} />
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  const submit = (event: any) => {
    event?.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log(values, '22222');
        setValues(values);
        queryList(values);
      }
    });
  };

  const paginationConfig = {
    pageSize: defaultPageSize,
    onChange: (current, pageSize) => {
      setPagination({
        current,
        pageSize,
      });
    },
    showTotal: total => `共 ${total} 条`,
  };

  return (
    <div className="factor">
      <Card bordered={false} className="factor-card">
        <Form layout="inline" onSubmit={submit} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            <Form.Item label="主机IP">
              {getFieldDecorator('host', {
                initialValue: '',
              })(<Input placeholder="请输入主机IP" style={{ width: 200 }} />)}
            </Form.Item>
            <Button type="primary" htmlType="submit" icon="search" onClick={submit}>
              搜索
            </Button>
          </span>

          <span>
            <AddModal successCallback={submit} />
            <Popconfirm
              disabled={!selectedRowKeys.length}
              title={`是否要删除？${selectedRows.map(item => item.host).join('\n')}`}
              onConfirm={batchDel}
              overlayStyle={{ whiteSpace: 'pre-line' }}
            >
              {UserPermissions(props.user.currentUser.name) ? (
                <Button type="primary" disabled={!selectedRowKeys.length}>
                  批量删除
                </Button>
              ) : (
                ''
              )}
            </Popconfirm>
          </span>
        </Form>

        <div style={{ marginTop: 10 }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey="index"
            pagination={paginationConfig}
            footer={() => '备注：机器指标数值为近 3 天和最近 5小时 的平均值'}
          />
        </div>
      </Card>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(Form.create()(Machine));
