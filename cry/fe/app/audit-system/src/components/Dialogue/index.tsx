/**
 * 对话组件 私信
 */
import React from 'react';

import { Checkbox } from 'antd';
import Image from '@/components/Dumb/Image';

import './index.less';

// 对话 item 属性
export interface messageItemProps {
  // 对话id
  id: string | number;
  // 是否为举报者(自己)
  reporter: boolean;
  //
  sendUserId: string | number;
  // 对话用户ID、头像、昵称
  user: {
    id: string | number;
    headImage: string;
    nickname: string;
  };
  // 对话内容
  content: {
    text?: string;
    image?: string;
    audio?: string;
    video?: string;
  };
  // 对话时间
  sendTime: string;
}

const Author: React.FC<{ item: messageItemProps }> = ({ item }) => {
  const { headImage = '', nickname = '' } = item?.user ?? {};
  return (
    <>
      <div className="avatar">
        <Image width={40} height={40} preview={false} src={headImage} />
      </div>
      <div className="nick-name">{nickname}</div>
    </>
  );
};

interface DialogueProps {
  // 对话列表
  dialogueList: messageItemProps[];
  // 联调内容是否可选择 checkbox
  canChoose?: boolean;
  // 渲染内容为 html 兼容私信审核的情况
  contentIsHtml?: boolean;
  // 可选时的初始值 对话 id 组成的数组
  defaultValue?: string[];
  // 选中对话 id 变化
  checkedChange?: (messageIds: string[]) => void;
}

const Dialogue: React.FC<DialogueProps> = ({ dialogueList, canChoose = false, contentIsHtml = false, defaultValue = [], checkedChange }) => {
  const onChange = (checkedValue: any[]) => {
    if (canChoose && typeof checkedChange === 'function') {
      checkedChange(checkedValue);
    }
  };

  return (
    <Checkbox.Group onChange={onChange} value={defaultValue}>
      <div className="dialogue">
        {dialogueList.map((item: messageItemProps, index: number) => {
          const { reporter = false, id = index, sendTime, content = {} } = item;
          const { text = '', image = '', video = '', audio = '' } = content ?? {};

          const contentHasContent = text || image || video || audio;

          return (
            <div className={`item ${reporter ? 'reporter' : ''}`} key={index}>
              <div className="author">
                {canChoose ? (
                  <Checkbox className="checkbox-wrapper" value={id}>
                    <Author item={item} />
                  </Checkbox>
                ) : (
                  <Author item={item} />
                )}
              </div>
              <div className="content-wrapper">
                {contentIsHtml ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: text ?? '',
                    }}
                    className={text ? 'content' : 'placeholder'}
                  />
                ) : (
                  <div className={contentHasContent ? 'content' : 'placeholder'}>
                    {/* text */}
                    {text ? text : null}
                    {/* image */}
                    {image ? <Image width={200} preview={false} src={image} /> : null}
                    {/* video */}
                    {video ? <video src={video} controls width={200} /> : null}
                    {/* audio */}
                    {audio ? <audio src={audio} controls /> : null}
                  </div>
                )}
                <div className="time">{sendTime}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Checkbox.Group>
  );
};

export default Dialogue;
