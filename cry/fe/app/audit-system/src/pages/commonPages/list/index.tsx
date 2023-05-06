import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import produce from 'immer';
import { Card, Button, message, Modal } from 'antd';

import ReviewLogModal from '@/components/Smart/ReviewLog';
import BasicForm from '@/components/Smart/BasicForm';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import UserprofilePanel from '@/components/Smart/UserprofilePanel';
import { dropDownInitAndCascader, setRespondDataIntoObj, handlePartZonesDDL, setInitSelectByMT } from '@/components/BusinessLogic';
import { setUserprofilePanelResData, userprofileToApiParams, userReviewStatus } from '@/components/BusinessLogic/userprofilePanelData';
import { getColumns } from './viewmodel/tableColumns';
import formDataModel from './viewmodel/formModel';

import { setValue2Array, getEmailName, formateTime } from '@/utils/dev_helper';
import { ConnectState, Dispatch, CommonLogicState } from '@/models/connect';
import { fetchReviewTaskList, submitTask } from '@/services/commonServices';
import { TableItemType } from '@/types';

import './index.less';

export type InitialValues = 'material_type' | 'status';

interface BasicAuditListProps {
  filterFormModel?: Array<any>; // form可能传入的一些需要合并的json
  tableColumns?: Array<TableItemType>;
  dispatch: Dispatch;
  commonLogic: CommonLogicState;
  initialValues: Record<InitialValues, Array<number>>; // 这里只能传表单的数据，不要传别的，别的参数可以通过属性传递
  contentType: string;
  routePathUrl?: string;
}

const BasicAuditList: React.FC<BasicAuditListProps> = ({
  filterFormModel,
  tableColumns,
  commonLogic,
  dispatch,
  contentType,
  initialValues,
  routePathUrl,
}) => {
  const LEN: number = formDataModel.length;
  const FIRSTS = formDataModel.slice(0, LEN - 1);
  const LAST = formDataModel.slice(LEN - 1);
  const PAGE_SIZE: number = 20;

  const [visible, setVisible] = useState<boolean>(false);
  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);
  // 初始化form
  const [initFormModel, setInitFormModel] = useState<any>([...FIRSTS, ...(filterFormModel || []), ...LAST]);
  const [pagination, setPagination] = useState<IPagination>({
    size: PAGE_SIZE,
  });
  // 查询参数
  const [queryParams, setQueryParams] = useState<Object>({});
  // 用户资料的数据
  const [userprofileList, setUserprofileList] = useState<Array<any>>([]);
  const [userprofileVisible, setUserprofileVisible] = useState<boolean>(false);

  const [rowItemIndex, setRowItemIndex] = useState<number>(0);
  const [rowItemDataId, setRowItemDataId] = useState<string>('');

  const columns = getColumns({
    columns: tableColumns,
    operation: [
      {
        title: '操作',
        key: 'operation',
        render: (rowItem: any, record: any, index: number) => {
          const { data_id } = rowItem;
          return (
            <>
              <Button name="历史日志" type="link" onClick={() => handleReviewLog(data_id)}>
                日志
              </Button>
              <Button
                name="历史编辑"
                type="link"
                style={{ padding: 0 }}
                disabled={rowItem.audit_level === -1}
                onClick={() => handleTaskByItem(rowItem, index)}
              >
                编辑
              </Button>
            </>
          );
        },
      },
    ],
  });

  /**
   * 查询按钮获取参数以及执行方法
   * @param v 子组件返回的form字段数据
   */
  const handleBasicFormSearch = (v: any) => {
    const normalDocid = v.docids ? (v.docids.includes('，') ? v.docids.replaceAll('，', ',') : v.docids) : undefined;
    const docids = normalDocid ? (normalDocid.includes(',') ? normalDocid.split(',') : [normalDocid]) : undefined;
    const param = Object.assign({}, v, initialValues, {
      docids,
      status: setValue2Array(v.status),
      business_unit_type: setValue2Array(v.business_unit_type),
    });
    // console.log('查询参数', v, initialValues, param);
    setQueryParams(param);
    fetchList(param);
  };

  /**
   * 匹配下拉选择审核分区的数据
   * @param ddl 所有下拉数据
   */
  const handlePartKeyValue = (ddl: any) => {
    const { value } = setInitSelectByMT(initialValues);
    return handlePartZonesDDL(ddl, value);
  };

  /**
   * 页码切换方法
   * @param page 页码
   * @param size 当前页数据量
   */
  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    // console.log(`页码page: ${page}，偏移量size: ${size}`);
    // setDataSource([]);
    fetchList({ pageNumber: page - 1, pageSize: size, ...initialValues, ...queryParams });
  };

  /**
   * 请求list 这里是获取所有类型的列表数据 只在当前用所以直接请求不存在dva
   * @param options 请求list的参数
   */
  const fetchList = (options?: any) => {
    fetchReviewTaskList(
      {
        pageSize: PAGE_SIZE,
        pageNumber: 0,
        ...options,
      },
      contentType,
    )
      .then(res => {
        const { errorno, data, page_id, item_num, countAll, pageNumber, pageSize } = res;
        if (errorno === 0) {
          setPagination({
            current: pageNumber + 1,
            total: countAll,
            size: pageSize,
          });
          if (Array.isArray(data) && data.length) {
            // 数据做一层处理
            const list = data.map(item => {
              const material = typeof item.material === 'string' ? JSON.parse(item.material) : item.material;
              // 将一些数据添加到对象中
              Object.assign(material, setRespondDataIntoObj(item, page_id, item_num, false));
              material.docid = item.docid;
              material.part_zone_cn = item.part_zone_cn;
              return material;
            });
            setDataSource(list);
          } else {
            setDataSource([]);
          }
        } else {
          // message.error(desc)
        }
      })
      .catch(err => {
        console.log('获取列表失败', err);
      });
  };

  /**
   * 获取下拉菜单数据，from api or dva
   */
  const fetchDDL = async () => {
    const ddlData = commonLogic.ddlData || {};
    if (!Object.keys(ddlData || {}).length) {
      try {
        let selectItem = await dispatch({ type: 'commonLogic/fetchddl' });
        // console.log('数据来自接口', selectItem)
        if (selectItem && Object.keys(selectItem).length) {
          setInitFormModel(dropDownInitAndCascader(initFormModel, selectItem, false, handlePartKeyValue(selectItem)));
          // setReviewArea(selectItem)
        }
      } catch (error) {
        message.error(error);
      }
    } else {
      // console.log('数据来自内存', ddlData)
      setInitFormModel(dropDownInitAndCascader(initFormModel, ddlData, false, handlePartKeyValue(ddlData)));
      // setReviewArea(ddlData)
    }
  };

  /**
   * 切换日志组件
   * @param taskId datd-id
   */
  const handleReviewLog = (taskId: string) => {
    toggleModalCallBack(true);
    setRowItemDataId(taskId);
  };

  /**
   * 切换日志组件
   * @param status
   */
  const toggleModalCallBack = (status: boolean) => {
    setVisible(status);
  };

  /**
   * 点击  表格的编辑按钮  操作逻辑 这在上一个页面获取数据 剩下的传递出去所以放在了dva中
   * @param rowItem 当前row data
   * @param index 当前行index
   */
  const handleTaskByItem = async (rowItem: any, index: number) => {
    // console.log('rowItem', rowItem)
    try {
      const { errorno, data, page_id, item_num, desc } = await dispatch({
        type: 'commonLogic/fetchGlobalAuditTask',
        payload: {
          pageSize: 1,
          pageNumber: 0,
          auditor_id_will: getEmailName(),
          audit_level: rowItem.audit_level,
          data_ids: [rowItem.data_id],
          docids: [rowItem.user_id || rowItem.docid],
          tmrecord: [rowItem.tmrecord],
        },
      });

      if (errorno === 0) {
        setRowItemIndex(index);
        sessionStorage.setItem('data_id', rowItem.data_id);
        sessionStorage.setItem('isHis', 'true');
        message.success('获取历史审核数据成功！');
        if (contentType === 'userprofile') {
          handleUserProfileItem(data, page_id, item_num);
        } else {
          handleNegFeedbackTask(data, index, page_id, item_num);
        }
      } else {
        message.error(desc);
      }
    } catch (error) {
      message.error(error);
    }
  };

  /*****负反馈 + 评论先于表格领取任务，再将数据传递至操作页面的组件进行审核******/
  const handleNegFeedbackTask = (data: any, index: number, page_id: number, item_num: number) => {
    routePathUrl && router.push(routePathUrl);
  };
  /***********/

  /* *******************用户资料审核一些处理******************** */

  /**
   * 修改用资料成功之后 修改当前行的用户资料标签
   * @param userprofilePanelItem 修改完的数据
   */
  const setTableShowUserTag = (userprofilePanelItem: any) => {
    // console.log('statusKey', userprofilePanelItem);
    const { result_tags_brief, result_tags_header_img, result_tags_nick, audit_level } = userprofilePanelItem;
    // 需要更新人审标签、审核状态、和审核时间
    const resultKey = `result_l${audit_level}`;
    const statusKey = `status_l${audit_level}`;
    return produce(dataSource, (draft: any) => {
      const item = draft[rowItemIndex];
      item[resultKey] = JSON.stringify({
        result_tags_brief,
        result_tags_header_img,
        result_tags_nick,
      });
      item.tmmanul = formateTime(new Date().getTime());
      item[statusKey] = userReviewStatus(userprofilePanelItem);
    });
  };

  /**
   * 点击编辑 弹出领取任务
   */
  const handleUserProfileItem = (data: any, page_id: number, item_num: number) => {
    if (Array.isArray(data) && data.length) {
      setUserprofileList([setUserprofilePanelResData(data[0], page_id, item_num)]);
      setUserprofileVisible(true);
    }
  };

  /**
   * 用户资料修改 确认修改提交
   */
  const handleUserProfileModalOk = () => {
    const userprofilePanelItem = userprofileList[0];
    submitTask({
      data: [userprofileToApiParams(userprofilePanelItem)],
      item_num: 1,
      auditor_id_will: getEmailName(),
      force_result: true,
    })
      .then(res => {
        const { errorno, desc } = res;
        if (errorno === 0) {
          message.success(`修改成功！`);
          setDataSource(setTableShowUserTag(userprofilePanelItem));
          setUserprofileVisible(false);
          cleanSessionStorageData();
        } else {
          message.error(`修改失败，原因：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
    // setUserprofileVisible(false)
  };

  /**
   * 清除
   */
  const cleanSessionStorageData = () => {
    sessionStorage.removeItem('data_id');
    sessionStorage.removeItem('isHis');
  };
  /**
   * 关闭之后回收任务
   */
  const handleUserProfileModalCancel = () => {
    setUserprofileVisible(false);
    cleanSessionStorageData();
  };
  /* *******************用户资料审核一些处理结束******************** */

  useEffect(() => {
    // fetchDDL()
    Promise.all([fetchDDL(), fetchList(initialValues)]);
    // if (userprofileVisible) {
    //   return () => handleUserProfileModalCancel();
    // }
  }, []);

  // 判断页面有数据 刷新之前提示 但无法做到刷新之后调接口，因为刷新之后与服务器已经不会建立连接
  useEffect(() => {
    const beforeRefresh = (event: any) => {
      if (sessionStorage.data_id) {
        event.preventDefault();
        // 只要returnValue不为null/undefined
        event.returnValue = '确定刷新吗？';
        return '确定刷新吗？刷新之后当前任务无法被立刻回收';
      }
    };
    window.addEventListener('beforeunload', beforeRefresh);
    return () => {
      window.removeEventListener('beforeunload', beforeRefresh);
    };
  }, []);

  return (
    <div className="audit-list main-content">
      <Card title="内容筛选" bordered={false}>
        <BasicForm onSearch={v => handleBasicFormSearch(v)} formDataModel={initFormModel} layout="inline" initialValues={initialValues} />
      </Card>
      <Card bordered={false}>
        <CustomizeTable columns={columns} data={dataSource} rowKey="data_id" pagination={pagination} handleChange={handlePageChange} />
      </Card>
      <ReviewLogModal visible={visible} onCancelCallBack={v => toggleModalCallBack(v)} taskId={rowItemDataId} />
      <Modal
        title="用户资料审核"
        visible={userprofileVisible}
        onOk={handleUserProfileModalOk}
        onCancel={handleUserProfileModalCancel}
        width={500}
        maskClosable={false}
        keyboard={false}
        className="user-profile-modal"
        destroyOnClose={true}
      >
        {/* 用户资料的数据 */}
        <UserprofilePanel isModal={true} taskList={userprofileList} updateList={v => setUserprofileList(v)} />
      </Modal>
    </div>
  );
};

export default connect(({ commonLogic }: ConnectState) => ({
  commonLogic,
}))(BasicAuditList);
