/**
 * AntTable Component
 * With Table, Pagination and Spin
 */

import React from 'react';
import { Table, Spin, Pagination } from 'antd';

export type Columns = Array<{ [key: string]: any }>;
export type DataSource = Array<{ [key: string]: any }>;

export interface AntTableProps {
  spinning: boolean;
  columns: Columns;
  dataSource: DataSource;
  pagination?: boolean;
  current?: number;
  pageSize?: number;
  total?: number;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  onPageChange?: (page: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

const AntTable: React.FC<AntTableProps> = props => {
  const showQuickJumper = props.showQuickJumper || false;
  const showSizeChanger = props.showSizeChanger || false;

  return (
    <div className="ant-table">
      <Spin spinning={props.spinning}>
        <Table columns={props.columns} dataSource={props.dataSource} pagination={false} />
        {props.pagination ? (
          <div className="pagination-wrapper">
            <Pagination
              current={props.current}
              pageSize={props.pageSize}
              total={props.total}
              showQuickJumper={showQuickJumper}
              showSizeChanger={showSizeChanger}
              onChange={page => props.onPageChange && props.onPageChange(page)}
              onShowSizeChange={props.onShowSizeChange}
            />
          </div>
        ) : null}
      </Spin>
    </div>
  );
};

export default AntTable;
