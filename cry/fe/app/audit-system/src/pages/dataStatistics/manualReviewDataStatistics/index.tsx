import React from 'react';

import { columnsTotal, columnsPartition } from './viewModel/tableColumn';
import DataStatistics from '../components';

const ManualReviewDataStatistics = () => {
  return <DataStatistics theSecondExportBtn={true} columnsTotal={columnsTotal} columnsPartition={columnsPartition} panelStatistics={[]} />;
};

export default ManualReviewDataStatistics;
