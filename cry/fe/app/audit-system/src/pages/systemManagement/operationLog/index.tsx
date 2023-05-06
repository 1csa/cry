import React, { useState } from 'react';
import { Card, message } from 'antd';

import BasicForm from '@/components/Smart/BasicForm';
import CustomizeTable, {
  IPagination,
  PageChangeFnType,
} from '@/components/Smart/BasicTable/CustomizeTable';
import fetchAsyncRes from '@/components/BusinessLogic/fetchAsyncRes';

import initFormModel from './viewmodel/formModel';
import columns from './viewmodel/tableColumns';

import { operationLogQuery } from '@/services/systemManagement';

interface ISysMgmtOperationLog {}

const SysMgmtOperationLog: React.FC<ISysMgmtOperationLog> = () => {
  const pageSize = 20;
  let [pagination, setPagination] = useState<IPagination>({
    size: pageSize,
  });
  let [logTable, setLogTable] = useState<Array<any>>([]);

  let [queryParams, setQueryParams] = useState<Object>({});

  const handleBasicFormSearch = (value: any) => {
    setQueryParams(value);
    fetchTableData(value);
  };

  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    fetchTableData({ pageNumber: page, pageSize: size, ...queryParams });
  };

  const fetchTableData = async (params: any) => {
    const [err, data = [], pag = {}] = await fetchAsyncRes(() =>
      operationLogQuery({ pageNumber: 1, pageSize, ...params }),
    );
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    } else {
      setLogTable(data as any[]);
      setPagination(pag);
    }
  };

  return (
    <div className="main-content">
      <Card bordered={false}>
        <BasicForm
          initialValues={{}}
          layout="inline"
          formDataModel={initFormModel}
          onSearch={handleBasicFormSearch}
        />
      </Card>
      <Card bordered={false}>
        <CustomizeTable
          columns={columns}
          data={logTable}
          rowKey="id"
          pagination={pagination}
          handleChange={handlePageChange}
        />
      </Card>
    </div>
  );
};

export default SysMgmtOperationLog;
