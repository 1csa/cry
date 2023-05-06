import { message } from 'antd';
import { downLoadXlsx } from 'app-common/utils/util';
export const handleExportExcel = (
  dataSource: any[],
  fileName: string,
  exportUrl: string,
  queryParams: { [K: string]: string | number } | Object,
) => {
  if (!dataSource.length) {
    message.warning('请查询数据之后再导出！');
    return false;
  }
  downLoadXlsx({
    filename: `${fileName.replace(',', '-')}`,
    url: `/api/proxy/${exportUrl}`,
    params: {
      pageSize: 500,
      pageNumber: 1,
      ...queryParams,
    },
  });
};
