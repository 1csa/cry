import React from 'react';

import './index.less';

export interface StatItemProp {
  label: string;
  name: string;
  value: number;
}

export const StatItem: React.FC<StatItemProp> = React.memo( ({ label, name, value }) => {
  return (
    <div className="stat-card">
      <p className="stat-card-title">{`${name} -- ${label}`}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
});

