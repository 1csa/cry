import React from 'react';
import { FormItem } from '@/types/comp';

interface YInput extends FormItem {
  content?: string
}

const EmptyForm: React.FC<YInput> = ({ className, content }) => {

  return (
    <div className={className}>
      {content || "暂无参数"}
    </div>
  );
};

export default React.memo(EmptyForm);
