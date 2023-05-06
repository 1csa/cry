// 进审量、机审通过、机审上线、机审删除、人审进审、人审通过、人审删除、人审待审
export const columnsTotal = [
  {
    title: '日期',
    dataIndex: 'dt',
    key: 'dt',
  },
  {
    title: '进审量',
    dataIndex: 'taskCount',
    key: 'taskCount',
    render: (taskCount: number) => taskCount?.toLocaleString(),
  },
  {
    title: '机审通过',
    dataIndex: 'machinePassCount',
    key: 'machinePassCount',
    render: (machinePassCount: number) => machinePassCount?.toLocaleString(),
  },
  {
    title: '机审上线',
    dataIndex: 'machineAllowCount',
    key: 'machineAllowCount',
    render: (machineAllowCount: number) => machineAllowCount?.toLocaleString(),
  },
  {
    title: '机审删除',
    dataIndex: 'machineBlockCount',
    key: 'machineBlockCount',
    render: (machineBlockCount: number) => machineBlockCount?.toLocaleString(),
  },
  {
    title: '人审进审',
    dataIndex: 'manualTaskCount',
    key: 'manualTaskCount',
    render: (manualTaskCount: number) => manualTaskCount?.toLocaleString(),
  },
  {
    title: '人审通过',
    dataIndex: 'manualAllowCount',
    key: 'manualAllowCount',
    render: (manualAllowCount: number) => manualAllowCount?.toLocaleString(),
  },
  {
    title: '人审删除',
    dataIndex: 'manualBlockCount',
    key: 'manualBlockCount',
    render: (manualBlockCount: number) => manualBlockCount?.toLocaleString(),
  },
  {
    title: '人审待审',
    dataIndex: 'manualPendingCount',
    key: 'manualPendingCount',
    render: (manualPendingCount: number) => manualPendingCount?.toLocaleString(),
  },
];
// https://github.com/camsong/blog/issues/9 浮点数解法

/**
 * 原理 先将接口返回数字按照toPrecision处理精度，精度是从左至右第一个不为0的数开始数起
 * 假如给的数据是0.8462 直接 * 100之后会变成 84.61999999999999
 * 所以需要先num.toPrecision(precision) 设置为算上小数点后位一共12位，变成了字符串84.6200000000 然后通过
 * toPrecision从左至右第一个不为0的数开始数起，保留为84.62 最后再parseFloat转为小数
 */
const strip = (num: number, precision = 12) => +parseFloat(num.toPrecision(precision));
const trsPercent = (percent: number) => `${strip(percent * 100)}%`;
// 审核分区、分区进审量、人审完成量、人审完成率（人审完成量/分区进审量）、人审通过量、人审通过率（人审通过量/人审完成量）
export const columnsPartition = [
  {
    title: '日期',
    dataIndex: 'dt',
    key: 'dt',
  },
  {
    title: '业务',
    dataIndex: 'businessName',
    key: 'businessName',
  },
  {
    title: '业务模块',
    dataIndex: 'businessUnitName',
    key: 'businessUnitName',
  },
  {
    title: '审核分区',
    dataIndex: 'partitionName',
    key: 'partitionName',
  },
  {
    title: '分区进审量',
    dataIndex: 'taskCount',
    key: 'taskCount',
    render: (taskCount: number) => taskCount?.toLocaleString(),
  },
  {
    title: '人审完成量',
    dataIndex: 'finishCount',
    key: 'finishCount',
    render: (finishCount: number) => finishCount?.toLocaleString(),
  },
  {
    title: '人审完成率',
    dataIndex: 'finishPercent',
    key: 'finishPercent',
    render: (finishPercent: number) => trsPercent(finishPercent),
  },
  {
    title: '人审通过量',
    dataIndex: 'allowCount',
    key: 'allowCount',
    render: (allowCount: number) => allowCount?.toLocaleString(),
  },
  {
    title: '人审通过率',
    dataIndex: 'allowPercent',
    key: 'allowPercent',
    render: (allowPercent: number) => trsPercent(allowPercent),
  },
];
