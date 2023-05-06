import moment from "moment";

export const Columns = [
  // {
  //   title: '序号',
  //   dataIndex: 'id',
  //   key: 'id',
  //   align: 'center',
  //   fixed: 'left',
  //   width: 70,
  // },
  {
    title: '端',
    dataIndex: 'appIdGroup',
    key: 'appIdGroup',
    align: 'center',
  },
  {
    title: '场景',
    dataIndex: 'scene',
    key: 'scene',
    align: 'center',
  },
  {
    title: '内容类型',
    dataIndex: 'dataType',
    key: 'dataType',
    align: 'center',
  },
  {
    title: '文章来源',
    dataIndex: 'sourceType',
    key: 'sourceType',
    align: 'center',
  },
  {
    title: '源名称',
    dataIndex: 'sourceName',
    key: 'sourceName',
    align: 'center',
  },
  {
    title: '文章数量',
    dataIndex: 'totalNum',
    key: 'totalNum',
    align: 'center',

  },
  {
    title: '执行过滤数量',
    dataIndex: 'filterTotalNum',
    key: 'filterTotalNum',
    align: 'center',
  },
  {
    title: '总过滤比',
    dataIndex: 'filterRatio',
    key: 'filterRatio',
    align: 'center',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center',
    render(row: any) {
      if (row) {
        return moment(row).format('YYYY-MM-DD HH:mm:ss')
      }
    },
  },
  {
    title: '耗时(秒)',
    dataIndex: 'cost',
    key: 'cost',
    align: 'center',
  },
  {
    title: '添加人',
    dataIndex: 'cName',
    key: 'cName',
    align: 'center',
  },
  {
    title: '添加时间',
    dataIndex: 'cTime',
    key: 'cTime',
    align: 'center',
    render(text: any) {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
];