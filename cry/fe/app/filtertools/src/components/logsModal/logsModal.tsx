import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Table } from 'antd';
import moment from 'moment';
import './logModal.less'

interface LogModalProps {
  logList: Object;
  modalFlag: boolean;
  setModal?: (param: string) => void;
}
const actionList = [
  {
    name: '全部',
    value: 'all',
  }, {
    name: '保存',
    value: 'save',
  }, {
    name: '删除',
    value: 'delete',
  },
]
const LogModal: React.FC<LogModalProps> = (props: LogModalProps) => {
  const {
    modalFlag,
    setModal,
    logList
  } = props
  // const dateFormat = 'YYYY-MM-DD';
  const dateFormat2 = 'YYYY-MM-DD HH:mm';

  const handleCancel = () => {
    setModal(false)
  };
  const column = [{
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
    render: (text: any) => moment(text * 1000).format(dateFormat2),
  }, {
    title: '执行操作',
    dataIndex: 'action',
    key: 'action',
    width: 90,
    render: (text: any) => actionList.map( item => {
      if (item.value === text) {
        return item.name
      }
    }),
  }, {
    title: '操作内容',
    dataIndex: 'value',
    key: 'value',
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          wordBreak: 'break-all',
          overflow: 'hidden'
        }
      }
    },
  }, {
    title: '操作人',
    dataIndex: 'nickname',
    key: 'nickname',
  }];
  return (
    <div className="log-content">
      <Modal
        title="数据查询"
        visible={modalFlag}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            关闭
          </Button>
        ]}
        destroyOnClose={true}
        width="300"
      >
        <Table
          dataSource={[logList]}
          columns={column}
          rowKey={record => record.index}
          width="280"
          pagination={false}
        />
      </Modal>
    </div>
  );
}

export default LogModal;
