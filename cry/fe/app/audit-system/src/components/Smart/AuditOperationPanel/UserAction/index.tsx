/**
 * 用户行为审核操作
 */
import React from 'react';

import Message from './Message';
import User from './User';
import GroupChat from './GroupChat';
import Story from './Story';

import { SubBusinessType } from '@/data/constants';

export interface UserActionProps {
  type: number | string; // 用户行为审核子业务id | 'default', 私信 | 用户 | 群聊
  data: any; // message 数据 { material: { messages, id, objectId, reasons, report, enterTime, reportTime } }
  reloadCallBack: () => void;
  checkedMessageIds?: string[]; // 对话框选中 ids
}

const UserAction: React.FC<UserActionProps> = ({ type = 'default', data, reloadCallBack, checkedMessageIds = [] }) => {
  const panel = () => {
    const panelProps = {
      data,
      reloadCallBack,
    };
    const panelMap = {
      [SubBusinessType.message]: () => <Message {...panelProps} />,
      [SubBusinessType.user]: () => <User {...panelProps} />,
      [SubBusinessType.groupChat]: () => <GroupChat {...panelProps} checkedMessageIds={checkedMessageIds} />,
      [SubBusinessType.storyImage]: () => <Story {...panelProps} />,
      [SubBusinessType.storyVideo]: () => <Story {...panelProps} />,
      default: () => <span>用户行为"操作"面板正在配置...</span>,
    };

    return panelMap[type] ? panelMap[type]() : panelMap.default();
  };

  return <>{panel()}</>;
};

export default UserAction;
