import React, { FC, memo } from 'react';
import { Radio } from 'antd';
import { KeyPair } from '@/config/constant';

// 操作
interface IScore {
  title: string;
  options?: Array<KeyPair<string| number, string>>;
  value: any;
  filter?: string[];
  onChange: (e: any) => void
}

const Score: FC<IScore> = memo((props) => {
  const {
    title,
    options,
    value,
    onChange,
    filter
  } = props;
  if(!options || !options.length){
    return null;
  }
  const renderRadio = () => {
    let tem = options;
    if(filter && filter.length){
      tem = options.filter(item => !filter.includes(item.key.toString()))
    }
    return tem.map(item=>{
      return <Radio
        key={item.key}
        value={item.key}
      >
        {item.value}
      </Radio>
    });
  }
  return (
    <div>
      <h4 className="opt-title">{title}</h4>
      <div className="opt-wrapper">
        <Radio.Group value={value} onChange = {onChange}>
          {renderRadio()}
        </Radio.Group>
      </div>
    </div>
  );
});

export default Score
