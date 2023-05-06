import React, { useState, useEffect } from 'react';

import { Modal, message } from 'antd';

import { getLogColumns } from './tableColumns';
import CustomizeTable from '../BasicTable/CustomizeTable';

import { fetchRecords } from '@/services/commonServices';

interface IReviewModal {
  visible: boolean;
  onCancelCallBack: (status: boolean) => void;
  taskId: string;
}

const ReviewLogModal: React.FC<IReviewModal> = ({ visible, onCancelCallBack, taskId }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 这么做的目的是延迟展示弹窗在接口请求成功之后才展示
  const [logVisible, setLogVisible] = useState<boolean>(false);

  const handleCancel = () => {
    onCancelCallBack && onCancelCallBack(false);
    setLogVisible(false);
  };

  const getLogTableData = (taskId: string) => {
    fetchRecords({ taskId })
      .then(res => {
        const { errorno, desc, data } = res;
        if (errorno === 0) {
          setDataSource(data);
          setLogVisible(true);
        } else {
          setLogVisible(false);
          message.error(desc);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    visible && getLogTableData(taskId);
  }, [visible]);

  return (
    <Modal title="审核历史日志" visible={logVisible} footer={null} onCancel={handleCancel} width={1200}>
      <CustomizeTable data={dataSource} columns={getLogColumns()} pagination={{}} rowKey="id" />
    </Modal>
  );
};

export default ReviewLogModal;
