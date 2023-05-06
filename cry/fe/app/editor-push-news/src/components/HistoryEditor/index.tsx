import React, { useState } from 'react';
import { message, Switch } from 'antd';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from 'formik-antd';

import { useAuthContext } from '@/hooks';

import { PushHistoryItem } from '@/config/editorpush/history';
import { Auth_Remove_Title_Limit } from '@/config/account/account.config';
import { titleValidate, summaryValidate } from '@/validation/editorpush';

import './index.less';

export type HistoryEditorContent = Partial<PushHistoryItem>;

interface HistoryEditor {
  initial?: HistoryEditorContent;
  onSubmit: (value: HistoryEditorContent) => void;
}

// TODO 这里的权限取的应该是工具权限
export const HistoryEditor: React.FC<HistoryEditor> = ({ initial = {}, onSubmit }) => {
  const permission = useAuthContext('tools') as number[];

  const [titleLimit, setTitleLimit] = useState<boolean>(false);

  const handleLimitChange = (checked: boolean) => {
    if (!permission || permission.includes(Auth_Remove_Title_Limit) === false) {
      return message.warning('去除标题限制需要申请权限哦～');
    }
    setTitleLimit(checked);
  };

  return (
    <Formik initialValues={initial} onSubmit={onSubmit}>
      <Form className="content-editor" colon={false}>
        <div className="content-editor-item">
          <div className="content-editor-title">
            <label>推送标题</label>
            <span>
              去除标题字数限制：
              <Switch size="small" checked={titleLimit} onChange={handleLimitChange} />
            </span>
          </div>
          <Form.Item name="head" validate={value => titleValidate(value, titleLimit)}>
            <Input name="head" size="small" />
          </Form.Item>
        </div>
        <div className="content-editor-item">
          <label>推送摘要</label>
          <Form.Item name="news" validate={summaryValidate}>
            <Input.TextArea name="news" />
          </Form.Item>
        </div>
        <Form.Item name="submit">
          <SubmitButton loading={false}>提 交</SubmitButton>
        </Form.Item>
      </Form>
    </Formik>
  );
};
