/**
 * 业务组件 审核员 email 组件
 */
import React, { useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { Form, Select, message } from 'antd';

import { SelectOptionsType, BaseFormModelType } from '@/types';
import { queryPandoraEmailUser } from '@/services/user';

const { Option } = Select;

interface IAuditUser {
  selectProps: BaseFormModelType;
  handleChange?: (value: any) => void;
}

const AuditEmail: React.FC<IAuditUser> = ({ selectProps, handleChange }) => {
  const [sourceData, setSourceData] = useState<any[]>([]);
  const { run } = useDebounceFn(
    (value: string) => {
      handleUserList(value);
    },
    {
      wait: 500,
    },
  );

  const handleSearch = (value: string) => {
    // 这样给useDebounceFn的方法里的 执行函数传递参数 run函数接受之后再给useDebounceFn的第一个函数的参数里获取
    run(value);
  };

  const handleUserList = (value: string) => {
    queryPandoraEmailUser(value)
      .then(res => {
        const { errorno, data, desc } = res;
        if (errorno === 0) {
          const list = data.map((item: string) => ({
            label: item,
            value: item,
          }));
          setSourceData(list);
        } else {
          message.error(`email接口请求失败， 原因：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  // select change
  const onChange = (value: any) => {
    typeof handleChange === 'function' && handleChange(value);
  };

  return (
    <Form.Item label={selectProps?.label} name={selectProps?.name}>
      <Select
        allowClear={selectProps?.allowClear === false ? false : true}
        style={{ width: selectProps?.width || 200 }}
        placeholder={selectProps?.placeholder || `请选择${selectProps?.label}`}
        showSearch
        filterOption={false}
        onSearch={handleSearch}
        notFoundContent={null}
        options={sourceData.length ? sourceData : []}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default AuditEmail;
