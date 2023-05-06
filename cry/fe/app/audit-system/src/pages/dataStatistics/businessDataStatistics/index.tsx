import React from 'react';

import DataStatistics from '../components';
import { columnsTotal, columnsPartition } from './viewModel/tableColumn';
import panelStatistics from './viewModel/panelStatistics';

const BusinessDataStatistics = () => {
  return <DataStatistics columnsTotal={columnsTotal} columnsPartition={columnsPartition} panelStatistics={panelStatistics} />;
};

export default BusinessDataStatistics;
