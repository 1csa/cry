// 交互弹窗
import React from 'react';
import { Button, Modal, Drawer } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { ModalProps, ModalFuncProps } from 'antd/es/modal';
import { DrawerProps } from 'antd/es/drawer';

interface YModal {
  type: 'drawer' | 'modal' | 'func';
  label: string;
  content?: React.ReactNode;
  showModal?: boolean;
  buttonProps?: ButtonProps;
  modalProps?: Omit<ModalProps, 'onCancel' | 'visible'>;
  drawerProps?: Omit<DrawerProps, 'onClose' | 'visible'>;
  funcProps?: ModalFuncProps;
  onShowModal?: () => void;
  onCloseModal?: () => void;

  className?: string;
  style?: React.CSSProperties;
}

const YModal: React.FC<YModal> = ({
  type = 'drawer',
  className,
  content,
  style,
  label,
  showModal,
  onShowModal,
  onCloseModal,
  buttonProps,
  modalProps,
  drawerProps,
  funcProps,
}) => {
  const showFastModal = () => {
    return Modal.confirm({
      ...funcProps,
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
    });
  };

  return (
    <>
      <Button
        className={className}
        style={style}
        size="small"
        onClick={type === 'func' ? showFastModal : onShowModal}
        {...buttonProps}
      >
        {label}
      </Button>
      {['drawer', 'modal'].includes(type)
        ? {
            modal: (
              <Modal visible={showModal} footer={null} closable={false} onCancel={onCloseModal} {...modalProps}>
                {content}
              </Modal>
            ),
            drawer: (
              <Drawer closable={false} width={550} visible={showModal} onClose={onCloseModal} {...drawerProps}>
                {content}
              </Drawer>
            ),
          }[type]
        : null}
    </>
  );
};

export default React.memo(YModal);
