import React, { memo, useState, useEffect } from 'react';

import { Divider, Tag } from 'antd';

import Dialogue, { messageItemProps } from '@/components/Dialogue';
import UserInfo from '@/components/Dumb/UserInfo';
import UserAction from '@/components/Smart/AuditOperationPanel/UserAction';

import { UserActionPanelProps } from './index';

const MessagePanel: React.FC<UserActionPanelProps> = ({ type, data, reloadCallBack, isPreview, isEdit = false }) => {
  const {
    material: { reasons, reportTime, messages, suspect, report, part_zone_cn },
  } = data;

  // 是否展示 标签
  const [showTags, setShowTags] = useState(isEdit || !isPreview);

  useEffect(() => {
    setShowTags(isEdit || !isPreview);
  }, [isEdit, isPreview]);

  const [dialogueList, setDialogueList] = useState<messageItemProps[]>([]);
  useEffect(() => {
    const list: Array<messageItemProps> =
      messages?.map((item: any) => {
        const reporter: boolean = item.sendUserId === report.id;
        const user = reporter ? report : suspect;
        return {
          reporter,
          user,
          ...item,
        };
      }) || [];
    setDialogueList(list);
  }, [JSON.stringify(messages)]);

  return (
    <div className="main-panel-card message-panel">
      <div className="card main-panel-card-left">
        <div className="head">
          <h3>
            私信被举报用户：<span className="suspect">{suspect.nickname}</span>
          </h3>
          <span>
            <Tag>私信举报</Tag>
            <Tag>{part_zone_cn}</Tag>
          </span>
        </div>
        <div>用户举报类型：{reasons?.join('，')}</div>
        <div>举报时间：{reportTime || ''}</div>
        <Divider />
        <Dialogue dialogueList={dialogueList} contentIsHtml={true} />
      </div>
      <div className="main-panel-card-right">
        {showTags && <UserAction type={type} data={data} reloadCallBack={reloadCallBack} />}
        <div className="card">
          <UserInfo title="被举报人信息" {...suspect} />
          <UserInfo title="举报人信息" {...report} />
        </div>
      </div>
    </div>
  );
};

export default memo(MessagePanel);
