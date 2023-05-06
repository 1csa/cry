import React from 'react';
import { Modal } from 'antd';
import Prompt from 'umi/prompt';

interface IPromptModalProps {
  promptVisible: boolean;
  promptDataLen: number;
  callback: (pathname: string) => void;
}

const PromptModal: React.FC<IPromptModalProps> = ({ callback, promptDataLen, promptVisible }) => {
  return (
    <Prompt
      when={promptVisible}
      message={location => {
        Modal.confirm({
          title: '请注意',
          content: '确定要离开当前页面吗？一旦确认离开，当前页面的审核数据将被作废！',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            callback && callback(location.pathname);
          },
        });
        // false弹窗拦截
        return promptDataLen > 0 ? false : true;
      }}
    />
  );
};

export default PromptModal;
