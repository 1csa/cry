import { ColumnsType } from '@/types';
import { businessConf, audit_level } from '@/data/constants';

function getColumns(columnsOptions: ColumnsType) {
  const { operation } = columnsOptions;
  return [
    {
      title: '分区名称',
      dataIndex: 'partzoneCn',
      key: 'partzoneCn',
    },
    {
      title: '分区描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '所属业务',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: '所属子业务',
      dataIndex: 'businessUnitName',
      key: 'businessUnitName',
    },
    {
      title: '最多包含几审',
      dataIndex: 'auditLevel',
      key: 'auditLevel',
      render: (auditLevel: number) => audit_level.find(ele => ele.value === auditLevel)?.label,
    },
    {
      title: '审核时限',
      dataIndex: 'auditTimeLimit',
      key: 'auditTimeLimit',
      render: (auditTimeLimit: number) => `${auditTimeLimit}分钟`,
    },
    {
      title: '是否启用快捷键',
      dataIndex: 'isEnabledKey',
      key: 'isEnabledKey',
      render: (isEnabledKey: number) =>
        businessConf.isEnabledKey.find(item => item.value === isEnabledKey)?.label,
    },
    {
      title: '提交延时',
      dataIndex: 'delayTime',
      key: 'delayTime',
      render: (delayTime: number) => `${delayTime}秒`,
    },
    {
      title: '最近编辑人',
      dataIndex: 'updateOperatorName',
      key: 'updateOperatorName',
    },
    {
      title: '最近编辑时间',
      dataIndex: 'gmtUpdate',
      key: 'gmtUpdate',
    },
    ...operation,
  ];
}
export default getColumns;
