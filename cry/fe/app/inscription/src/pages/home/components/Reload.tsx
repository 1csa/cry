import React from 'react';
import { YIcon } from '@/components';

interface Reload {
  onReload: () => void;
}

const Reload: React.FC<Reload> = ({ onReload }) => {
  return (
    <div className="chart-tip" onClick={onReload}>
      <YIcon type="reload" style={{ marginRight: '4px' }} />
      <span>点击刷新</span>
    </div>
  );
};

export default React.memo(Reload);
