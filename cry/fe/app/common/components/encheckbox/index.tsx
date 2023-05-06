import React, {ChangeEvent, useState, useEffect} from 'react';
import { KeyPair } from '../..';
import { Checkbox, Input } from 'antd';
// 增强checkbox
type keyPair = KeyPair<string | number, string>;

interface IProps {
  title?: string;
  value?: string;
  option?: Array<string | keyPair>;
  placeholder?: string;
  onChange?: (value: string) => void;
  separator?: string;
}

// 处理value
const splitValue = function(value: string | undefined, separator: string | undefined): [any[], string] {
  const checkValue: any[] = value && value.split(separator || ",") || [];
  let inputValue = '';
  for(var i = 0; i < checkValue.length; ++i){
    let item = checkValue[i];
    if(item.includes("其他")){
      checkValue[i] = item.split(":")[0];
      inputValue = item.split(":")[1];
      break;
    }
  }
  return [checkValue, inputValue];
}
const handleCheckValue = (checked: Array<string>, inputValue: string) => {
  if(checked.includes('其他')){
    let num = checked.indexOf("其他");
    checked[num] = `${checked[num]}:${inputValue}`
  }
  return checked;
}
const Index: React.FC<IProps> = React.memo((props) => {
  let {
    title,
    value,
    option,
    onChange,
    placeholder,
    separator
  } = props;
  if(!option || !option.length){
    return null;
  }
  const [defaultCheckValue, defaultInputValue] = splitValue(value, separator);
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [checkValue, setCheckValue] = useState<Array<any>>(defaultCheckValue);
  useEffect(()=>{ // 更新默认值
    if(!!value){
      setCheckValue(defaultCheckValue);
      setInputValue(defaultInputValue);
    }
  },[value]);
  const options: keyPair[] = option.map(item=>{
    if(typeof item === "number" || typeof item === "string"){
      return {key: item, value: item};
    }
    return item;
  });
  const emitChange = (checkValue: Array<string>, inputValue: string) => {
    const temp = handleCheckValue(checkValue, inputValue);
    onChange && onChange(temp.join(separator));
  }
  const onOptionChange = (e: any) => {
    setCheckValue(e);
    emitChange(e, inputValue);
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    emitChange(checkValue, e.target.value);
  }
  const renderOption = () => {
    let flag = false; // 有其它选项 需要加入Input组件
    const result =  options.map(item => {
      if(item.value.includes("其他")){
        flag = true;
      }
      return <Checkbox
        key={item.key}
        value={item.key}
        style={{marginLeft: 0}}
      >
        {item.value}
      </Checkbox>
    });
    if(flag) {
      result.push(<Input
        placeholder={placeholder}
        key={placeholder}
        value={inputValue}
        style={{width: 240}}
        onChange={handleInputChange}
      />);
    }
    return result;
  }
  return (
    <>
      {title? <h4>{title}</h4>: ''}
      <div>
        <Checkbox.Group value={checkValue} onChange={onOptionChange}>
          {renderOption()}
        </Checkbox.Group>
      </div>
    </>
  );
});

Index.defaultProps = {
  placeholder: '请输入其他原因',
  separator: ','
}

export default Index;
