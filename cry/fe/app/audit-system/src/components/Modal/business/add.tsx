import React, { useState } from 'react';

import { Form } from 'antd';

import Modal, { ModalType } from '@/components/Dumb/CustomModal';
import AuditEmailSelect from '@/components/Smart/AuditEmailSelect';

type unitTypeProps = {
  modalProps: ModalType;
};

const Add: React.FC<unitTypeProps> = ({ modalProps }) => {
  const [email, setEmail] = useState<string>('');

  const handleOk = () => {
    const { onOk } = modalProps;
    typeof onOk === 'function' && onOk(email);
  };

  const handleChange = (value: any) => {
    setEmail(value);
  };

  return (
    <>
      <Modal visible destroyOnClose {...modalProps} width={400} title="新增审核员信息" okText="新增" onOk={handleOk}>
        <Form style={{ paddingLeft: 55 }}>
          <AuditEmailSelect
            selectProps={{
              label: '邮箱',
              name: 'email',
            }}
            handleChange={handleChange}
          />
        </Form>
      </Modal>
    </>
  );
};

export default Add;
