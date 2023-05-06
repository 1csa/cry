import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Icon, Divider, Table, Button, Drawer, Modal, Tag } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';

import { InitialFormScreen, HistoryScreen } from '@/components/HistoryScreen';
import { HistoryEditorContent, HistoryEditor } from '@/components/HistoryEditor';

import { push_type_map, business_map, platform_map } from '@/data';
import { PushHistoryItem, HistoryFormScreen, HistoryListScreen } from '@/config/editorpush/history';
import { PushHistoryColumn } from '@/config/editorpush/history.config';
import { pushTaskListSelector, pushStatisticSelect, catemapSelector, countAllSelector } from '@/selectors/editorpush';
import { connect } from 'dva';
import { AuthModelState, ConnectState } from '@/models/connect';
import { Exclude_Tag } from '@/config/account/account.config';
import { getPushHistory } from '@/services/historyService';
import { testApi } from '@/services/common'
import { getCatelist, handleGetHistoryPushData } from '@/services/editorpushService';
import { transferDateYearMonthDay } from '@/utils/utils';

import './index.less';
import { isEmpty } from '@/utils';

type HistoryDetail = { channel: string[]; exclude_channel: string[]; biz_id: string; platform: string[]; push_id: string; new_push_id: string };

const InitialHitsoryDetail: HistoryDetail = { channel: [], exclude_channel: [], biz_id: 'YDZX', platform: [], push_id: '', new_push_id: '' };
const InitialListScreen: HistoryListScreen = { page: 1, pageCount: 10 };
const StatisticTasks = ['all_break', 'auto', 'auto_break'];

interface HistoryProps {
  auth: AuthModelState;
}

// 好奇这里的重刷6遍是怎么搞出来的
const History: React.FC<HistoryProps> = ({ auth }) => {
  const dispatch = useDispatch();
  // const statistics = useSelector(pushStatisticSelect);
  // const taskLists = useSelector(pushTaskListSelector);
  // const countAll = useSelector(countAllSelector);
  // const cateLists = useSelector(catemapSelector);

  const [statistics, setStatistics] = useState<any>();
  const [taskLists, setTaskLists] = useState<any>();
  const [countAll, setCountAll] = useState<any>();
  const [cateLists, setCateLists] = useState<any>();

  const [showScreen, setShowScreen] = useState<boolean>(false);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [formScreen, setFormScreen] = useState<HistoryFormScreen>(InitialFormScreen);
  // const [listScreen, setListScreen] = useState<HistoryListScreen>(InitialListScreen);
  const [tagContent, setTagContent] = useState<HistoryDetail>(InitialHitsoryDetail);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<HistoryEditorContent>();
  const [showExcludeTag, setShowExcludeTag] = useState<boolean>(false);

  const handleTableChange: Required<TableProps<PushHistoryItem>>['onChange'] = pager => {
    const { current = 1, pageSize = 10 } = pager;
    let newObj = { ...formScreen, page: current, pageCount: pageSize }
    setFormScreen(newObj);
    // setListScreen({ ...formScreen, page: current, pageCount: pageSize });
    handleRequest(newObj)
  };

  const handleCheckDetail = (
    visible: boolean = false,
    channel: string[] = [],
    exclude_channel: string[] = [],
    biz_id: string = 'YDZX',
    platform: string[] = [],
    push_id: string = '',
    new_push_id: string = '',
  ) => {
    setShowTags(visible);
    setTagContent({ channel, exclude_channel, biz_id, platform, push_id, new_push_id });
  };

  const handleUpdatePush = (pushId: string, type: 'pause' | 'continue') => {
    dispatch({
      type: 'editorpush/updatePush',
      payload: { pushId, type },
    });
  };

  const handleUpdateDoc = (visible: boolean, record: HistoryEditorContent) => {
    const { push_id, new_push_id, head, news } = record;

    setShowEditor(visible);
    setEditorContent({ push_id, new_push_id, head, news });
  };

  const handleScreenConfirm = (values: HistoryFormScreen) => {
    // setFormScreen(values);
    // 每次筛选请求 设置到第一页
    // setListScreen({ ...listScreen, page: 1 });
    const reqObj = JSON.parse(JSON.stringify(values))
    // 这里做个兼容 通过 xiaomi_priority 区分小米高优 和 oppo高优  11是小米高优 22是oppo 高优
    const { xiaomi_priority } = reqObj
    if (xiaomi_priority === '11') {
      try {
        delete reqObj.oppo_pay
      } catch (error) {
        console.log(error)
      }
      reqObj['xiaomi_priority'] = '1'
    } else if (xiaomi_priority === '22') {
      try {
        delete reqObj.xiaomi_priority
      } catch (error) {
        console.log(error)
      }
      reqObj['oppo_pay'] = '1'
    } else if  (xiaomi_priority === '33') {
      reqObj['xiaomi_priority'] = '1'
      reqObj['oppo_pay'] = '1'
    } else if (xiaomi_priority === '0') {
      reqObj['xiaomi_priority'] = '0'
      reqObj['oppo_pay'] = '0'
    }
    setFormScreen({ ...reqObj, page: 1 });
    handleRequest({ ...reqObj, page: 1 });
  };

  const submitUpdateDoc = (data: HistoryEditorContent) => {
    dispatch({
      type: 'editorpush/updateContent',
      payload: data,
      callback: () => handleUpdateDoc(false, {}),
    });
  };

  // 这里涉及到
  const historyOperationColumn: ColumnProps<PushHistoryItem> = {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 108,
    render: (_, record) => {
      const type_match = record.type.match(/^\W+\(([a-z_]+)\)$/);
      const push_type = type_match ? type_match[1] : '';
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {['all', 'auto'].includes(push_type) && record.pause !== true ? (
            <Button type="link" size="small" onClick={() => handleUpdatePush(record.push_id || record.new_push_id, 'pause')}>
              暂停推送
            </Button>
          ) : null}
          {['all', 'auto'].includes(push_type) && record.pause === true ? (
            <>
              <Button type="link" size="small" onClick={() => handleUpdatePush(record.push_id || record.new_push_id, 'continue')}>
                恢复推送
              </Button>
              <Button type="link" size="small" onClick={() => handleUpdateDoc(true, record)}>
                再次编辑
              </Button>
            </>
          ) : null}

          <Button
            type="link"
            size="small"
            onClick={() =>
              handleCheckDetail(true, record.channel, record.exclude_channel, record.biz_id, record.platform, record.push_id, record.new_push_id)
            }
          >
            查看详情
          </Button>
        </div>
      );
    },
  };

  useEffect(() => {
    initFn()
  }, []);

  useEffect(() => {
    let userAuths = auth?.currentAuth?.childAuths || [];
    setShowExcludeTag(userAuths.indexOf(Exclude_Tag) >= 0 ? true : false);
  }, [auth]);


  const initFn = async () => {
    setListLoading(true);
    const listRes = await getCatelist()
    if (listRes.status === 'success') {
      const tagMap = {};
      for (let { name, id } of listRes.result) {
        tagMap[id] = name;
      }
      setCateLists(tagMap);
    } else {
      throw new Error(listRes.message);
    }
    await handleGetHistory(formScreen)
    // setListLoading(false)
  }

  const handleRequest = async (obj: any) => {
    setListLoading(true);
    await handleGetHistory(obj)
    // setListLoading(false)
  }

  const handleGetHistory = async (useObj: any) => {
    const historyRes: any = await getPushHistory(useObj)
    const idArr: any[] = []
    if (historyRes.status === 'success') {
      const { statistics = [], task_history = [], count_all = 0 } = historyRes.result;
      setStatistics(statistics)
      setTaskLists(task_history)
      setCountAll(count_all)

      setListLoading(false)
      
      task_history.forEach((item: any) => {
        if (item['type'].indexOf('auto') > -1) {
          idArr.push(item['new_push_id'])
        } else {
          idArr.push(item['push_id'])
        }
      })

      let dateRange = ''
      const useDate = useObj['d']
      const useSort = useObj['sort'] // 排序字段
      if (useDate) {
        let start = transferDateYearMonthDay(+new Date(useDate))
        let end = transferDateYearMonthDay(+new Date(useDate) + 4 * 24 * 60 * 60 * 1000)
        dateRange = `${start}/${end}`
      } else {
        let start = transferDateYearMonthDay(+new Date())
        let end = transferDateYearMonthDay(+new Date() + 4 * 24 * 60 * 60 * 1000)
        dateRange = `${start}/${end}`
      }
      // console.log(dateRange)
      // console.log(idArr)
      let reqObj = {
        "intervals": dateRange,
        "columns": [
            "view_pv",
            "view_uv",
            "arrive_pv",
            "arrive_uv",
            "click_pv",
            "click_uv"
        ],
        "granularity": "all",
        "filter": {
            "push_id": idArr
        },
        "group": [
            "push_id"
        ],
        "limit": 10240,
        "dataSource": "push_pv_uv_app"
      }
      const res = await handleGetHistoryPushData(reqObj)
      // console.log(res)
      if (res.status === 'success' && res.result && res.result.length) {
        let useData = res.result
        let newObjData = {}
        useData.forEach((item: any) => {
          let view_pv = item[1]
          let view_uv = item[2]
          let arrive_pv = item[3]
          let arrive_uv = item[4]
          let click_pv = item[5]
          let click_uv = item[6]
          let subObj = {
            view_pv,
            view_uv,
            arrive_pv,
            arrive_uv,
            click_pv,
            click_uv
          }
          // if (click_pv === 0 || view_pv === 0) {
          //   subObj['click_rate'] = 0
          // } else {
          //   subObj['click_rate'] = (click_pv / view_pv).toFixed(6)
          // }
          // if (click_uv === 0 || view_uv === 0) {
          //   subObj['convert_rate'] = 0
          // } else {
          //   subObj['convert_rate'] = (click_uv / view_uv).toFixed(6)
          // }
          if (click_pv === 0 || arrive_pv === 0) {
            subObj['real_click_rate'] = 0
          } else {
            subObj['real_click_rate'] = (click_pv / arrive_pv).toFixed(6)
          }
          if (click_uv === 0 || arrive_uv === 0) {
            subObj['real_convert_rate'] = 0
          } else {
            subObj['real_convert_rate'] = (click_uv / arrive_uv).toFixed(6)
          }
          newObjData[item[0]] = subObj
        })
        const use_task_history = JSON.parse(JSON.stringify(task_history))
        use_task_history.forEach((item: any) => {
          if (newObjData[item['new_push_id']]) {
            item['push_stat'] = newObjData[item['new_push_id']]
          }
          if (newObjData[item['push_id']]) {
            item['push_stat'] = newObjData[item['push_id']]
          }
          item['useSortKey'] = useSort
        })
        // console.log(use_task_history)
        setTaskLists(use_task_history)
      } else {
        console.log(historyRes.message);
      }
    }
  }
  const handleTest = async () => {
    const res = await testApi()
    console.log(res)
  }

  return (
    <div className="history">
      <section className="history-statistic">
        <div className="history-statistic-title">
          <Icon type="bar-chart" />
          <span>推送类别统计</span>
        </div>
        <div className="history-statistic-content">
          {StatisticTasks.map((task, index) => (
            <React.Fragment key={task}>
              {index !== 0 ? <Divider type="vertical" /> : null}
              <p>{`${push_type_map && push_type_map[task]}_${task}  ${statistics && statistics[task]}`}</p>
            </React.Fragment>
          ))}
        </div>
      </section>
      <section className="history-tasks">
        <div className="history-tasks-header">
          <div className="history-tasks-header-title">
            <Icon type="table" />
            <span>推送历史统计</span>
            <Button type="primary" onClick={handleTest} style={{marginLeft: '20px', opacity: 0}}>测试-点我</Button>
          </div>
          <Button type="primary" size="small" onClick={() => setShowScreen(true)}>
            筛选
          </Button>
        </div>
        <div className="history-tasks-table">
          <Table
            rowKey="push_id"
            bordered
            columns={[...PushHistoryColumn(cateLists), historyOperationColumn]}
            dataSource={taskLists}
            loading={listLoading}
            scroll={{ y: document.body.clientHeight - 300 }}
            pagination={{
              total: countAll,
              size: 'small',
              current: formScreen.page,
              pageSize: formScreen.pageCount,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共计${total}条`,
            }}
            onChange={handleTableChange}
          />
        </div>
      </section>
      <Drawer visible={showScreen} title="筛选-推送历史" width={450} onClose={() => setShowScreen(false)}>
        <HistoryScreen cates={cateLists} onSubmit={handleScreenConfirm} />
      </Drawer>
      <Modal title="标签" footer={null} closable={false} visible={showTags} onCancel={() => handleCheckDetail(false)}>
        <h5>业务线</h5>
        <p>{tagContent.biz_id ? business_map[tagContent.biz_id] : '---'}</p>
        <h5>平台</h5>
        <p>{isEmpty(tagContent.platform) === false ? tagContent.platform.map(text => platform_map[text]).join(',') : '--'}</p>
        <h5>推送ID(老|新)</h5>
        <p>
          <div>老：{tagContent.push_id || '---'}</div>
          <div>新：{tagContent.new_push_id || '---'}</div>
        </p>
        {/* <h5>圈选标签</h5>
        <p>
          {Array.isArray(tagContent.channel) &&
            tagContent.channel.map(tag => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
        </p>
        {
          showExcludeTag &&
          <div>
            <h5>排除标签</h5>
            <p>
              {Array.isArray(tagContent.exclude_channel) &&
                tagContent.exclude_channel.map(tag => (
                  <Tag color="red" key={tag}>
                    {tag}
                  </Tag>
                ))}
            </p>
          </div>
        } */}
      </Modal>
      <Modal title="再次编辑" visible={showEditor} footer={null} onCancel={() => handleUpdateDoc(false, {})}>
        <HistoryEditor initial={editorContent} onSubmit={submitUpdateDoc} />
      </Modal>
    </div>
  );
};

// export default React.memo(History);

export default connect(({ auth }: ConnectState) => ({
  auth,
}))(History);
