import React from 'react';
import clsx from 'clsx';
import { Icon, Button, Tag, Tooltip } from 'antd';
import { ListRowProps } from 'react-virtualized';

import { CompetitorMonitorProps } from '@/config/competitor/competitor';
import { comp_hotpot_map, comp_status_map } from '@/data';
import { isLegalUrl } from '@/utils';
import { sendLog } from '@/services/sendLog';
interface ListItemProp extends ListRowProps {
  monitorList: CompetitorMonitorProps[];
  onCopyText: (text: string) => void;
  onFastPush: (docid?: string) => void;
  onSetHotpop: (row: CompetitorMonitorProps) => void;
}

export const ListItem: React.FC<ListItemProp> = React.memo(({ index, isVisible, key, style, monitorList, onCopyText, onFastPush, onSetHotpop }) => {
  const row = monitorList[index];
  const className = clsx({ isVisible: isVisible, 'monitor-list-item': true });

  const urlChange = (URI: string) => {
    // 把带%转化一下
    if (URI.indexOf('%') > -1) {
      return URI.replace(/%/g, '%25');
    } else {
      return URI;
    }
  };

  const handleJumpUrl = (row: CompetitorMonitorProps): string => {
    let params = `push_title=${encodeURIComponent(urlChange(row.push_title))}&push_abstract=${encodeURIComponent(urlChange(row.push_abstract))}`;
    return `http://pandora.yidian-inc.com/tools/newspublish?${params}`;
  };

  return (
    <div key={key} className={className} style={style}>
      <div className="monitor-list-item-index">{index + 1}</div>
      <div className="monitor-list-item-content">
        <div className="monitor-list-item-title">
          <h3>
            {row.content_link && isLegalUrl(row.content_link) ? (
              <a
                href={row.content_link}
                target="_blank"
                onClick={() => {
                  sendLog({
                    page: 'editor_push_news',
                    action_id: 'title',
                    context: `${row.app_name}+${row.push_abstract}+${row.device_id}+${row.date}`,
                  });
                }}
              >
                {row.push_title}
              </a>
            ) : (
              <span>{row.push_title}</span>
            )}
            <Icon type="copy" onClick={() => onCopyText(row.push_title)} />
          </h3>
          {row.sct && <Tag color="#faad14">{row.sct}</Tag>}
          {row.app_name && <Tag color="#2db7f5">{row.app_name}</Tag>}
          {row.date && <Tag color="#87d068">{row.date}</Tag>}
          {row.hotspot && <Tag color="#108ee9">{comp_hotpot_map[row.hotspot]}</Tag>}
          {row.pub_status !== undefined ? (
            row.content_link && isLegalUrl(row.content_link) ? (
              <Tooltip placement="topRight" title={row.pub_memo || ''}>
                <Tag color="#f5222d">{comp_status_map[row.pub_status]}</Tag>
              </Tooltip>
            ) : (
              <Tag color="#f5222d">无URL</Tag>
            )
          ) : null}
        </div>
        <div className="monitor-list-item-abstract">
          <p>
            <span>{row.push_abstract}</span>
            <Icon type="copy" onClick={() => onCopyText(row.push_abstract)} />
          </p>
        </div>
        <div className="monitor-list-item-other">
          <span>厂商：{row.brand}</span>
          <span>设备号：{row.device_id}</span>
          <span>机型：{row.bundle_version}</span>
        </div>
      </div>
      <div className="monitor-list-item-operation">
        <div>
          <Button size="small" type="link" onClick={() => onSetHotpop(row)}>
            设置热点
          </Button>
        </div>
        <div>
          {row.content_link && isLegalUrl(row.content_link) && row.pub_status === 1 ? (
            <Button
              size="small"
              type="link"
              onClick={() => {
                sendLog({
                  page: 'push_competitor_monitor',
                  action_id: 'push',
                  context: `${row.app_name}+${row.push_abstract}+${row.device_id}+${row.date}`,
                });
                onFastPush(row.doc_id);
              }}
            >
              快速推送
            </Button>
          ) : (
            <Button
              size="small"
              type="link"
              target="_blank"
              href={handleJumpUrl(row)}
              onClick={() => {
                sendLog({
                  page: 'push_competitor_monitor',
                  action_id: 'publish',
                  context: `${row.app_name}+${row.push_abstract}+${row.device_id}+${row.date}`,
                });
              }}
            >
              一键发布
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
