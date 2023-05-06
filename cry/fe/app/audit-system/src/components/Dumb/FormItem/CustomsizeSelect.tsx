/**
 * 基础下拉选择组件 属性可按照需求扩展
 */
import React from 'react';
import { Form, Select } from 'antd';

import { BaseFormModelType, SelectOptionsType } from '@/types';

const { Option } = Select;

interface ICustomizeSelect {
  selectProps: BaseFormModelType;
  handleChange: (value: any) => void;
  disabled?: boolean; // 额外的是否禁用 在业务组件的时候传递一个使三个联动都禁止选择
}

const CustomizeSelect: React.FC<ICustomizeSelect> = ({ selectProps, handleChange, disabled }) => {
  /**
   * 多选的回调函数
   * @param value:[] 数组参数
   */
  const onMultipleChange = (value: number[]) => {
    // 处理父组件的回调 有onchange的数据才会调用
    handleChange && handleChange(value);
  };

  /**
   * 普通select
   * @param value:[] 数组参数
   */
  const onChange = (value: number) => {
    // 处理父组件的回调 有onchange的数据才会调用
    handleChange && handleChange(value);
  };

  /**
   * 必须先判断 再用item 包装 否则会报错name属性 导致一些表单的校验失败
   */
  return (
    <>
      {selectProps?.type === 'select' ? (
        <Form.Item label={selectProps?.label} name={selectProps?.name} rules={selectProps?.rules}>
          <Select
            allowClear={selectProps?.allowClear === false ? false : true}
            style={{ width: selectProps?.width || 200 }}
            placeholder={selectProps?.placeholder || `请选择${selectProps?.label}`}
            onChange={selectProps?.onChange ? onChange : () => {}}
            disabled={disabled || selectProps?.disabled}
          >
            {selectProps?.sourceData &&
              selectProps?.sourceData?.map((ele: SelectOptionsType) => {
                return (
                  <Option key={ele.value} value={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      ) : null}
      {selectProps?.type === 'multiple' ? (
        <Form.Item label={selectProps?.label} name={selectProps?.name} rules={selectProps?.rules}>
          <Select
            allowClear={selectProps?.allowClear === false ? false : true}
            style={{ width: selectProps?.width, minWidth: 300 }}
            mode="multiple"
            placeholder={selectProps?.placeholder || `请选择${selectProps?.label}`}
            onChange={selectProps?.onChange ? onMultipleChange : () => {}}
            disabled={selectProps?.disabled}
          >
            {selectProps?.sourceData &&
              selectProps?.sourceData?.map((ele: SelectOptionsType) => {
                return (
                  <Option key={ele.value} value={ele.value}>
                    {ele.label}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      ) : null}
    </>
  );
};

export default CustomizeSelect;
