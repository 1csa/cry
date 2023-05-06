import React from 'react';

import { Modal } from 'antd';

import { ModalProps, ModalFuncProps } from 'antd/es/modal/Modal';

import './index.less';

export type ModalType = ModalProps & ModalFuncProps & { onOk?: (values: any) => void };

const modalPropsDefault = {
  centered: true,
  width: 800,
  bodyStyle: {
    maxHeight: 500,
    overflow: 'auto',
  },
  wrapClassName: 'custom-modal',
};

const CustomModal: React.FC<ModalType> = ({ children, ...modalProps }) => {
  return (
    <Modal {...modalPropsDefault} {...modalProps}>
      {children}
    </Modal>
  );
};

export default CustomModal;
