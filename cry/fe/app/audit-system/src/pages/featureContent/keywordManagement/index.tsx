import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useHistory } from 'dva';
import produce from 'immer';

import { Tabs, Card, Button, Modal, message } from 'antd';

import DebugWordsEnv from '@/components/Dumb/DebugWordsEnv';
import BasicForm from '@/components/Smart/BasicForm';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import { saveSensitiveCategoriesItem } from '@/components/BusinessLogic/common';
import OperationGroupPanel from './components/OperationGroupPanel';

import { invalidationWords, getWordList } from '@/services/featureContent';
import { ConnectState, CommonLogicState } from '@/models/connect';

import { BaseFormModelType } from '@/types';
import { isEmpty } from '@/utils/dev_helper';
import { getArea, getBusiness } from './model/utils';
import getColumns from './model/tableColumns';
import searchFormModel from './model/formModel';

import './index.less';

// 批量切换的时候提示
const statusMap = {
  0: '启用',
  1: '禁用',
};

// 映射列表的操作，key为当前的词的生效状态，value为需要切换到的状态。
const opColumnsMap = {
  0: {
    remark: '手动立即禁用',
    label: '禁用',
    status: 1,
  },
  1: {
    remark: '手动立即启用',
    label: '启用',
    status: 0,
  },
};
interface ChangStatusType {
  wordIds: number[];
  remark: string;
  status: number;
}

const { TabPane } = Tabs;

interface keywordManagementProps {
  commonLogic: CommonLogicState;
}

const keywordManagement: React.FC<keywordManagementProps> = ({ commonLogic }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    size: 20,
  });
  const [queryParams, setQueryParams] = useState<any>({});
  const [basicFormModel, setBasicFormModel] = useState<BaseFormModelType[]>(searchFormModel);
  const [tableSelected, setTableSelected] = useState<string>('');
  const [tableSelectedRecord, setTableSelectedRecord] = useState<any[]>([]);

  const columns = getColumns({
    title: '操作',
    key: 'operation',
    render: (text: any, record: any) => {
      // 当词是屏蔽的时候显示启用，2，3，4别的都显示屏蔽，但是4是禁用掉了所以是什么内容无所谓
      const newStatus = record.status === 1 ? record.status : 0;
      const { label, remark, status } = opColumnsMap[newStatus];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Button name="敏感词编辑" type="link" style={{ padding: 0 }} onClick={() => handleModify(record)}>
            编辑
          </Button>
          <Button
            name={`敏感词切换状态-${label}`}
            disabled={record.status === 4}
            style={{ padding: 0 }}
            danger
            type="link"
            onClick={() => {
              handleDeleteImmediately(
                {
                  wordIds: [record.wordId],
                  remark,
                  status,
                },
                [record],
              );
            }}
          >
            {label}
          </Button>
        </div>
      );
    },
  });

  /**
   * 初始化下拉菜单
   */
  const initFormSelectItem = () => {
    Promise.all([getArea(), getBusiness(), saveSensitiveCategoriesItem(dispatch, commonLogic)]).then((res: any) => {
      const [subId, businessId, categoryId] = res;
      const obj = { subId, businessId, categoryId };
      const newState = produce(basicFormModel, (draft: any) => {
        draft.forEach((item: BaseFormModelType) => {
          item.sourceData = obj[item.name!] ? obj[item.name!] : item.sourceData;
        });
      });

      setBasicFormModel(newState);
    });
  };

  const handleTabChange = () => {};

  /**
   * 查询
   * @param values 表单获取的数据
   */
  const handleBasicFormSearch = (values: any) => {
    const newOptions = {};
    for (const key in values) {
      const element = values[key];
      if (!isEmpty(element)) {
        if (key === 'categoryId') {
          Object.assign(newOptions, { [key]: element[1] });
        } else {
          Object.assign(newOptions, { [key]: element });
        }
      }
    }
    setQueryParams(newOptions);
    getList(newOptions);
  };

  const history = useHistory();

  const handleModify = (record: any) => {
    sessionStorage.setItem('editWordsValue', JSON.stringify(record));
    // router.push(`keywordManagement/keywordSetting?type=edit`);
    history.push('/featureContent/keywordManagement/keywordSetting?type=edit');
  };

  const handlePageNoChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    getList({ pageNo: page, pageSize: size, ...queryParams });
  };

  const getList = (params?: any) => {
    setLoading(true);
    getWordList({
      pageSize: 20,
      pageNo: 1,
      ...params,
      accuracy: params ? +params.accuracy : 1,
    })
      .then(res => {
        const { code, data } = res;
        if (code === 200) {
          setData(data.records);
          setPagination({
            current: data.current,
            total: data.total,
            size: data.size,
          });
        }
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 多选之后 点击批量的操作
   * 判断数据选择的是不是都是同样的状态
   * 判断选择生效的状态和目前当前词的状态是不是相同的从而提示
   */
  const handleDeleteImmediatelyMutiple = (status: number) => {
    // 没选数据提示
    if (!tableSelected) {
      return false;
    }

    const wordsEffecting = (status: number) => '2, 3'.includes(`${status}`);

    // 1.屏蔽,2.未生效 3.生效中，如果选中的词，所有状态都相同才允许提交，也就是选中的数据要么都是1要么是2或者3
    const checkListStatus =
      Array.isArray(tableSelectedRecord) &&
      (tableSelectedRecord.every(item => item.status === 1) || tableSelectedRecord.every(item => wordsEffecting(item.status)));

    if (!checkListStatus) {
      message.warning(`选中的数据失效状态不同，请仔细检查`);
      return false;
    }
    const firstStatus = wordsEffecting(tableSelectedRecord[0].status) ? 0 : tableSelectedRecord[0].status;

    if (firstStatus === status) {
      message.warning(`当前敏感词已经处于${statusMap[status]}状态，请正确操作！`);
      return false;
    }
    handleDeleteImmediately({
      wordIds: tableSelected.split(',').map(Number),
      remark: `手动立即${statusMap[status]}`,
      status,
    });
  };

  const handleDeleteImmediately = (options: ChangStatusType, record?: any) => {
    Modal.confirm({
      title: '警告',
      content: `确认要将当前敏感词设置为${statusMap[options.status]}状态吗？`,
      onOk() {
        invalidationWords(options)
          .then(res => {
            const { code } = res;
            if (code === 200) {
              message.success('设置成功！');
            } else {
              message.error('设置失败！请联系接口提供方。');
            }
          })
          .catch(err => {
            console.log('err', err);
          })
          .finally(() => {
            getList();
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleRowSelectionCallbackFn = (value: string, record: any[]) => {
    setTableSelected(value);
    setTableSelectedRecord(record);
  };

  useEffect(() => {
    Promise.all([getList(), initFormSelectItem()]).catch(err => {
      console.log('err', err);
    });
  }, []);

  return (
    <Card className="main-content audit-word-management">
      <Tabs onChange={handleTabChange} className="awm-tab">
        <TabPane tab="关键词查询" key="1">
          <div className="awm-search">
            <BasicForm layout="inline" formDataModel={basicFormModel} onSearch={value => handleBasicFormSearch(value)} />
            <DebugWordsEnv />
          </div>
          <div className="ope-panel">
            <OperationGroupPanel handleMutipleEffect={handleDeleteImmediatelyMutiple} />
          </div>
          <CustomizeTable
            rowSelection={true}
            columns={columns}
            data={data}
            pagination={pagination}
            handleChange={handlePageNoChange}
            handleRowSelectionCallback={handleRowSelectionCallbackFn}
            rowKey="wordId"
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default connect(({ commonLogic }: ConnectState) => ({
  commonLogic,
}))(keywordManagement);
