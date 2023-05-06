import React, { useState } from 'react';

import { Radio } from 'antd';

import Modal, { ModalType } from '@/components/Dumb/CustomModal';

const options = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

type systemProps = {
  modalProps: ModalType;
  initStatus?: 0 | 1;
};

const SystemConfig: React.FC<systemProps> = ({ modalProps, initStatus = 0 }) => {
  const handleOk = () => {
    const { onOk } = modalProps;
    typeof onOk === 'function' && onOk(status);
  };

  // 状态切换
  const [status, setStatus] = useState(initStatus);
  const onChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setStatus(value);
  };

  return (
    <Modal visible destroyOnClose {...modalProps} width={400} title="编辑系统权限" onOk={handleOk}>
      <div style={{ textAlign: 'center' }}>
        系统管理员：
        <Radio.Group options={options} defaultValue={initStatus} onChange={onChange} />
      </div>
    </Modal>
  );
};

export default SystemConfig;
