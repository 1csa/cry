export const columnsTotal = [
  {
    title: '日期',
    dataIndex: 'dt',
    key: 'dt',
  },
  {
    title: '人均审核量',
    dataIndex: 'avgAuditCount',
    key: 'avgAuditCount',
    render: (avgAuditCount: number) => avgAuditCount?.toLocaleString(),
  },
  {
    title: '平均审核时长(s)',
    dataIndex: 'avgAuditDuration',
    key: 'avgAuditDuration',
  },
];

export const columnsPartition = [
  {
    title: '日期',
    dataIndex: 'dt',
    key: 'dt',
  },
  {
    title: '审核员',
    dataIndex: 'auditorName',
    key: 'auditorName',
  },
  {
    title: '子业务',
    dataIndex: 'businessUnitName',
    key: 'businessUnitName',
  },
  {
    title: '审核分区',
    dataIndex: 'partitionName',
    key: 'partitionName',
  },
  {
    title: '总量',
    dataIndex: 'totalAuditCount',
    key: 'totalAuditCount',
    render: (totalAuditCount: number) => totalAuditCount?.toLocaleString(),
  },
  {
    title: '平均审核时长(s)',
    dataIndex: 'avgAuditDuration',
    key: 'avgAuditDuration',
  },
];
