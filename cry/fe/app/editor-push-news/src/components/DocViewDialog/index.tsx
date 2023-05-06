import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Tag, Icon, Row, Col } from 'antd';

type IProps = {
  visible: boolean;
  docId: string;
  onSubmit?: () => void;
  onClose?: () => void;
};
const DocViewDialog: React.FC<IProps> = React.memo(({ visible, docId, onSubmit, onClose }) => {
  const iframeUrl = ` http://www.yidianzixun.com/article/${docId}`;
  return (
    <Modal width="65%" centered footer={null} visible={visible} onOk={onSubmit} onCancel={onClose} >
      <iframe frameBorder="0" width='100%' height="550" src={iframeUrl}></iframe>
    </Modal>
  );
});

export default DocViewDialog;
