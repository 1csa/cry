import React from 'react';
import { message, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ICopyToClipboard {
  data: string;
  title: string;
  renderChild: () => React.ReactElement;
}

const BasicCopyToClipboard: React.FC<ICopyToClipboard> = ({ data, title, renderChild }) => {
  return (
    <CopyToClipboard text={`${data}`} onCopy={() => message.success('复制成功～')}>
      <Tooltip title={`点击复制${title}`}>{renderChild()}</Tooltip>
    </CopyToClipboard>
  );
};

export default BasicCopyToClipboard;
