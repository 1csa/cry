import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { message, Switch, Modal, Tag, Divider, Button } from 'antd';
import { useField, useFormikContext } from 'formik';
import { FormItem, Input, Select } from 'formik-antd';
import { useSelector, useDispatch, useLocation } from 'dva';
import { DocidForm, TitleForm, SummaryForm, TabForm, TalkForm, ThemeForm, UrlForm, ChannelForm } from '@/config/editorpush/push';
import { pushTaskListSelector, pushdocInfoSelector, catemapSelector } from '@/selectors/editorpush';
import { requiredValidate, summaryValidate, titleValidate } from '@/validation/editorpush';
import { PushHistoryItem } from '@/config/editorpush/history';
import { rs_type_map, bottom_tab_map } from '@/data';
import { useDebounceFunc } from '@/hooks';
import { parseselect, getStrLen } from '@/utils';
import { getPushHistory } from '@/services/historyService';

interface FormikItemProps {
  fieldname: string;
  fielditem: React.ReactElement;
}

export const FormikPushContent: React.FC<FormikItemProps> = React.memo(({ fieldname, fielditem }) => {
  const [_, { value }] = useField(fieldname);

  return React.cloneElement(fielditem, { [fieldname]: value });
});
// 内容类型
// 这个不知道为啥校验出不来，待找原因
export const TypeFormItem: React.FC<{}> = React.memo(() => {
  const validator = (value: string) => requiredValidate(value, '内容类型');

  return (
    <FormItem className="form-item" name="rstype" label="内容类型" required={true} validate={validator}>
      <Select name="rstype">{parseselect(rs_type_map)}</Select>
    </FormItem>
  );
});

// 文章docid
export const DocidFormItem: React.FC<DocidForm> = React.memo(({ rstype }) => {
  const dispatch = useDispatch();
  const [_, { value: pushType }] = useField('pushType'); // 获取模版对应字段
  const [__, { value: biz_id }] = useField('biz_id'); // 获取模版对应字段
  const taskLists = useSelector(pushTaskListSelector); // history历史数据
  const docinfo = useSelector(pushdocInfoSelector); // reducer里的doc信息
  const cateLists = useSelector(catemapSelector); // cate对应的映射

  const formik = useFormikContext();

  const [showWarning, setShowWarning] = useState<boolean>(false); // 展示已经推送的数据的警告
  const [showBreakAllWarning, setShowBreakAllWarning] = useState<boolean>(false); // 展示已经推送的数据的警告
  const [repeatHistroy, setRepeatHistroy] = useState<Array<PushHistoryItem>>([]); // 重复的历史数据
  const [checked, setChecked] = useState<boolean>(false); // 文案锁定开关

  const handleChange = (checked: boolean) => setChecked(checked); // 文案锁定

  const { query } = (useLocation() as unknown) as { query: Record<string, any> }; //url query参数
  // 获取历史数据docid的数组
  let historyDocidArr = useMemo(() => taskLists.map(item => item.doc_id), [taskLists]);

  const validator = useCallback((value: string) => docinfo.error || requiredValidate(value, '文章ID'), [docinfo.error]);

  const handleInfoFill = useDebounceFunc((docid: string) => {
    dispatch({
      type: 'editorpush/fetchDocInfo',
      payload: { docid, biz_id },
    });
  }, 500);

  const handleDocChange = ({ target: { value = '' } }: any) => {
    // React.SyntheticEvent<HTMLInputElement>上没target
    if (checked) {
      return message.warning('文案已经锁定');
    }
    if (!value) {
      return message.warning('请输入文章ID');
    }
    if (biz_id === 'LIFE') {
      return;
    }
    handleInfoFill(value);
  };

  const showModal = useDebounceFunc((doc_id: string, days: number) => {
    // 加个防抖
    getPushHistory({ doc_id, history_days: days }).then(res => {
      // 请求历史数据接口 docid + 时间参数(天)
      let historyList = res.result?.task_history;
      if (res.status === 'success' && res.code === 0 && historyList && historyList.length > 0) {
        setRepeatHistroy(historyList.filter(item => item.doc_id === doc_id)); // 获取重复的历史数据
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    });
  }, 500);

  // docid重复推送的提示事件 不禁止提交 只是提示作用
  const handleDocTest = ({ target: { value = '' } }: React.ChangeEvent<HTMLInputElement>) => {
    let tempValue = value.trim();
    if (tempValue) {
      // 如果docid存在
      showModal(tempValue, 7); // 按照docid搜索历史数据
    }
  };

  useEffect(() => {
    // 从channle工具跳转到push,url携带query: {docid}
    if (query.docid && location.href.indexOf('docid=') > -1) {
      handleInfoFill(query.docid);
    }
    if (!docinfo.docid) {
      return;
    }
    formik.setFieldValue('doc_id', docinfo.docid, true);
  }, [docinfo.docid]);

  // 获取历史数据docid的数组
  useEffect(() => {
    let ary = taskLists.filter(item => item.type === '全量突发(all_break)');
    let isInAnhour =
      ary.length > 0 &&
      ary.some(item => {
        // push的时间在一小时之内 用当前时间减去createtime大于3600000ms
        return Date.now() - new Date(item.create_time).getTime() < 3600000; // 单位毫秒
      });
    setShowBreakAllWarning(isInAnhour);
  }, [taskLists]);

  return (
    <FormItem
      className="form-item"
      name="doc_id"
      label="文章ID"
      required={['theme'].includes(rstype) == false}
      validate={['theme'].includes(rstype) == false ? validator : undefined}
    >
      <Input name="doc_id" autoComplete='off' onPressEnter={handleDocChange} onBlur={handleDocChange} onChange={handleDocTest} />
      <span style={{ marginLeft: '15px' }}>文案锁定</span>
      <Switch defaultChecked={false} style={{ marginLeft: '10px' }} onChange={handleChange} />
      {Boolean(showBreakAllWarning && !showWarning && pushType !== 'userids') && ( //主端useid没有 和下面不同时存在
        <span style={{ color: 'red', marginLeft: '10px' }}>一小时内已推送过全量push</span>
      )}
      <Modal
        visible={showWarning}
        onCancel={() => {
          setShowWarning(false);
        }}
        maskClosable={false}
        title="最近7天已推送过该文章"
        centered
        footer={[
          <Button
            key="back"
            onClick={() => {
              setShowWarning(false);
            }}
          >
            继续推送
          </Button>,
        ]}
      >
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          {repeatHistroy.map(item => (
            <div key={item.id}>
              <p>{item.head}</p>
              <p>{item.news}</p>
              <Tag color="green">{item.type}</Tag>
              <Tag color="blue">{item.operator}</Tag>
              <Tag color="red">{cateLists[item.cate]}</Tag>
              {Array.isArray(item.channel) &&
                item.channel.map((tag: string) => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              <Divider />
            </div>
          ))}
        </div>
      </Modal>
    </FormItem>
  );
});

// 标题
export const TitleFormItem: React.FC<TitleForm> = React.memo(() => {
  const formik = useFormikContext();
  const docinfo = useSelector(pushdocInfoSelector);
  const [textNum, setTextNum] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (checked: boolean) => setChecked(checked);
  const validate = (value: string) => titleValidate(value, checked); //增加校验

  useEffect(() => {
    if (!docinfo.title) {
      return;
    }
    formik.setFieldValue('title', docinfo.title, true);
  }, [docinfo.title]);

  const handleChangeText = (e: any) => {
    let value = e.target.value;
    setTextNum(getStrLen(value));
  };

  return (
    <FormItem className="form-item" name="title" label="标题" required validate={validate}>
      <Input name="title" placeholder="请输入标题，建议不超过18字" onChange={handleChangeText} />
      <span style={{ marginLeft: '15px' }}>去除标题字数限制:</span>
      <Switch defaultChecked={false} style={{ marginLeft: '10px' }} onChange={handleChange} />
      <div>
        {textNum > 0 && (
          <span style={{ marginLeft: '10px' }}>
            你已经输入了<span style={{ color: 'red' }}>{textNum}</span>个字
          </span>
        )}
      </div>
    </FormItem>
  );
});

// 摘要
export const SummaryFormItem: React.FC<SummaryForm> = React.memo(() => {
  const formik = useFormikContext();
  const docinfo = useSelector(pushdocInfoSelector);
  const validate = (value: string) => summaryValidate(value);
  const [textNum, setTextNum] = useState<number>(0);

  useEffect(() => {
    if (!docinfo.summary) {
      return;
    }
    formik.setFieldValue('summary', docinfo.summary, true);
  }, [docinfo.summary]);

  const handleChangeText = (e: any) => {
    let value = e.target.value;
    setTextNum(getStrLen(value));
  };

  return (
    <FormItem className="form-item" name="summary" label="摘要" required validate={validate} style={{ display: 'flex' }}>
      <Input.TextArea
        autoSize={{ minRows: 2, maxRows: 3 }}
        name="summary"
        placeholder="请输入摘要，建议不超过62字"
        style={{ height: '75px' }}
        onChange={handleChangeText}
      />
      <div>
        {textNum > 0 && (
          <span style={{ marginLeft: '10px' }}>
            你已经输入了<span style={{ color: 'red' }}>{textNum}</span>个字
          </span>
        )}
      </div>
    </FormItem>
  );
});

export const TalkFormItem: React.FC<TalkForm> = ({ name }) => {
  const validator = (value: string) => requiredValidate(value, '话题ID');
  return (
    <FormItem className="form-item" name={name ? `${name}.talk_id` : 'talk_id'} label="话题ID" required validate={validator}>
      <Input name={name ? `${name}.talk_id` : 'talk_id'} />
    </FormItem>
  );
};

export const ChannelFormItem: React.FC<ChannelForm> = ({ name }) => {
  const validator = (value: string) => requiredValidate(value, 'fromid');
  return (
    <FormItem className="form-item" name={name ? `${name}.from_id` : 'from_id'} label="fromid" required validate={validator}>
      <Input name={name ? `${name}.from_id` : 'from_id'} />
    </FormItem>
  );
};

// 这里url的url实际改的是docid
export const UrlFormItem: React.FC<UrlForm> = ({ name }) => {
  const validator = (value: string) => requiredValidate(value, 'URL链接');
  return (
    <FormItem className="form-item" name="doc_id" label="URL链接" required validate={validator}>
      <Input name="doc_id" />
    </FormItem>
  );
};

// 这里theme的theme实际改的是docid
export const ThemeFormItem: React.FC<ThemeForm> = ({ name }) => {
  const validator = (value: string) => requiredValidate(value, '主题ID');
  return (
    <FormItem className="form-item" name="doc_id" label="主题ID" required validate={validator}>
      <Input name="doc_id" />
    </FormItem>
  );
};

export const TabFormItem: React.FC<TabForm> = ({ name }) => {
  const validator = (value: string) => requiredValidate(value, '底栏Tab');
  return (
    <FormItem className="form-item" name={name ? `${name}.tab` : 'tab'} label="底栏Tab" required validate={validator}>
      <Select name={name ? `${name}.tab` : 'tab'}>{parseselect(bottom_tab_map)}</Select>
    </FormItem>
  );
};
