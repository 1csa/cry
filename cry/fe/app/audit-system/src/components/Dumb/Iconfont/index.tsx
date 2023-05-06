import React from 'react';

import './index.less';

interface IconfontProps {
  name: string;
  className?: string;
}

const Iconfont: React.FC<IconfontProps> = ({ name, className = '' }) => {
  return (
    <svg className={`icon ${className}`} aria-hidden="true">
      <use xlinkHref={`#${name}`}></use>
    </svg>
  );
};

export default Iconfont;
