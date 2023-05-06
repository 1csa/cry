import React, { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { FormItem, Switch } from 'formik-antd';
import { Tooltip, Icon } from 'antd';
import { push_type_schema, test_message, request_section_msg, observeTimeAuto, observeTimeAutoBreak } from '@/config/editorpush/push.config';
import * as ContentForms from './forms';
import Section from './section';
import { useDispatch } from 'dva';

interface PushContent {
  rstype: string;
}
interface FormikPushContent {}

const TypeFormItem = ContentForms.TypeFormItem;

const PushContent: React.FC<PushContent> = React.memo(({ rstype }) => {
  const [_, { value: pushType }] = useField('pushType'); // 获取模版对应字段
  const [__, { value: open_sectional }] = useField('open_sectional'); // 获取模版对应字段

  const formik = useFormikContext();
  const [showSection, setShowSection] = useState<boolean>(false); // 是否开启分段式分发
  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };
  let observeTime = observeTimeAuto;
  if (pushType === 'auto_break') {
    observeTime = observeTimeAutoBreak
  }
  // 打开分段式 设置values字段 默认实验组1
  const handleValueChange = (checked: boolean) => {
    setShowSection(checked);
    formik.setFieldValue('open_sectional', checked);
    if (checked) {
      formik.setFieldValue('group', 'group1');
      formik.setFieldValue('observeTime', observeTime);
      formik.setFieldValue('groupmsg', request_section_msg['group1']);
    }
  };

  useEffect(() => {
    // 切换temp时 清除副作用
    return () => {
      setShowSection(false);
    };
  }, [pushType]);

  useEffect(() => { // 可能有bug关注一下 推送后清除open_sectional字段 关闭分段式
    setShowSection(open_sectional);
  }, [open_sectional]);

  return (
    <>
      {(pushType === 'auto' || pushType === 'auto_break') && ( // 当在局部个性化时候开启分段式分发
        <>
          <span>分段式分发:</span>
          <FormItem name="open_sectional" style={{ display: 'inline-block', marginBottom: '10px' }}>
            <Switch name="open_sectional" onChange={handleValueChange} defaultChecked={false} style={{ marginLeft: '40px' }} />
          </FormItem>
          {showSection && (
            <Tooltip placement="bottom" title={test_message}>
              <Icon type="question-circle" style={{ marginLeft: '20px' }} />
            </Tooltip>
          )}
        </>
      )}
      {showSection ? (
        <Section rstype={rstype} />
      ) : (
        <>
          <TypeFormItem />
          {rstype
            ? push_type_schema[rstype].forms.map(item => {
                const name = genFormName(item);
                return name ? React.createElement(ContentForms[name], { key: item, name: push_type_schema[rstype].name, rstype }) : null;
              })
            : null}
        </>
      )}
    </>
  );
});

export const FormikPushContent: React.FC<FormikPushContent> = React.memo(({}) => {
  const dispatch = useDispatch();
  const [_, { value: rstype }] = useField('rstype');

  useEffect(() => {
    return () => {
      dispatch({
        type: 'editorpush/updateDocInfo',
        payload: { docinfo: { docid: '', title: '', summary: '', error: '' } },
      });
    };
  }, []);

  return <PushContent rstype={rstype} />;
});
