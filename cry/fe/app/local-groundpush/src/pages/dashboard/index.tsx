import React from 'react';

import { RealtimeData, StatisticData } from './components';
import './index.less';

export default function() {
  return (
    <div className="dashboard">
      <RealtimeData />
      <StatisticData />
    </div>
  );
}
