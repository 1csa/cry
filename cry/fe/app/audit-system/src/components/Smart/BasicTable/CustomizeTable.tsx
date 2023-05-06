import React, { useState } from 'react';
import { Table } from 'antd';

type IBasicPagination = 'current' | 'total' | 'size';

type FnParamsType = (page: number, size?: number | undefined) => void;
export type PageChangeFnType = Parameters<FnParamsType>;

export interface IPagination extends Partial<Record<IBasicPagination, number>> {
  onChange?: FnParamsType;
  pageSizeOptions?: string[];
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}

interface ITableProps {
  rowKey: string;
  columns: Array<any>;
  data: Array<any>;
  pagination: IPagination; // 分页
  handleChange?: FnParamsType; // 分页页码改变回调函数
  handleShowSizeChange?: (value: number) => void;
  expandableRowTable?: (data: any) => JSX.Element; // 是否有展开的表格
  rowSelection?: boolean; // 表格是否有多选
  // rowSelection?: {
  //   selectedRowKeys: any[];
  // }; // 表格是否有多选
  selectedRowKeys?: any[];
  handleRowSelectionCallback?: (selected: string, selectedRows: any[]) => void; // 多选回调
  size?: 'default' | 'middle' | 'small'; // 表格尺寸
  scroll?: {
    x?: number;
    y?: number;
  };
  loading?: boolean; // 列表内容数据加载
}

const CustomizeTable: React.FC<ITableProps> = ({
  columns,
  data,
  pagination,
  handleChange,
  rowKey,
  expandableRowTable,
  rowSelection,
  selectedRowKeys,
  handleRowSelectionCallback,
  loading = false,
  size = 'default',
  scroll,
}) => {
  const hasPagination = Object.keys(pagination).length > 0;

  const [pageSize, setPageSize] = useState<number>(pagination.size || 20);

  const onPageSizeChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    setPageSize(size || 20);
    handleChange && handleChange(page, size);
  };

  /**
   * 这里需要处理一下 直接放在expandabl属性里有点问题
   */
  const expandedRowRender = (record: any) => {
    // 点击表格展开的时候将表格行的数据回传到顶层组件，然后在顶层组件中通过参数获取再传给扩展表格
    return expandableRowTable && expandableRowTable(record);
  };

  const handleRowSelection = () => {
    // return rowSelection
    //   ? {
    //       selectedRowKeys: selectedRowKeys ?? [],
    //       onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    //         handleRowSelectionCallback && handleRowSelectionCallback(`${selectedRowKeys}`, selectedRows);
    //       },
    //     }
    //   : undefined;
    const selection = {
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        handleRowSelectionCallback && handleRowSelectionCallback(`${selectedRowKeys}`, selectedRows);
      },
    };
    // @ts-ignore
    selectedRowKeys && (selection.selectedRowKeys = selectedRowKeys);
    return rowSelection ? selection : undefined;
  };

  return (
    <Table
      id="customize-audit-word-table"
      bordered
      columns={columns}
      dataSource={data}
      scroll={scroll ? scroll : { x: 1000 }}
      rowKey={record => record[rowKey]}
      expandable={expandableRowTable ? { expandedRowRender } : undefined}
      rowSelection={handleRowSelection()}
      loading={loading}
      // @ts-ignore
      size={size}
      pagination={
        hasPagination
          ? {
              current: pagination?.current,
              pageSizeOptions: pagination?.pageSizeOptions || ['10', '20', '50', '100'],
              total: pagination?.total,
              showSizeChanger: true,
              onChange: onPageSizeChange,
              pageSize: pageSize,
              showTotal: (total: number) => `共计 ${total} 条`,
            }
          : false
      }
    />
  );
};
export default CustomizeTable;
