import React from 'react';

import { Modal, Result, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';

import './result.less';

const { Title, Paragraph, Text } = Typography;

interface ResultModalProps {
  success: number;
  fail: number;
  repeat: number;
  total: number;
  list: string[];
  visibleChange: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ success = 0, fail = 0, repeat = 0, total = 0, list = [], visibleChange }) => {
  const cancelHandle = () => {
    visibleChange();
  };

  return (
    <Modal title="从EXCEL导入" visible centered onCancel={cancelHandle} footer={null} className="import-result">
      <Result
        status={fail > 0 ? 'warning' : 'success'}
        title={`总记录总量 ${total} 条`}
        subTitle={`成功导入数据 ${success} 条, ${fail} 条数据导入失败，${repeat} 条数据重复`}
      >
        {list.length ? (
          <Typography>
            <Title level={5}>
              <Text>添加失败关键词：</Text>
              <BasicCopyToClipboard data={list.join('、')} title="添加失败关键词" renderChild={() => <CopyOutlined className="cp" />} />
            </Title>
            {list.map((item: string, index: number) => (
              <Paragraph key={index}>{item}</Paragraph>
            ))}
          </Typography>
        ) : null}
      </Result>
    </Modal>
  );
};

export default ResultModal;
