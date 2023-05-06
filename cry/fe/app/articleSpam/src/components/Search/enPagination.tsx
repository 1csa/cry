import React, { FC, useEffect, memo } from 'react';
import { Pagination } from 'antd';
import { PAGE_SIZE } from '@/config/constant';
interface IEnPagination {
  current: number;
  total: number;
  onChange: (nextPage: number) => void
}
const  EnPagination: FC<IEnPagination> = memo(props => {
  const {
    current,
    total,
    onChange
  } = props;

  return (
    <Pagination
      style={{marginTop: '15px'}}
      current={current}
      defaultCurrent={1}
      pageSize={PAGE_SIZE}
      total={total}
      showTotal={total => `共${total}条`}
      onChange={onChange}
    />
  )
});

export default EnPagination;
