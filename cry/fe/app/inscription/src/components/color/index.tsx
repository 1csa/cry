import React, { useState } from 'react';
import { CompactPicker, ColorChangeHandler } from 'react-color';
import { Input } from 'antd';
import cn from 'classnames';

import { FormItem } from '@/types/comp';
import './index.less';

interface YColor extends FormItem {
  onChange?: (color: string) => void;
}

// 这里获取color的颜色使用了watch，所以这个组件的状态变更会引起所有表单的更新
const YColor: React.FC<YColor> = ({ className, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange: ColorChangeHandler = (color) => {
    onChange!(color.hex);
  }

  const handleInputClick = () => {
    setShowPicker(show => !show);
  };

  const handleWrapperClick = () => {
    setShowPicker(false);
  };

  return (
    <div className={cn(className, 'ycolor')}>
      <Input size="small" onClick={handleInputClick} value={value} />
      {showPicker ? (
        <div className="ycolor-picker">
          <div className="ycolor-picker-cover" onClick={handleWrapperClick} />
          <CompactPicker className="ycolor-picker-body" color={value === null ? '' : value} onChange={handleColorChange}/>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(YColor);
