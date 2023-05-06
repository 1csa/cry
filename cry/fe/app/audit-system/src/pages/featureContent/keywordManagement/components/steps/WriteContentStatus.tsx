import React, { useState } from 'react';
import { Alert } from 'antd';
import Iconfont from '@/components/Dumb/Iconfont';
import CustomizeTable from '@/components/Smart/BasicTable/CustomizeTable';
import writeContentTableColumn from '../../model/writeContentTableColumn';

interface IWriteContentStatusProps {
  errorDataList: any[];
}

const WriteContentStatus: React.FC<IWriteContentStatusProps> = ({ errorDataList }) => {
  return (
    <>
      <Alert message="文件内容校验失败，具体失败条目和原因可查看下表，请修改相应问题后重新上传导入。" type="error" />
      <h4 className="title">错误条目</h4>
      <CustomizeTable rowKey="word" columns={writeContentTableColumn} data={errorDataList} pagination={{}} />
    </>
  );
};

export default WriteContentStatus;
