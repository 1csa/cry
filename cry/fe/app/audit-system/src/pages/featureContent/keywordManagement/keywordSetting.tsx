import React, { useEffect, useState, useRef } from 'react';
import router from 'umi/router';

import { Button, Card, Divider } from 'antd';

import CustomizeTable from '@/components/Smart/BasicTable/CustomizeTable';
import KeywordSettingForm, { IHandler } from './components/KeywordSettingForm';
import getColumns from './model/tableColumns';

import { getLogs } from '@/services/featureContent';

import './index.less';

const AuditWordsSetting = () => {
  const editType: boolean = window.location.search === '?type=edit';

  const [data, setData] = useState<Array<any>>([]);

  const childrenRef = useRef<IHandler>(null);
  const handleSave = () => {
    childrenRef?.current?.onFinish();
  };

  const back = () => {
    router.go(-1);
  };

  const getLogsList = () => {
    getLogs({
      pageSize: 20,
      pageNo: 1,
      wordId: sessionStorage.editWordsValue && JSON.parse(sessionStorage.editWordsValue).wordId,
    }).then(res => {
      const { code, data } = res;
      if (code === 200) {
        setData(data.records);
      }
    });
  };

  useEffect(() => {
    editType && getLogsList();
  }, []);

  return (
    <Card className="main-content audit-words-setting">
      <KeywordSettingForm ref={childrenRef} editType={editType} />
      <Divider />
      <div className="fix-btn">
        <Button style={{ marginRight: 20 }} onClick={back}>
          返回
        </Button>
        <Button name="敏感词-保存" type="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
      {editType ? (
        <Card title="历史记录">
          <CustomizeTable columns={getColumns()} data={data} pagination={{}} rowKey="id" />
        </Card>
      ) : null}
    </Card>
  );
};

export default AuditWordsSetting;
