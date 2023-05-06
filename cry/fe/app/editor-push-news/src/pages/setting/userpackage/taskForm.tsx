import React, { useState, forwardRef, useImperativeHandle, useMemo, memo, useEffect } from 'react';
import { Form, Select, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as userpackageService from '@/services/userpackageService';
import { LabelList, TagLabelProps, UserTagListProps, UserTagProps, SearchFormProps } from '@/config/userpackage/userpackage';
import { defaultSearch, defaultUserTag } from '@/config/userpackage/userpackage.config';

const FormItem = Form.Item;

interface TaskFormConfig extends FormComponentProps {
  form: any;
  tasking: boolean;
  userTagSelected: UserTagProps;
  onUserTagChange: (val: UserTagProps) => void;
  onSubmit: (val: SearchFormProps) => void;
}
const TaskForm = forwardRef<FormComponentProps, TaskFormConfig>((props: TaskFormConfig, ref) => {
  const { form, tasking, onUserTagChange, onSubmit } = props;
  const { getFieldDecorator, validateFields } = form;
  useImperativeHandle(ref, () => ({
    form,
    selectUserTagChange: selectUserTagChange,
    handleFetchUserTagList: handleFetchUserTagList,
    onReset: onReset,
    setFormValue: onSetFormValue,
  }));
  const taskSearch = defaultSearch;
  // 大类
  const [tagLabel, setTagLabel] = useState<TagLabelProps>([]);
  // 小类
  const [subLabelList, setSubLabelList] = useState<LabelList>([]);
  const [userTagList, setUserTagList] = useState<UserTagListProps>([]);
  // 已选用户包
  const [userTagSelected, setUserTagSelected] = useState<UserTagProps>(defaultUserTag);

  useEffect(() => {
    handleFetchTagLabel();
    handleFetchUserTagList();
  }, []);
  // 获取大小类
  const handleFetchTagLabel = async () => {
    const { code, data, msg } = await userpackageService.queryTagLabel();
    if (code === 0) {
      setTagLabel(data);
    } else {
      message.error('获取大小类失败' + msg);
    }
  };
  // 获取用户包
  const handleFetchUserTagList = async () => {
    const { code, data, msg } = await userpackageService.queryUserTagTagList();
    if (code === 0) {
      setUserTagList(data.userTagList);
    } else {
      message.error('获取用户包失败:' + msg);
    }
  };
  // 大类改变
  const selectLabelChange = (value: string) => {
    const smallLabel = tagLabel.filter(item => item.labelName === value)[0].subLabelList;
    setSubLabelList(smallLabel);
  };
  // 用户包选择
  const selectUserTagChange = (value: string) => {
    const selectUserTag = userTagList.filter(item => item.userTagCode === value)[0];
    setUserTagSelected(selectUserTag);
    onUserTagChange(selectUserTag);
    console.log(userTagSelected);
  };
  // 提交
  const handleSubmit = (e: any) => {
    e.preventDefault();
    validateFields((err: any, values: SearchFormProps) => {
      if (!err) {
        const { primaryLabel = '', subLabel = '', keywords = '', userTagCode } = values;
        if (!primaryLabel && !keywords) {
          message.error('请增加筛选条件');
          return;
        }
        taskSearch.primaryLabel = primaryLabel;
        taskSearch.subLabel = subLabel;
        taskSearch.keywords = keywords;
        taskSearch.userTagCode = userTagCode;
        onSubmit(taskSearch);
        console.log('Received values of form: ', taskSearch);
      }
    });
  };

  // 设置表单的值
  const onSetFormValue = (val: SearchFormProps) => {
    form.setFieldsValue(val);
    selectUserTagChange(val.userTagCode);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setUserTagSelected(defaultUserTag);
  };

  return (
    <>
      <Form layout="inline" onSubmit={e => handleSubmit(e)}>
        <FormItem label="大类">
          {getFieldDecorator('primaryLabel', {
            // rules: [{ required: false, message: '请选择大类' }],
          })(
            <Select
              style={{ minWidth: '200px' }}
              placeholder="请选择大类"
              disabled={tasking}
              onChange={(value: string) => selectLabelChange(value)}
              showSearch
              optionFilterProp="children"
              filterOption={(input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {tagLabel.map((item: any, index: number) => {
                return (
                  <Select.Option value={item.labelName} key={index}>
                    {item.labelName}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem label="小类">
          {getFieldDecorator(
            'subLabel',
            {},
          )(
            <Select
              style={{ minWidth: '200px' }}
              placeholder="请选择小类"
              disabled={tasking}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {subLabelList.map((item: any, index: number) => {
                return (
                  <Select.Option value={item.labelName} key={index}>
                    {item.labelName}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem label="关键词">
          {getFieldDecorator('keywords', {
            // rules: [{ required: false, message: '请选择关键词' }],
          })(
            <Select
              mode="tags"
              tokenSeparators={[',']}
              style={{ minWidth: 200, maxWidth: 400 }}
              placeholder="关键词(多个以半角,分隔)"
              disabled={tasking}
              allowClear
            />,
          )}
        </FormItem>
        <FormItem label="目标用户包">
          {getFieldDecorator('userTagCode', {
            rules: [{ required: true, message: '请选择用户包' }],
          })(
            <Select
              style={{ minWidth: '200px' }}
              placeholder="请选择目标用户包"
              disabled={tasking}
              showSearch
              optionFilterProp="children"
              filterOption={(input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value: string) => selectUserTagChange(value)}
            >
              {userTagList.map((item: any, index: number) => {
                return (
                  <Select.Option value={item.userTagCode} key={index}>
                    {item.userTagName}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
          {userTagSelected?.todayIncre >= 0 && <div className="user-tag-tip">*该用户包今日已添加{userTagSelected.todayIncre}条内容</div>}
        </FormItem>
        <FormItem style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" disabled={tasking} className="search-btn">
            领取任务
          </Button>
        </FormItem>
      </Form>
    </>
  );
});

export default Form.create<TaskFormConfig>()(TaskForm);
