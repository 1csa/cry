/**
 * 没有复用form 单独重新搞个分段式form
 * 因为自动填充title summary问题很多 model需要改动的代码较多 还是按照原来的逻辑实现
 */

import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { message, Switch, Tag, Modal, Divider, Button } from 'antd';
import { useField, useFormikContext } from 'formik';
import { FormItem, Input, Select } from 'formik-antd';
import { useSelector, useDispatch } from 'dva';

import { DocidForm, TitleForm, SummaryForm } from '@/config/editorpush/push';
import { pushTaskListSelector, pushsectiondocInfoSelector, catemapSelector } from '@/selectors/editorpush';
import { requiredValidate, summaryValidate, titleValidate } from '@/validation/editorpush';
import { PushHistoryItem } from '@/config/editorpush/history';
import { getDocinfo } from '@/services/editorpushService';
import { getPushHistory } from '@/services/historyService';
import { rs_type_map } from '@/data';
import { useDebounceFunc } from '@/hooks';
import { parseselect, getStrLen } from '@/utils';

interface FormikItemProps {
  fieldname: string;
  fielditem: React.ReactElement;
}

export const FormikPushContent: React.FC<FormikItemProps> = React.memo(({ fieldname, fielditem }) => {
  const [_, { value }] = useField(fieldname);
  return React.cloneElement(fielditem, { [fieldname]: value });
});

/**
 * @returns 内容类型select
 * @param index index为对应实验的index
 */
export const TypeFormItem: React.FC<{ index?: number }> = React.memo(({ index }) => {
  const validator = (value: string) => requiredValidate(value, '内容类型');

  return (
    <FormItem className="form-item" name={`section.test${index}.rstype`} label="内容类型" required={true} validate={validator}>
      <Select name={`section.test${index}.rstype`}>{parseselect(rs_type_map)}</Select>
    </FormItem>
  );
});

/**
 * @returns 文章docid
 * @param index index为对应实验的index
 */
export const DocidFormItem: React.FC<DocidForm> = React.memo(({ rstype, index }) => {
  const dispatch = useDispatch();
  const [_, { value: pushType }] = useField('pushType'); // 获取模版对应字段
  const taskLists = useSelector(pushTaskListSelector); // history历史数据
  const docinfo = useSelector(pushsectiondocInfoSelector);
  const cateLists = useSelector(catemapSelector); // cate对应的映射
  const formik = useFormikContext();

  const [showWarning, setShowWarning] = useState<boolean>(false); // 展示已经推送的数据的警告
  const [showBreakAllWarning, setShowBreakAllWarning] = useState<boolean>(false); // 展示已经推送的数据的警告
  const [repeatHistroy, setRepeatHistroy] = useState<Array<PushHistoryItem>>([]); // 重复的历史数据

  // const [error, setError] = useState<string>(''); //docid问题提示 用于解决formik校验问题
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (checked: boolean) => setChecked(checked);
  // 获取历史数据docid的数组
  let historyDocidArr = useMemo(() => taskLists.map(item => item.doc_id), [taskLists]);

  const validator = useCallback((value: string) => docinfo[`error${index}`] || requiredValidate(value, '文章ID'), [docinfo[`error${index}`]]);

  const handleInfoFill = useDebounceFunc((docid: string) => {
    dispatch({
      type: 'editorpush/fetchDocInfo',
      payload: { docid, index },
    });
  }, 500);

  const handleDocChange = ({ target: { value = '' } }: any) => {
    //React.SyntheticEvent<HTMLInputElement>上没target value一直报错 受不了了
    if (checked) {
      return message.warning('文案已经锁定');
    }
    if (!value) {
      return message.warning('请输入文章ID');
    }
    handleInfoFill(value);
  };

  useEffect(() => {
    // 自动补全docid暂时没用
    if (!docinfo[`docid${index}`]) {
      return;
    }
    formik.setFieldValue(`section.test${index}.docid`, docinfo[`docid${index}`], true);
  }, [docinfo[`docid${index}`]]);

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
      showModal(tempValue, 7);
    }
  };

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
      name={`section.test${index}.doc_id`}
      label="文章ID"
      required={['theme'].includes(rstype) == false}
      validate={['theme'].includes(rstype) == false ? validator : undefined}
    >
      <Input name={`section.test${index}.doc_id`} onPressEnter={handleDocChange} onBlur={handleDocChange} onChange={handleDocTest} />
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
/**
 * @returns 标题
 * @param index index为对应实验的index
 */
export const TitleFormItem: React.FC<TitleForm> = React.memo(({ index }) => {
  const formik = useFormikContext();
  const docinfo = useSelector(pushsectiondocInfoSelector);
  const [checked, setChecked] = useState<boolean>(false);
  const [textNum, setTextNum] = useState<number>(0);
  const handleChange = (checked: boolean) => setChecked(checked);
  const validate = (value: string) => titleValidate(value, checked); //增加校验

  useEffect(() => {
    // 自动补全title
    if (!docinfo[`title${index}`]) {
      return;
    }
    formik.setFieldValue(`section.test${index}.title`, docinfo[`title${index}`], true);
  }, [docinfo[`title${index}`]]);

  const handleChangeText = (e: any) => {
    let value = e.target.value;
    setTextNum(getStrLen(value));
  };

  return (
    <FormItem className="form-item" name={`section.test${index}.title`} label="标题" required validate={validate}>
      <Input name={`section.test${index}.title`} placeholder="请输入标题，建议不超过18字" onChange={handleChangeText} />
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

/**
 * @returns 摘要
 * @param index index为对应实验的index
 */
export const SummaryFormItem: React.FC<SummaryForm> = React.memo(({ index }) => {
  const formik = useFormikContext();
  const validate = (value: string) => summaryValidate(value);
  const docinfo = useSelector(pushsectiondocInfoSelector);
  const [textNum, setTextNum] = useState<number>(0);

  useEffect(() => {
    // 自动补全summary
    if (!docinfo[`summary${index}`]) {
      return;
    }
    formik.setFieldValue(`section.test${index}.summary`, docinfo[`summary${index}`], true);
  }, [docinfo[`summary${index}`]]);

  const handleChangeText = (e: any) => {
    let value = e.target.value;
    setTextNum(getStrLen(value));
  };

  return (
    <FormItem className="form-item" name={`section.test${index}.summary`} label="摘要" required validate={validate} style={{ display: 'flex' }}>
      <Input.TextArea
        autoSize={{ maxRows: 3 }}
        name={`section.test${index}.summary`}
        placeholder="请输入摘要，建议不超过62字"
        onChange={handleChangeText}
        style={{ height: '75px' }}
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
