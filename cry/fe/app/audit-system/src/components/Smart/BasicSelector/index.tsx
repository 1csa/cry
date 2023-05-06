/**
 * 业务组件 传入一个接口地址 然后渲染不同的业务组件
 */
import React, { useState, useEffect } from 'react';
import { Form, Select, message } from 'antd';
import { SelectOptionsType, BaseFormModelType, ApiResponseProps } from '@/types';

const { Option } = Select;

export interface IBasicSelector {
  selectProps: BaseFormModelType;
  servicesFunction: (params?: any) => Promise<ApiResponseProps>;
  cascaderOptions?: {
    paramsKey: string; // fun的 请求参数
    cascaderKey: string; // 下一个联动的key
    fun: (params?: any) => Promise<ApiResponseProps>; // 联动接口
    callbackData?: (parmas?: any) => void; // 联动完成数据回传 的callback
  };
}

const BasicSelector: React.FC<IBasicSelector> = ({ selectProps, servicesFunction, cascaderOptions }) => {
  const [sourceData, setSourceData] = useState<any[]>([]);

  const requestList = async (fn: (params?: any) => Promise<ApiResponseProps>) => {
    try {
      const { errorno, data, desc } = await fn();
      if (errorno === 0) {
        const dataList = Array.isArray(data) ? data : [];
        return dataList;
      } else {
        message.error(`获取菜单接口失败，原因：${desc}`);
        return [];
      }
    } catch (error) {
      message.error(`获取菜单接口失败，原因：${error}`);
      return [];
    }
  };

  const handleInitList = async () => {
    const data = await requestList(servicesFunction);
    setSourceData(data!);
  };

  // 联动之后 将数据先传递到formModel里的callbackData中，再由 formModel里的函数勾住index.tsx里的数据
  const handleChangeItem = async (val: number) => {
    if (cascaderOptions) {
      const data = val ? await requestList(() => cascaderOptions?.fun({ [cascaderOptions.paramsKey]: val })) : [];
      cascaderOptions?.callbackData && cascaderOptions.callbackData({ [cascaderOptions.cascaderKey]: data });
    }
  };

  useEffect(() => {
    handleInitList();
  }, []);

  return (
    <Form.Item label={selectProps?.label} name={selectProps?.name} rules={selectProps?.rules}>
      <Select
        allowClear={selectProps?.allowClear === false ? false : true}
        style={{ width: selectProps?.width || 200 }}
        placeholder={selectProps?.placeholder || `请选择${selectProps?.label}`}
        onChange={handleChangeItem}
        // showSearch
        // filterOption={false}
        // notFoundContent={null}
      >
        {sourceData.length
          ? sourceData?.map((ele: SelectOptionsType) => {
              return (
                <Option key={ele.label} value={ele.value}>
                  {ele.label}
                </Option>
              );
            })
          : null}
      </Select>
    </Form.Item>
  );
};

export default BasicSelector;
