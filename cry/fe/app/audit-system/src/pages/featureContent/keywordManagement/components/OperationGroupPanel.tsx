import React, { useState } from 'react';
import Link from 'umi/link';

import { Menu, Dropdown, Button, Space } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';
import ImportModal from './excel/Import';
import { exportCommonCsvFile } from '@/utils/exportJsonToCSV'

interface IOperationGroupPanelProps {
  handleMutipleEffect: (status: number) => void;
}

const OperationGroupPanel: React.FC<IOperationGroupPanelProps> = ({ handleMutipleEffect }) => {
  const handleKeywordEffect = (status: number) => {
    handleMutipleEffect && handleMutipleEffect(status);
  };

  // const handleExportDataToExcel = () => {};
  // const handleDownloadExcelTemplate = () => {};

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleKeywordEffect(0)}>批量启用</Menu.Item>
      <Menu.Item onClick={() => handleKeywordEffect(1)}>批量禁用</Menu.Item>
    </Menu>
  );

  const [visible, setVisible] = useState(false);
  const visibleChange = () => {
    setVisible(!visible);
  };

  const downloadExcel = () => {
    const initalColumns = [
      {
          title: '关键词',
          dataIndex: 'keyword',
          key: 'keyword',
        },
        {
          title: '一级分类',
          dataIndex: 'level1',
          key: 'level1',
        },
        {
          title: '二级分类',
          dataIndex: 'level2',
          key: 'level2',
        },
        {
          title: '备注',
          dataIndex: 'tips',
          key: 'tips',
        },
        {
          title: '审核指令',
          dataIndex: 'order',
          key: 'order',
        },
        {
          title: '生效业务方',
          dataIndex: 'business',
          key: 'business',
        },
        {
          title: '生效场景',
          dataIndex: 'sense',
          key: 'sense',
        },
    ]
    const initList = [
      {
        keyword: '中国工农革命军',
        level1: '敏感',
        level2: '政府通知（指令）',
        tips: '军队',
        order: '进审',
        business: '一点',
        sense: '正文',
      },
      {
        keyword: '革命军',
        level1: '敏感',
        level2: '政府通知（指令）',
        tips: '军队',
        order: '进审',
        business: '一点',
        sense: '正文',
      },
      {
        keyword: '测试',
        level1: '敏感',
        level2: '政府通知（指令）',
        tips: '军队',
        order: '屏蔽',
        business: '一点',
        sense: '正文',
      },
    ];

    exportCommonCsvFile(initalColumns, initList, '敏感词导入模版-20220615')
    // exportExcelNew(initalColumns, initList, '敏感词导入模版-20220615.xlsx')
    // window.location.href =
    //   'http://ydwiki.yidian-inc.com/download/attachments/85921622/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88-20220615.xlsx?version=2&modificationDate=1655287534676&api=v2';
  };

  return (
    <Space>
      <Dropdown overlay={menu} arrow>
        <Button name="批量操作">
          <span className="mr20">批量操作</span>
          <Iconfont name="iconxiajiantou_huaban" />
        </Button>
      </Dropdown>
      <Button name="新增关键词" type="primary">
        <Link to="keywordManagement/keywordSetting?type=add">新增关键词</Link>
      </Button>
      <Button name="Excel模板下载" onClick={downloadExcel}>
        Excel模板下载
      </Button>
      <Button name="从Excel导入" type="primary" onClick={visibleChange}>
        从Excel导入
      </Button>
      {/* <Button name="从Excel导入">
        <Link to="keywordManagement/mutipleParseByExcel">从Excel导入</Link>
      </Button>
      <Button name="导出到Excel" onClick={handleExportDataToExcel}>
        导出到Excel
      </Button>
      <Button name="下载Excel导入模版" type="link" onClick={handleDownloadExcelTemplate}>
        <a href={`${location.origin}/static/assets/关键词批量导入模版.xlsm`} target="_blank" rel="noopener noreferrer">
          下载Excel导入模版
        </a>
      </Button> */}
      {visible ? <ImportModal visibleChange={visibleChange} /> : null}
    </Space>
  );
};

export default OperationGroupPanel;
