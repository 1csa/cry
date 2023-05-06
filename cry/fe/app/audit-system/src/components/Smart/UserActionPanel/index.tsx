/**
 * 用户行为模板 私信 | 用户 | 群聊 | story图 | story视频
 */
import React from 'react';

import Message from './Message';
import User from './User';
import GroupChat from './GroupChat';
// import Story from './Story';

import { SubBusinessType } from '@/data/constants';

import './index.less';

export interface UserActionPanelProps {
  type: number | string; // 用户行为审核子业务id | 'default', 私信 | 用户 | 群聊
  data: any; // message 数据 { material: { reasons, reportTime, messages, suspect, report } }
  reloadCallBack: () => void;
  isPreview: boolean; // 预览 不展示操作面板 | 非预览 可以操作审核(提交/无效反馈)
  isEdit: boolean; // 是否编辑 默认false
}

const UserActionPanel: React.FC<UserActionPanelProps> = ({ type, data, reloadCallBack, isPreview, isEdit }) => {
  const panel = () => {
    const panelProps = {
      type,
      data,
      reloadCallBack,
      isPreview,
      isEdit,
    };

    const panelMap = {
      [SubBusinessType.message]: () => <Message {...panelProps} />,
      [SubBusinessType.user]: () => <User {...panelProps} />,
      [SubBusinessType.groupChat]: () => <GroupChat {...panelProps} />,
      default: () => <span>用户行为面板正在配置...</span>,
      // default: () => <Story {...panelProps} />,
    };

    return panelMap[type] ? panelMap[type]() : panelMap.default();
  };

  return panel();
};

export default UserActionPanel;
