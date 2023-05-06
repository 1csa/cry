import React, { memo, useState, useRef } from 'react';
import { Tag, Icon, Input } from 'antd';

import './index.less';

interface TProps {
  className?: string;
  tags?: (string | number)[],
  tagTip?: string,
  onChange: (newTags: (string|number)[])=>void // 带回已经编辑好的标签, 暂时的可选用
}

const YTagInput: React.FC<TProps> =({ className, tags=[], tagTip, onChange})=> {
  const [ showInput, setShowInput ] = useState(false);
  const [ inputContent, setInputContent ] = useState('');
  const inputRef = useRef<Input>(null);

  const handleInputConfirm =()=>{
    const newTags = inputContent.length !== 0 ? [...tags, inputContent] : tags;
    onChange && onChange(newTags);
    setShowInput(false);
    setInputContent('');
  };

  const handleClose =(closed:number): void=> {
    let newTags: (string|number)[];
    if (closed===tags.length-1) {
      newTags = tags.slice(0,closed);
    } else if ( closed===0) {
      newTags = tags.slice(1);
    } else {
      newTags = [...tags.slice(0,closed), ...tags.slice(closed+1)];
    }
    onChange && onChange(newTags);
  };

  const handleChange =(value: string): void=> {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    setInputContent(value);
  };

  return <div className={`tagInput ${className}`}>
    {
      showInput ? <Input
        className="tagInput-input"
        autoFocus
        ref={inputRef}
        type="text" size="small" style={{ width: 78}}
        value={inputContent}
        onChange={(e)=>handleChange(e.target.value)}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      /> : <Tag
          className="tagInput-addButton"
          style={{ background: '#fff', borderStyle: 'dashed' }}
          onClick={()=>setShowInput(true)}
      >
        <Icon type="plus"/>
        <span>{ tagTip || "new tag"}</span>
      </Tag>
    }
    <div className="tagInput-tags">
      {
        tags && tags.map((tagItem, index)=><Tag
          closable={true}
          key={ tagItem.toString()+index } // 避免因为key相同导致一次删掉了两个
          onClose={ ()=>handleClose(index) }
        >{tagItem}</Tag>)
      }
    </div>
  </div>;
};

export default memo(YTagInput);
