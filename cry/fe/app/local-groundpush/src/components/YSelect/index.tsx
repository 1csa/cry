import React, {memo, useCallback, ReactElement} from 'react';
import { Select } from 'antd';
import { OptionProps, SelectProps } from 'antd/es/select';

export interface YSelOptProps extends OptionProps {
  children?: YSelOptProps[];
}

interface YSelectProps extends SelectProps {
  options: YSelOptProps[];
  className?: string;
  filter?: boolean
  onChange?: (newVal?: any)=>void;
}

const YSelect: React.FC<YSelectProps> =({options=[], filter, ...props })=> {
  const handleFilterSelect = (input: string, option: ReactElement<OptionProps>): boolean=>{

    return option.props.children ? (option.props.children + '').indexOf(input) >= 0 : false
  };

  return (
    <Select
      size="small"
      allowClear
      filterOption={ filter && handleFilterSelect }
      {...props}
    >{
      options.map((optItem: YSelOptProps)=>(
        optItem.children ? <Select.OptGroup key={optItem.value} label={optItem.title}>{
          optItem.children.map((child)=>(
            <Select.Option value={child.value} key={`${optItem.value}-${child.value}`}>{child.title}</Select.Option>
          ))
        }</Select.OptGroup> : <Select.Option value={optItem.value} key={optItem.value}>{optItem.title}</Select.Option>
      ))
    }</Select>
  )
};

export default memo(YSelect);
