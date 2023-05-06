/**
 * 群聊举报
 */
import React, { useState, useEffect } from 'react';

import { Divider, Tag } from 'antd';

import Dialogue, { messageItemProps } from '@/components/Dialogue';
import UserInfo from '@/components/Dumb/UserInfo';
import UserAction from '@/components/Smart/AuditOperationPanel/UserAction';

import { UserActionPanelProps } from './index';

import { isJSON } from '@/utils/dev_helper';

const GroupChatReport: React.FC<UserActionPanelProps> = ({ type, data, reloadCallBack, isPreview, isEdit }) => {
  const {
    material: { messages, suspect, reasons, report, reportTime, part_zone_cn },
    audit_level,
  } = data;

  // 是否展示 标签
  const [showTags, setShowTags] = useState(isEdit || !isPreview);

  useEffect(() => {
    setShowTags(isEdit || !isPreview);
  }, [isEdit, isPreview]);

  // 对话选中 id
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const checkedChange = (messagesId: string[]) => {
    setMessageIds(messagesId);
  };

  const [dialogueList, setDialogueList] = useState<messageItemProps[]>([]);
  useEffect(() => {
    const result = data[`result_l${audit_level}`];
    const { auditHitMessages = [] } = isJSON(result) ? JSON.parse(result) : {};
    const _messageIds = auditHitMessages.map((item: any) => item.messagesId) ?? [];
    setMessageIds(_messageIds);

    const list: Array<messageItemProps> = [];
    messages?.forEach((item: any, index: number) => {
      const { messagesId, suspected } = item;
      list.push({
        id: messagesId ?? index,
        reporter: false,
        user: suspected,
        ...item,
      });
    });
    setDialogueList(list);
  }, [JSON.stringify(messages)]);

  return (
    <div className="main-panel-card message-panel">
      <div className="card main-panel-card-left">
        <div className="head">
          <h3>
            群ID：<span className="suspect">{suspect?.id ?? ''}</span>
          </h3>
          <span>
            <Tag>群聊举报</Tag>
            <Tag>{part_zone_cn}</Tag>
          </span>
        </div>
        <div>举报人ID：{report?.id}</div>
        <div>用户举报类型：{reasons?.join('，')}</div>
        <div>举报时间：{reportTime ?? ''}</div>
        <Divider />
        <Dialogue dialogueList={dialogueList} canChoose defaultValue={messageIds} checkedChange={checkedChange} />
      </div>
      <div className="main-panel-card-right">
        {showTags ? <UserAction type={type} data={data} reloadCallBack={reloadCallBack} checkedMessageIds={messageIds} /> : null}
        <div className="card">
          <UserInfo title="举报人信息" {...report} />
        </div>
      </div>
    </div>
  );
};

export default GroupChatReport;
