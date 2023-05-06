import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { useDebounceFn } from 'ahooks';
import produce from 'immer';

import { Card, Button, message, Modal, Drawer, Progress, Pagination } from 'antd';
import { Space, Typography, Divider } from 'antd';

import ReviewLogModal from '@/components/Smart/ReviewLog';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';
import ExpandedRowTable from '@/components/Smart/ExpandedRowTable';
import UserprofilePanel from '@/components/Smart/UserprofilePanel';
import MediaContentReview from '@/pages/commonPages/taskReview';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import {
  getSelectedItem,
  setCascaderItem,
  parseRespondData,
  saveMachineLabel,
  saveAuditRetUserReviewTags,
  saveSensitiveCategoriesItem,
} from '@/components/BusinessLogic/common';
import { setUserprofilePanelResData, userprofileToApiParams, userReviewStatus } from '@/components/BusinessLogic/userprofilePanelData';
import {
  fetchMainCategoryMarkLabels,
  fetchSubcategory,
  fetchNianHuaCategoryMarkLabels,
} from '@/components/BusinessLogic/common/cascaderItems/categoryMarkLabelsItem';
import { handleNewTask } from '@/components/BusinessLogic/getRealVideoUrlFromString';
import CommentPanel from '@/components/Smart/AuditOperationPanel/CommentPanel';
import MaterialPanel from '@/components/Smart/AuditOperationPanel/MaterialPanel';
import DailyTopicPanel from '@/components/Smart/AuditOperationPanel/DailyTopicPanel';

import { fetchHistory } from '@/services/baseHisContentList';
import { submitTask } from '@/services/commonServices';

import {
  videoTitleType,
  ContentType,
  videoType,
  moduleOptions,
  studentAuditOptions,
  SubBusinessType,
  canEditBusinessUnitId,
  disabledBusinessUnitId,
} from '@/data/constants';
import { SelectOptionsType, TaskFormItemTypes, TableItemType, BaseFormModelType } from '@/types';
import { ConnectState, Dispatch, CommonLogicState, ICategoryMarkingState } from '@/models/connect';
import { getEmailName, formateTime, currentRoutePath } from '@/utils/dev_helper';
import { exportCsv } from '@/utils/exportJsonToCSV';

import getColumns from './model/defaultTableColumns';
import initFormSchema from './model/defaultFormModel';

type TddlChangeType = {
  [K: string]: number | string;
};

// vm 查询和表格的数据的类型定义 这里传递需要过滤的字段，以英文逗号分割
type FilterKeys = 'filterFormKey' | 'filterTableKey';

// 扩展的字段是 需要增加替换的内容，最底层用了splice的api，所以需要告诉数据，
// 从哪里插入，如果插入的数据很分散，可以考虑将插入的数据归为一个整体
export interface IvmProps extends Record<FilterKeys, string> {
  replaceTableItems: {
    index: number;
    items: TableItemType[];
  };
  replaceFormItems: {
    index: number;
    items: BaseFormModelType[];
  };
}

interface IBasicHistoricalContentListProps {
  initialValues: Pick<TaskFormItemTypes, 'material_type'>;
  contentType: string; // 所属业务 panel 分发 key
  filterOptions?: Partial<IvmProps>;
  // // defaultTable 参数逻辑有问题 需要修改为布尔值 & 同时在 dispatchC
  // defaultTable?: boolean | ((props: Omit<ICommentPanelProps, 'reloadCallBack'>) => React.ReactNode); // 如果是布尔 代表是默认的普通表格 function 代表要渲染的组件
  defaultTable?: boolean; // 是否展示默认的 table , 缺省值 true 。  针对评论 | 图文日报主题
}

const BasicHistoricalContentList: React.FC<IBasicHistoricalContentListProps> = ({
  filterOptions,
  initialValues,
  contentType,
  defaultTable = true,
}) => {
  // 子业务类型 需要跨越 react 生命周期存储数据
  const subTypeRef = React.useRef({
    articleDailyTopic: false, // 图文 日报主题
    articleDailyPush: false, // 图文 日报推送
    nianHuaArticle: false, // 图文分类标注 年华
    nianHuaVideo: false, // 视频分类标注 年华
    userActionMessage: false, // 用户行为 私信
    userActionUser: false, // 用户行为 用户
    userActionGroupChat: false, // 用户行为 群聊举报
    userActionStoryImage: false, // 用户行为 story 图文
    userActionStoryVideo: false, // 用户行为 story 视频
    zenLyMaterial: false, // 图文 啫喱素材
  });
  // 子业务类型 图文 日报主题 | 日报推送
  // 不同的 panel 以及 数据处理
  const getSubType = (formValue: any) => {
    const isContentTypeArticle = contentType === 'article';
    const isContentTypeVideo = contentType === 'video';
    const businessUnitId = formValue.businessUnitId;

    // 图文安审 日报主题 | 日报推送 | 啫喱素材
    const isDailyTopic = isContentTypeArticle && businessUnitId === SubBusinessType['dailyTopic'];
    const isDailyPush = isContentTypeArticle && businessUnitId === SubBusinessType['dailyPush'];
    const isZenLyMaterial = isContentTypeArticle && businessUnitId === SubBusinessType['zenLyMaterial'];

    // 图文分类标注
    const isArticleTag = contentType === 'articleTags';
    const isNianHuaArticle = isArticleTag && businessUnitId === SubBusinessType['nianHuaArticle'];

    // 视频分类标注
    const isVideoTag = contentType === 'videoTags';
    const isNianHuaVideo = isVideoTag && businessUnitId === SubBusinessType['nianHuaVideo'];

    // 用户行为
    const isUserAction = contentType === 'userAction';
    const isMessage = isUserAction && businessUnitId === SubBusinessType['message'];
    const isUser = isUserAction && businessUnitId === SubBusinessType['user'];
    const isGroupChat = isUserAction && businessUnitId === SubBusinessType['groupChat'];

    const isStoryImage = isContentTypeArticle && businessUnitId === SubBusinessType['storyImage'];
    const isStoryVideo = isContentTypeVideo && businessUnitId === SubBusinessType['storyVideo'];

    return {
      articleDailyTopic: isDailyTopic, // 图文 日报主题
      articleDailyPush: isDailyPush, // 图文 日报推送
      zenLyMaterial: isZenLyMaterial, // 图文 啫喱素材
      nianHuaArticle: isNianHuaArticle, // 图文分类标注 年华
      nianHuaVideo: isNianHuaVideo, // 视频分类标注 年华
      userActionUser: isUser, // 用户行为 用户
      userActionMessage: isMessage, // 用户行为 私信
      userActionGroupChat: isGroupChat, // 用户行为 群聊举报
      userActionStoryImage: isStoryImage, // 用户行为 story 图文举报
      userActionStoryVideo: isStoryVideo, // 用户行为 story 视频举报
    };
  };

  const isShowDefaultTable = subTypeRef.current.articleDailyTopic || subTypeRef.current.zenLyMaterial ? false : defaultTable;
  const dispatch: Dispatch = useDispatch();

  const currentBreadcrumb = useSelector<ConnectState, string>(state => state.synchronizeState.currentBreadcrumb);
  const commonLogic = useSelector<ConnectState, CommonLogicState>(state => state.commonLogic);
  const categoryMarking = useSelector<ConnectState, ICategoryMarkingState>(state => state.categoryMarking);

  // 截取字符中的options="url:的数据
  const videoRegExp = /options=\"url:([^\"^\;]+?)\;/;
  const isVideo = videoType.includes(location.pathname.replace('/app/audit-system/', ''));
  const PAGE_SIZE: number = 20;
  //当前页码数
  const [pages, setPages] = useState<number>(1);
  const basicFormRef = useRef<IHandler>(null);

  const [logVisible, setLogVisible] = useState<boolean>(false);
  // 列表数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 初始化form
  let [initFormModel, setInitFormModel] = useState<BaseFormModelType[]>(
    initFormSchema(initialValues.material_type, (value, casForm) => handleCascaderItem(value, casForm), filterOptions),
  );
  const [pagination, setPagination] = useState<IPagination>({
    size: PAGE_SIZE,
  });
  // 查询参数
  const [queryParams, setQueryParams] = useState<any>({});
  // 用户资料的数据
  const [userprofileList, setUserprofileList] = useState<any[]>([]);
  const [userprofileVisible, setUserprofileVisible] = useState<boolean>(false);
  // 表格索引
  const [rowItemIndex, setRowItemIndex] = useState<number>(0);
  // 每次select组件onchange之后选择的value 集合 用来做联动
  const [ddlChangeValue, setDdlChangeValue] = useState<TddlChangeType>({});
  const [rowItemDataId, setRowItemDataId] = useState<string>('');
  // 编辑 | 预览 drawer visible
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  // 是否 预览-true | 编辑-false
  const [isPreview, setIsPreview] = useState(true);

  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [loadLoadingMask, setLoadLoadingMask] = useState<boolean>(false);

  const columns = getColumns(
    {
      operation: [
        {
          title: '操作',
          key: 'operation',
          width: 200,
          render: (rowItem: any, record: any, index: number) => {
            const { data_id, material_type, manual_status, machine_status, business_unit_id } = rowItem;
            // 机审审核不通过 3102 可人审纠正
            const canEdit = canEditBusinessUnitId.includes(business_unit_id);
            // 审核结果为 已废弃9999 待审核3004 和 机审结果不通过3102(排除主端图文、视频) 审核中3005 的数据 禁止修改
            const disabledStatusList = [
              // 3004, // 待审核  //这个后面去掉了待审核，无法编辑
              3005, // 审核中
              9999, // 已废弃 无效数据
              // 3102, // 机审结果不通过(排除主端图文、视频)
            ];

            const disabled =
              disabledBusinessUnitId.includes(business_unit_id) ||
              disabledStatusList.includes(manual_status) ||
              (machine_status === 3102 && !canEdit);

            return (
              <Space split={<Divider type="vertical" />}>
                <Typography.Link onClick={() => handleReviewLog(data_id)}>日志</Typography.Link>
                <Typography.Link disabled={disabled} onClick={() => handleTaskByItem(rowItem, index)}>
                  编辑
                </Typography.Link>
                {/* 用户资料 101 */}
                {material_type !== 101 && <Typography.Link onClick={() => handlePreviewContent(rowItem, index)}>预览</Typography.Link>}
              </Space>
            );
          },
        },
      ],
    },
    filterOptions,
  );

  /**
   * 查询按钮获取参数以及执行方法
   * @param value 子组件返回的form字段数据
   */
  const handleBasicFormSearch = (value: any) => {
    let params = {};
    for (const key in value) {
      const element = value[key];
      if (Array.isArray(element)) {
        if (key === 'sensitiveCategories') {
          // 级联取最后一位
          Object.assign(params, { [key]: element[1] });
        } else {
          Object.assign(params, { [key]: element.join(',') });
        }
      } else {
        Object.assign(params, { [key]: element });
      }

      // 分类打标
      if (value?.bigCategoryName) {
        const categoryList = !nianHuaRef.current ? categoryMarking?.allCategoryList : categoryMarking?.nianHuaCategoryList;
        const bigCategoryName = categoryList?.find(item => item?.value === value?.bigCategoryName)?.label;
        Object.assign(params, { bigCategoryName });
      }
      if (value?.smallCategoryName && !nianHuaRef.current) {
        const smallCategoryName =
          categoryMarking?.subcategoryMap instanceof Object &&
          categoryMarking?.subcategoryMap[value?.bigCategoryName]?.find(item => item?.value === value?.smallCategoryName)?.label;
        Object.assign(params, { smallCategoryName });
      }
    }
    subTypeRef.current = getSubType(params);
    setQueryParams(params);
    fetchList(params);
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
   * 点击获取
   * @param status
   */
  const handlePreviewContent = (rowItem: any, index: number) => {
    handleTaskByItem(rowItem, index, () => setDrawerVisible(true));
  };

  // 预览 | 编辑 drawer 关闭
  const handleDrawerModalClose = () => {
    handleUserProfileModalCancel(() => {
      setDrawerVisible(false);
      setIsPreview(true);
    });
  };

  /**
   * 关闭日志组件
   * @param status
   */
  const toggleModalCallBack = (status: boolean) => {
    setLogVisible(status);
  };

  /**
   * 页码切换方法
   * @param page 页码
   * @param size 当前页数据量
   */
  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    // console.log(`页码page: ${page}，偏移量size: ${size}`);
    // setDataSource([])
    // @ts-ignore // 翻页时重置滚动条位置到顶端
    window.document.getElementById('scroll-container').scrollTop = 0;
    fetchList({ pageNumber: page, pageSize: size, ...queryParams });
    setPages(page);
  };
  const [fetchListLoading, setFetchListLoading] = useState(false);
  /**
   * 请求list 这里是获取所有类型的列表数据 只在当前用所以直接请求不存在dva
   * @param options 请求list的参数
   */
  const fetchList = (options?: any) => {
    setFetchListLoading(true);
    fetchHistory({
      pageSize: PAGE_SIZE,
      pageNumber: pages,
      // pageNumber: 1,
      ...options,
    })
      .then(res => {
        setFetchListLoading(false);
        const { errorno, desc, data: resData } = res;
        if (errorno === 0) {
          const { countAll, page, size, data } = resData;
          setPagination({
            current: page,
            total: countAll,
            size,
          });
          if (Array.isArray(data) && data.length) {
            const list = data.map(item => {
              item = parseRespondData(item);
              item.title = item.material.title;
              return item;
            });
            setDataSource([...list]);
          } else {
            setDataSource([]);
          }
        } else {
          message.error(desc);
        }
      })
      .catch(err => {
        setFetchListLoading(false);
        console.log('获取列表失败', err);
      });
  };

  /**
   * 清除联动后边的数据
   * @param value 选择数据
   * @param ddlChangeValue 每次选择存储的数据
   */
  const cleanSelectedItem = (value: TddlChangeType, ddlChangeValue: TddlChangeType) => {
    // 1）业务组件前四个关联，选择了前边的后边的要清除，而且一旦子业务改变，子业务后边的两个要清掉，审核结果和人审标签也要变。
    // 2）审核结果改变之后，要清掉人审标签
    // 要按照联动的顺序，组合成移动需要清除的数组
    let names: string[] = ['businessId', 'businessUnitId', 'partitionId', 'stage', 'auditResult', 'manualLabels'];
    let keys = '';
    // 对照两个对象中的哪个数据改变了，就是选择了哪个。
    for (const key in value) {
      const data = value[key];
      if (ddlChangeValue[key] !== data) {
        keys = key;
      }
    }
    if (names.includes(keys)) {
      const index = names.findIndex(e => e === keys);
      const cleanArr = names.slice(index, names.length);
      // 清除掉寻找出来的key
      basicFormRef?.current?.cleanCasItem(cleanArr);
    }
  };

  const { run: handleCascaderItem } = useDebounceFn((value: TddlChangeType, casForm?: any) => handleCascader(value), {
    wait: 300,
  });

  /**
   * 所有联动 都会归进来，按照key判断即可
   * @param value 每次获取的数据
   */
  const handleCascader = async (value: TddlChangeType, casForm?: any) => {
    const smallName = 'smallCategoryName';
    if (value.smallCategoryName && initFormModel?.filter(ele => ele.name === smallName).length > 0) {
      // 选择了大类之后可能需要联动小类来加载数据，但是有的页面没有小类所以判断一下只有小类存在的时候才按照大类的数据请求小类接口
      const { smallCategoryName } = value;
      const data = await fetchSubcategory(dispatch, categoryMarking, smallCategoryName as string);
      // 不知道为什么不用immer的时候给赋值会报错，但是初始化的时候给大类赋值也不会报错啊
      // TODO: 使用了 immer 导致数据 只读 状态，故而更新时同样需要使用 immer 更新，不然报错!!! 踩坑了!!!
      let newState = produce(initFormModel, (draft: any) => {
        draft.forEach((ele: any) => {
          if (ele?.name === smallName) {
            ele.sourceData = Array.isArray(data) ? data : data[smallCategoryName] ?? [];
          }
        });
      });
      setInitFormModel(newState);
    } else {
      cleanSelectedItem(value, ddlChangeValue);
      setDdlChangeValue(Object.assign(ddlChangeValue, value));
      let machineLabels: SelectOptionsType[] = []; // TODO: wxj 机审标签
      let auditResult: SelectOptionsType[] = [];
      let manualLabels: SelectOptionsType[] = []; // TODO: wxj 人审标签

      // 过滤掉undefined值，避免不过滤length把undefined算进去
      // 因为删除之后数据的value会被变为undefined 避免没数据请求接口
      // 这里的类型都是number
      if (Object.values(ddlChangeValue).filter(e => e).length >= 2) {
        // TODO: wxj label-模型标记 | resultTags-人审标签
        const [label, resultTags] = await Promise.all([
          saveMachineLabel({
            businessId: ddlChangeValue.businessUnitId as number,
            businessUnitId: ddlChangeValue.partitionId as number,
          }),
          saveAuditRetUserReviewTags({
            business_type: [ddlChangeValue.businessUnitId as number],
            business_unit_type: [ddlChangeValue.partitionId as number],
          }),
        ]);
        machineLabels = label ? getSelectedItem(label) : [];
        auditResult =
          resultTags.map((item: any) => {
            return {
              label: item.text,
              value: item.code,
            };
          }) ?? [];
        manualLabels =
          resultTags
            .find((ele: any) => ele.code === ddlChangeValue.manualLabels)
            ?.labelList?.map((item: any) => {
              return {
                label: videoTitleType[item.group!] ? `${videoTitleType[item.group!]} - ${item.label}` : item.label,
                value: item.code,
              };
            }) ?? [];

        // TODO: wxj 认证审核 & 私信审核 json 数据
        const isPass = ddlChangeValue.manualLabels === 3001;
        const isReject = ddlChangeValue.manualLabels === 3002;
        if (contentType === 'student') {
          if (isPass) {
            manualLabels = studentAuditOptions.pass.default.map((item: any) => ({
              label: item.label,
              value: item.code,
            }));
          } else if (isReject) {
            manualLabels = studentAuditOptions.reject.default.map((item: any) => ({
              label: item.label,
              value: item.code,
            }));
          }
        } else if (contentType === 'message') {
          if (isPass) {
            manualLabels = moduleOptions.map((item: any) => ({
              label: item.label,
              value: item.code,
            }));
          } else if (isReject) {
            manualLabels = [];
          }
        }
        let menuListObj = {
          machineLabels,
          auditResult,
          manualLabels,
          sensitiveCategories: await saveSensitiveCategoriesItem(dispatch, commonLogic), // 在选择子业务之后就会走dva内存不会请求接口了
        };
        setInitFormModel(setCascaderItem(initFormModel, menuListObj));
      }
    }
  };

  // 获取 大类数据 <label,value>[]
  const handleMainCategory = async () => {
    const mainCategory = await fetchMainCategoryMarkLabels(dispatch, categoryMarking);
    const nianHuaCategory = await fetchNianHuaCategoryMarkLabels(dispatch, categoryMarking);
    const data = nianHuaRef.current ? nianHuaCategory : mainCategory;
    const originState = initFormModel.slice();

    // 使用了 immer 导致数据 只读 状态，故而更新时同样需要使用 immer 更新，不然报错!!!踩坑了!!!
    const newState = produce(originState, (draft: any) => {
      draft.forEach((ele: any) => {
        if (ele?.type === 'select') {
          if (ele?.name === 'bigCategoryName' || ele?.name === 'articleBigCategoryName' || ele?.name === 'accountDomain') {
            ele.sourceData = data ?? [];
          }
        }
      });
    });
    setInitFormModel(newState);
  };

  // 利用dva发起请求，通过promise将数据传递下去
  const handleTaskByItemfn = (
    rowItem: any,
  ): Promise<{
    data: any[];
  }> => {
    return new Promise((resolve, reject) => {
      dispatch({
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
      })
        .then((result: any) => {
          const { errorno, data, desc } = result;
          if (errorno === 0) {
            resolve(data);
          } else {
            reject(`获取历史审核数据失败！${desc}`);
          }
        })
        .catch((err: any) => {
          console.log('err', err);
        });
    });
  };

  /**
   * 点击  表格的编辑按钮  操作逻辑 这在上一个页面获取数据 剩下的传递出去所以放在了dva中
   * @param rowItem 当前row data
   * @param index 当前行index
   */
  const handleTaskByItem = async (rowItem: any, index: number, callback?: () => void) => {
    handleNewTask(handleTaskByItemfn(rowItem), isVideo)
      .then(result => {
        setRowItemIndex(index);
        // 上边的都是准备工作，这里开始走页面的执行逻辑
        sessionStorage.setItem('data_id', rowItem.data_id);
        sessionStorage.setItem('isHis', 'true');

        const {
          articleDailyTopic = false,
          articleDailyPush = false,
          zenLyMaterial = false,
          nianHuaArticle = false,
          nianHuaVideo = false,
          userActionUser = false,
          userActionMessage = false,
          userActionGroupChat = false,
          userActionStoryImage = false,
          userActionStoryVideo = false,
        } = subTypeRef.current;
        // 日报主题 | 日报审核 | 啫喱素材 标识 在编辑跳转审核时必要的数据 以确定展示的 Panel
        sessionStorage.setItem('isArticleDailyTopic', `${articleDailyTopic}`);
        sessionStorage.setItem('isArticleDailyPush', `${articleDailyPush}`);
        sessionStorage.setItem('isZenLyMaterial', `${zenLyMaterial}`);

        // 图文分类标注 | 视频分类标注 标识 在编辑跳转审核时必要的数据 以确定展示的 Panel
        sessionStorage.setItem('isNianHuaArticle', `${nianHuaArticle}`);
        sessionStorage.setItem('isNianHuaVideo', `${nianHuaVideo}`);

        // 用户行为 私信 | 用户 | 群聊举报 标识 在编辑跳转审核时必要的数据 以确定展示的 Panel
        sessionStorage.setItem('isUserActionMessage', `${userActionMessage}`);
        sessionStorage.setItem('isUserActionUser', `${userActionUser}`);
        sessionStorage.setItem('isUserActionGroupChat', `${userActionGroupChat}`);

        // story  图文、视频
        sessionStorage.setItem('isStoryImage', `${userActionStoryImage}`);
        sessionStorage.setItem('isStoryVideo', `${userActionStoryVideo}`);

        message.success('获取历史审核数据成功！');
        if (contentType === 'userprofile') {
          handleUserProfileItem(result?.data);
        } else {
          callback ? callback() : handleTaskJumpPage();
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  /*****负反馈 + 评论先于表格领取任务，再将数据传递至操作页面的组件进行审核******/
  const handleTaskJumpPage = () => {
    setDrawerVisible(true);
    setIsPreview(false);
  };
  /***********/

  /* *******************非表格的组件一些处理******************** */
  const dispatchNewComponent = () => {
    // 处理非 Table 组件映射
    const { articleDailyTopic, zenLyMaterial } = subTypeRef.current;
    const componentKey = articleDailyTopic ? 'articleTopic' : zenLyMaterial ? 'zenLyMaterial' : contentType;
    // const componentKey = articleDailyTopic ? 'articleTopic' : zenLyMaterial ? 'zenLyMaterial' : 'zenLyMaterial';
    const ComponentMap = {
      comment: (
        <CommentPanel
          commentInfo={dataSource}
          tagOptions={{
            business_type: [queryParams?.businessId],
            business_unit_type: [queryParams?.businessUnitId],
            material_type: initialValues?.material_type,
          }}
        />
      ),
      zenLyMaterial: (
        <MaterialPanel
          commentInfo={dataSource}
          tagOptions={{
            business_type: [queryParams?.businessId],
            business_unit_type: [queryParams?.businessUnitId],
            material_type: initialValues?.material_type,
          }}
        />
      ),
      articleTopic: (
        <DailyTopicPanel
          topicInfo={dataSource}
          // tagOptions={{
          //   business_type: [queryParams?.businessId],
          //   business_unit_type: [queryParams?.businessUnitId],
          //   material_type: initialValues?.material_type,
          // }}
        />
      ),
    };
    return ComponentMap[componentKey];
  };

  /* *******************用户资料审核一些处理******************** */

  // /**
  //  * 修改用资料成功之后 修改当前行的用户资料标签
  //  * @param userprofilePanelItem 修改完的数据
  //  */
  // const setTableShowUserTag = (userprofilePanelItem: any) => {
  //   // console.log('statusKey', userprofilePanelItem);
  //   const { result_tags_brief, result_tags_header_img, result_tags_nick, audit_level } = userprofilePanelItem;
  //   // 需要更新人审标签、审核状态、和审核时间
  //   const resultKey = `result_l${audit_level}`;
  //   const statusKey = `status_l${audit_level}`;
  //   return produce(dataSource, (draft: any) => {
  //     const item = draft[rowItemIndex];
  //     item[resultKey] = JSON.stringify({
  //       result_tags_brief,
  //       result_tags_header_img,
  //       result_tags_nick,
  //     });
  //     item.tmmanul = formateTime(new Date().getTime());
  //     item[statusKey] = userReviewStatus(userprofilePanelItem);
  //   });
  // };

  /**
   * 点击编辑 弹出领取任务
   */
  const handleUserProfileItem = (data: any, page_id: number = 0, item_num: number = 0) => {
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
          // setDataSource(setTableShowUserTag(userprofilePanelItem));
          handleUserProfileModalCancel();
          basicFormRef?.current?.submit();
        } else {
          message.error(`修改失败，原因：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  /**
   * 关闭之后回收任务
   */
  const handleUserProfileModalCancel = (callback?: () => void) => {
    dispatch({
      type: 'commonLogic/fetchGlobalAuditTask',
      payload: {
        isEmpty: true,
      },
    });
    setUserprofileVisible(false);
    cleanSessionStorageData();
    typeof callback === 'function' && callback();
  };
  /* *******************用户资料审核一些处理结束******************** */

  /**
   * 清除
   */
  const cleanSessionStorageData = () => {
    sessionStorage.removeItem('data_id');
    sessionStorage.removeItem('isHis');
  };

  const handleExportExcelByButton = () => {
    if (!pagination?.total) {
      message.warning('请查询数据之后再导出');
      return false;
    }
    setLoadLoadingMask(true);
    exportCsv(pagination?.total, queryParams, currentBreadcrumb, contentType, (percent: number) => {
      setLoadingPercent(percent);
    }).then((res: boolean) => {
      if (res) {
        setLoadLoadingMask(false);
        setLoadingPercent(0);
      }
    });
  };

  // 初始化 大类数据
  const initCategoryData = () => {
    const requestMainCatList = [
      'imageClassification/historicalContentList',
      'videoClassification/historicalContentList',
      'imageQuality/historicalContentList',
      'videoQuality/historicalContentList',
    ];
    if (requestMainCatList.includes(currentRoutePath())) {
      handleMainCategory();
    }
  };

  useEffect(() => {
    initCategoryData();
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

  // 是否年华业务
  const nianHuaRef = React.useRef(false);
  // form value 变化监听
  // 针对 form 表单大小类 数据问题
  const onValuesChange = (changeValue: any, allValues: any) => {
    if (changeValue?.businessId) {
      const isNianHuaBusiness = changeValue.businessId === 16;
      // 性能优化 非必要不更新
      if ((!nianHuaRef.current && isNianHuaBusiness) || (nianHuaRef.current && !isNianHuaBusiness)) {
        nianHuaRef.current = isNianHuaBusiness;
        initCategoryData();
      }
    }
  };

  // drawer 打标签之后的回调
  const onDrawerCallback = () => {
    setTimeout(() => {
      handleDrawerModalClose();
      // handleBasicFormSearch(queryParams);
      // handlePageChange(pages, 20);
      basicFormRef?.current?.submit();
    }, 1000);
  };

  return (
    <div className="audit-list main-content" id="scroll-container">
      <Card title="内容筛选" bordered={false}>
        <BasicForm
          initialValues={initialValues}
          layout="inline"
          ref={basicFormRef}
          formDataModel={initFormModel}
          onSearch={value => handleBasicFormSearch(value)}
          handleCascader={value => handleCascaderItem(value)}
          loading={fetchListLoading}
          onValuesChange={onValuesChange}
        />
      </Card>
      {isShowDefaultTable ? (
        <Card bordered={false} className="table-card-wrapper">
          <Button className="mb20" type="primary" name={`${currentRoutePath()}-历史导出`} onClick={handleExportExcelByButton}>
            导出
          </Button>
          <CustomizeTable
            columns={columns}
            data={dataSource}
            rowKey="data_id"
            pagination={pagination}
            loading={fetchListLoading}
            expandableRowTable={(childTableData: any) => <ExpandedRowTable expandedTableSource={childTableData.stages} />}
            handleChange={handlePageChange}
          />
        </Card>
      ) : (
        // 这里渲染的是从上个页面传递来的组件 但是这个设计有点问题 导致 defaultTable 的参数和组件固定了
        <>
          {dispatchNewComponent()}
          <div className="pag-box">
            <Pagination
              showQuickJumper
              current={pagination?.current}
              pageSize={pagination?.size}
              total={pagination?.total}
              showTotal={(total: number) => `共计 ${total} 条`}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
      <ReviewLogModal visible={logVisible} onCancelCallBack={value => toggleModalCallBack(value)} taskId={rowItemDataId} />
      {Array.isArray(initialValues?.material_type) && initialValues?.material_type[0] === 101 ? (
        <Modal
          title="用户资料审核"
          visible={userprofileVisible}
          onOk={handleUserProfileModalOk}
          onCancel={() => handleUserProfileModalCancel()}
          width={500}
          maskClosable={false}
          keyboard={false}
          className="user-profile-modal"
          destroyOnClose={true}
        >
          {/* 用户资料的数据 */}
          <UserprofilePanel isModal={true} taskList={userprofileList} updateList={value => setUserprofileList(value)} />
        </Modal>
      ) : null}
      <Drawer
        title={isPreview ? '历史预览' : '重新编辑'}
        placement="right"
        width="80%"
        closable={false}
        onClose={handleDrawerModalClose}
        visible={drawerVisible}
        destroyOnClose
      >
        {drawerVisible && (
          <MediaContentReview
            isPreview={true}
            isEdit={!isPreview}
            onCallback={() => onDrawerCallback()}
            contentType={contentType}
            initialValues={{
              material_type: [ContentType[contentType]],
              audit_level: 1,
            }}
          />
        )}
      </Drawer>
      <Modal
        title="历史数据导出(默认1w条)进度"
        visible={loadLoadingMask}
        width={500}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        footer={null}
        closable={false}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progress type="circle" percent={loadingPercent} />
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(BasicHistoricalContentList);
