import React, { useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Form, Select, Input, Radio, DatePicker, SubmitButton, ResetButton } from 'formik-antd';

import { HistoryFormScreen } from '@/config/editorpush/history';
import { hot_level_map, business_map, push_type_map, yes_no_map, platform_map } from '@/data';
import { parseselect, parseradio, isEmpty } from '@/utils';
import { orderByData } from './config';

import './index.less';

interface HistoryScreen {
  cates: Record<string, string>;
  onSubmit: (value: HistoryFormScreen) => void;
}

export const InitialFormScreen: HistoryFormScreen = {};

export const HistoryScreen: React.FC<HistoryScreen> = React.memo(({ cates = {}, onSubmit }) => {
  const [screenDate, setScreenDate] = useState<string>();

  const handleScreenSubmit = (values: HistoryFormScreen) => {
    const orderByArr = (values['orderBy'] || '').split('-')
    if (orderByArr.length === 2) {
      const sort = orderByArr[0]
      const order = orderByArr[1]
      values['sort'] = sort
      values['order'] = order
    } else {
      values['sort'] = ''
      values['order'] = ''
    }
    if (values.operator) {
      values.operator = values.operator.trim();
    }
    if (screenDate) {
      return onSubmit({ ...values, d: screenDate });
    }
    return onSubmit(values);
  };

  return (
    <div>
      <Formik<HistoryFormScreen> initialValues={InitialFormScreen} onSubmit={handleScreenSubmit}>
        <Form className="history-screen" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} labelAlign="right" layout="vertical">
          <Form.Item name="doc_id" label="docid">
            <Input name="doc_id" placeholder="请输入docid" />
          </Form.Item>
          <Form.Item name="biz_id" label="业务线">
            <Select name="biz_id" allowClear>
              {parseselect(business_map)}
            </Select>
          </Form.Item>
          <Form.Item name="push_id" label="推送ID">
            <Input name="push_id" placeholder="请输入新或老PushId" />
          </Form.Item>
          <Form.Item name="keywords" label="关键词">
            <Input name="keywords" placeholder="支持标题/摘要模糊搜索" />
          </Form.Item>
          <Form.Item name="operator" label="邮箱前缀">
            <Input name="operator" placeholder="请输入操作人邮箱前缀" />
          </Form.Item>
          <Form.Item name="userids" label="推送类别">
            <Select name="userids" allowClear placeholder="请选择推送类型">
              {parseselect(push_type_map)}
            </Select>
          </Form.Item>
          <Form.Item name="cate" label="分类">
            <Select name="cate" allowClear placeholder="请选择分类">
              {parseselect(cates)}
            </Select>
          </Form.Item>
          <Form.Item name="platform" label="平台">
            <Select name="platform" allowClear placeholder="请选择平台">
              {parseselect(platform_map)}
            </Select>
          </Form.Item>
          <Form.Item name="hot_level" label="热点等级">
            <Select name="hot_level" allowClear placeholder="请选择热点等级">
              {parseselect(hot_level_map)}
            </Select>
          </Form.Item>
          <Form.Item name="xiaomi_priority" label="是否高优">
            <Radio.Group name="xiaomi_priority">{parseradio(yes_no_map)}</Radio.Group>
          </Form.Item>
          <Form.Item name="orderBy" label="数据排序">
            <Select name="orderBy" allowClear placeholder="请选择排序方式">
              {
                orderByData.map(item => {
                  return (
                    <Select.Option key={item.value}> {item.label} </Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="d" label="创建时间">
            {/* 这是个formik-antd的bug，git issue 对应提供了一个useStingValue的pr解决方案，需要升级formik版本*/}
            {/* demo 个人觉得不是很优雅, 所以这里使用setState的方式做中间处理 */}
            <DatePicker style={{ width: '100%' }} name="d" format="YYYY-MM-DD" onChange={(_: any, date: string) => setScreenDate(date)} />
          </Form.Item>
          <Form.Item className="history-screen-operation" name="submit" wrapperCol={{ span: 24 }}>
            <SubmitButton size="small" loading={false}>
              提交
            </SubmitButton>
            <ResetButton size="small" onClick={()=>setScreenDate('')}>重置</ResetButton>
          </Form.Item>
        </Form>
      </Formik>
    </div>
  );
});
