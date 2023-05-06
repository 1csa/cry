import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'dva';
import produce from 'immer';
import router from 'umi/router';
import { useDebounceFn } from 'ahooks';
import { Card, message, Modal, Statistic, Spin } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';
import { setUserprofilePanelResData } from '@/components/BusinessLogic/userprofilePanelData';
import { handleNewTask } from '@/components/BusinessLogic/getRealVideoUrlFromString';
import { parseRespondData } from '@/components/BusinessLogic/common/parseResData';
import { fetchCounts, setRespondDataIntoObj } from '@/components/BusinessLogic';

import TodayReviewPanel from '@/components/Smart/TodayReviewPanel';
import UserActionPanel from '@/components/Smart/UserActionPanel';
// import ArticleVideoPanel from '@/components/Smart/ArticleVideoPanel';
import StudentPanel from '@/components/Smart/AuditOperationPanel/StudentPanel';
import DailyPushPanel from '@/components/Smart/AuditOperationPanel/DailyPushPanel';
import DailyTopicPanel from '@/components/Smart/AuditOperationPanel/DailyTopicPanel';
import MediaContentMainPanel from '@/components/Smart/MediaContentMainPanel';
import NianHuaMarkPanel from '@/components/Smart/NianHuaPanel';
import PicturesWall from '@/components/Smart/PicturesWallPanel';
import ReviewLogModal from '@/components/Smart/ReviewLog';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';
import UserprofilePanel from '@/components/Smart/UserprofilePanel';
import PromptModal from '@/components/Smart/PromptModal';

import CommentPanel from '@/components/Smart/AuditOperationPanel/CommentPanel';
import MaterialPanel from '@/components/Smart/AuditOperationPanel/MaterialPanel';

import { fetchReviewTask, handleFinishTask } from '@/services/commonServices';
import { ConnectState, CommonLogicState } from '@/models/connect';
import initFormSchema from './viewmodel/formModel';
import { getEmailName } from '@/utils/dev_helper';
import { TaskFormItemTypes } from '@/types';
import { ContentType, videoType, SubBusinessType } from '@/data/constants';

import './index.less';

const { Countdown } = Statistic;

// 油果高危和低危区倒计时能改成30分钟
const youguo = [5610, 5611];

// 评论的数据按照不同逻辑领取的数量不同
const handlePageSize = (part_zones: number) => {
  const obj = {
    5783: 10, // 图片区 10
    5784: 5, // 视频区 5
  };
  return obj[part_zones] || 50; // 其他 50
};

interface ITaskReviewPanelProps {
  commonLogic: CommonLogicState;
  contentType: string;
  initialValues: TaskFormItemTypes;
  isPreview?: boolean;
  isEdit?: boolean; // 编辑侧滑抽屉 drawer 默认false
  onCallback?: () => void; // 编辑 提交完成之后的回调
}

const TaskReviewPanel: React.FC<ITaskReviewPanelProps> = ({
  commonLogic,
  contentType,
  initialValues,
  isPreview = false,
  isEdit = false,
  onCallback,
}) => {
  // 用于在10分钟之后更新待审核数量之后重置下来菜单
  const basicFormRef = useRef<IHandler>(null);
  const dispatch = useDispatch();
  const isVideo = videoType.includes(location.pathname.replace('/app/audit-system/', ''));

  const { run } = useDebounceFn((value: any) => handleBtnTask(value), {
    wait: 300,
  });

  const notHasGlobalAuditTask = (): boolean => (commonLogic.globalAuditTask && Object.keys(commonLogic.globalAuditTask).length) === 0;

  /**
   * 处理一下页面的初始化参数 来自两方面
   * 一个是领任务的页面传入默认的
   * 一个是历史页面编辑带进来的
   */
  const setInitialValues = !isPreview
    ? () => {
        if (notHasGlobalAuditTask()) return initialValues;

        const DATA_ID = sessionStorage.data_id;
        if (DATA_ID) {
          const { audit_level = undefined } =
            commonLogic?.globalAuditTask && commonLogic.globalAuditTask[DATA_ID] && commonLogic.globalAuditTask[DATA_ID][0];
          return {
            audit_level,
          };
        }
      }
    : () => {
        return {};
      };

  const [isMainPanel, setIsMainPanel] = useState<boolean>(false); // 主处理面板
  const [initFormModel, setInitFormModel] = useState<any>(initFormSchema(initialValues.material_type, basicFormRef?.current)); // 将formData转换一下 后续需要更新
  const [todayReviewCount, setTodayReviewCount] = useState<number>(0);
  const [reviewDataInfo, setReviewDataInfo] = useState<Array<any>>([]); // 审核数据
  const [toggleCountDown, setToggleCountDown] = useState<boolean>(false); // 倒计时面板
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [visiblePrompt, setVisiblePrompt] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<any>(initialValues);
  const [deadline, setDeadline] = useState<number>(0); // 倒计时时间

  /**
   * 设置dva中存储的task为空
   */
  const setEmptyTask = () => {
    dispatch({
      type: 'commonLogic/fetchGlobalAuditTask',
      payload: {
        isEmpty: true,
      },
    });
  };

  /**
   * 从列表页审核完成或者结束任务之后需要做一些清理工作
   */
  const finishTaskGoBack = () => {
    resetPanel(() => {
      setEmptyTask();
      // router.goBack();
      // console.log('router go back ...');
      typeof onCallback === 'function' && onCallback();
    });
  };

  /**
   * 因为现在从列表页进来的时候不会再根据参数请求数据，所以这个获取任务的参数
   * 只针对正常情况进来领取任务、
   */
  const getTaskOptions = (value?: any) => {
    const normalParams = {
      status_will: 1001,
      auditor_id_will: getEmailName(),
      // audit_level: initialValues.audit_level
    };
    // pageSize 逻辑处理
    let _contentType: string = contentType;
    const { articleDailyTopic, articleDailyPush, zenly, groupPictures, zenLyMaterial } = subTypeRef.current;
    articleDailyTopic && (_contentType = 'dailyTopic');
    (zenly || groupPictures) && (_contentType = 'zenly');
    zenLyMaterial && (_contentType = 'zenLyMaterial');
    const pageSizeConfig = {
      comment: handlePageSize(value?.part_zones[0]),
      userprofile: 50,
      dailyTopic: 5,
      zenly: 30,
      zenLyMaterial: 10,
    };
    return {
      // 这里是因为评论领取任务不是一个，只有图文和视频是1 评论是一页50或者20
      pageSize: pageSizeConfig[_contentType] || 1,
      pageNumber: 0,
      ...value,
      ...normalParams,
    };
  };

  const cleanSessionStorageData = () => {
    sessionStorage.removeItem('data_id');
    sessionStorage.removeItem('isHis');
    sessionStorage.removeItem('isArticleDailyTopic');
    sessionStorage.removeItem('isArticleDailyPush');
    sessionStorage.removeItem('isNianHuaArticle');
    sessionStorage.removeItem('isNianHuaVideo');
    sessionStorage.removeItem('isUserActionMessage');
    sessionStorage.removeItem('isUserActionUser');
    sessionStorage.removeItem('isUserActionGroupChat');
    sessionStorage.removeItem('isStoryImage');
    sessionStorage.removeItem('isStoryVideo');
  };

  const reloadIsBackOrNextTask = () => {
    // 如果dva中没数据，则需要进行下一次自动领取，否则提交成功之后返回上一个页面
    // true代表无数据，需要倒计时、需要下一次自动领取
    if (notHasGlobalAuditTask()) {
      // 下一次任务的话需要将这个变成true
      handleNewTaskAtPages(true, getTaskOptions(formValue));
    } else {
      // 因为加了离开提示，所以返回上一个页面的时候需要关掉，并且将dva的数据变空
      finishTaskGoBack();
    }
  };

  /**
   * @param disabled 切换按钮以及选项的禁用状态以及文字状态
   */
  const toggleFormDisabled = (disabled: boolean, isloading: boolean, state?: any) => {
    const newState = produce(state || initFormSchema(initialValues.material_type, basicFormRef?.current, disabled), (draft: any) => {
      draft.forEach((item: any) => {
        item.disabled = disabled;
        if (item.type === 'button') {
          item.loading = isloading;
          item.label = disabled ? '结束审核' : '开始审核';
        }
      });
    });
    return newState;
  };

  /**
   * 是否关闭倒计时
   * 是否切换到无数据的主面板
   */
  const togglePanelStatus = (countDownBool: boolean, mainPanel: boolean) => {
    setIsMainPanel(mainPanel);
    setToggleCountDown(countDownBool);
  };

  /**
   * 获取当天已经审核的数
   */
  const fetchReviewCounts = async () => {
    const value = (await fetchCounts(initialValues && initialValues.material_type, -1)) || {
      stt_audited_curauditor_curday: 0,
    };
    setTodayReviewCount(value.stt_audited_curauditor_curday);
  };

  /**
   * disabled在effect中 判断 是否进领任务的页面 立即禁止下拉菜单
   * @param disabled true 立即 代表是从列表进来 不需要请求接口只需要 搞一些默认的数据自动选择
   */
  const setBasicFormModel = (disabled: boolean) => {
    if (disabled) {
      setInitFormModel(toggleFormDisabled(disabled, false));
    }
  };

  /**
   * 负反馈领取任务之后的处理逻辑
   * @param data 请求的数据源
   * @param page_id
   * @param item_num
   */
  const feedBackDataOp = (data: any, page_id: number | null, item_num: number) => {
    const fdata = data[0];
    const material = typeof fdata.material === 'string' ? JSON.parse(fdata.material) : fdata.material;
    material.part_zone_cn = fdata.part_zone_cn;
    material.part_zone = fdata.part_zone;
    // 将一些数据添加到对象中
    Object.assign(material, setRespondDataIntoObj(fdata, page_id, item_num, true));
    const machine_result = fdata.machine_result
      ? typeof fdata.machine_result === 'string'
        ? JSON.parse(fdata.machine_result)
        : fdata.machine_result
      : '';
    const obj = {
      ...fdata,
      material,
      machine_result,
    };
    return [obj];
  };

  /**
   * 评论 | 图文日报主题 领取任务数据处理
   * @param data
   * @param page_id
   * @param item_num
   */
  const commentDataOp = (data: any[], page_id: number | null, item_num: number) => {
    data?.forEach(item => {
      item = { ...item, ...parseRespondData(item) };
    });
    return data;
  };

  /**
   * 处理评论和负反馈的逻辑
   * @param resData 接口或者dva拿的数据
   * @param page_id
   * @param item_num
   * @param disabled 是否禁用按钮
   */
  const setResTaskLogic = (resData: any, page_id: number | null, item_num: number) => {
    /**
     * 这里要区分一下评论有一条或多条
     * 图文只有一条
     * 图文 日报 || 啫喱素材 数据类似评论 为多条
     */
    const { articleDailyTopic, articleDailyPush, zenly, groupPictures, zenLyMaterial } = subTypeRef.current;
    let list = [];
    if (contentType === 'comment' || articleDailyTopic || articleDailyPush || zenly || groupPictures || zenLyMaterial) {
      list = commentDataOp(resData, page_id, item_num);
    } else if (contentType === 'userprofile') {
      list = resData.map((item: any) => {
        return setUserprofilePanelResData(item);
      });
    } else {
      list = feedBackDataOp(resData, page_id, item_num);
    }
    // 处理 reviewDataInfo
    setReviewDataInfo(list);
    if (resData.length) {
      // 这里为了与列表保持一致，在刷新的时候提示
      sessionStorage.setItem('data_id', resData[0].data_id);
      setVisiblePrompt(true);

      // 这里设置当从列表进来的时候不需要展示倒计时 列表进来这里的length有数据
      togglePanelStatus(notHasGlobalAuditTask() ? true : false, true);
      // 反正领取任务之后都需要将formModel的下拉选择禁用
      setInitFormModel(toggleFormDisabled(true, false));
    }
  };

  const [fetchTaskLoading, setFetchTaskLoading] = useState(false);
  /**
   * 把获取数据的接口抽出来 单独作为一个promise在下边需要.then调用
   * @param options
   * @returns
   */
  const getNewTask = (options: any): Promise<{ data: any[] }> => {
    setFetchTaskLoading(true);
    return new Promise((resolve, reject) => {
      fetchReviewTask(options, contentType)
        .then(res => {
          setFetchTaskLoading(false);
          // mock 数据位置
          const { desc, errorno, data } = res;
          if (errorno === 0) {
            if (data.length) {
              resolve(data);
            } else {
              resetPanel();
              message.info('暂无数据可以领取！');
            }
          } else {
            resetPanel();
            message.error(`领取任务失败，${desc}`);
          }
        })
        .catch(err => {
          setFetchTaskLoading(false);
          reject(err);
        });
    });
  };

  /**
   * 数据来源 1.领取任务页面 接口直接获取 2.列表跳转进入，从 dva 中获取数据
   * 领取任务，通过data_id，成功之后需要做
   * 开始倒计时
   * 展示审核面板
   */
  const handleNewTaskAtPages = (disabled: boolean, options?: any) => {
    const DATA_ID = sessionStorage.data_id;
    // 如果是从列表页进入，从dva中获取数据
    if (commonLogic.globalAuditTask && commonLogic?.globalAuditTask[DATA_ID]) {
      const GLOBAL_TASK = commonLogic?.globalAuditTask[DATA_ID];
      setResTaskLogic(GLOBAL_TASK, null, 1);
    } else {
      // 接口数据处理
      // 否则就是在任务页面领取新任务
      handleNewTask(getNewTask(options), isVideo)
        .then(result => {
          const { data } = result;
          if (data?.length) {
            setInitFormModel(initFormSchema(initialValues.material_type, null, true));
            setResTaskLogic(data, 0, 0);
            // 如果是一个数据，就需要取出来判断
            // 默认都是8分钟，油果高危和低危区倒计时能改成30分钟
            if (Array.isArray(data) && data?.length === 1) {
              if (youguo.includes(data[0].part_zone)) {
                setDeadline(Date.now() + 1000 * 60 * 30);
              } else {
                setDeadline(Date.now() + 1000 * 60 * 8);
              }
            } else {
              setDeadline(Date.now() + 1000 * 60 * 8);
            }
          } else {
            resetPanel();
          }
        })
        .catch(err => {
          resetPanel();
          console.log('err', err);
        });
    }
  };

  const saveSearchParams = (value: any) => {
    const options = {};
    if (initFormModel.some((ele: any) => !ele.disabled)) {
      if (!Object.values(value).every(e => e)) {
        message.warning('请选择完整条件！');
        return false;
      }
    }
    for (const key in value) {
      let element = value[key];
      Object.assign(
        options,
        { [key]: element ? (Array.isArray(element) ? element : [element]) : [] },
        { audit_level: value.audit_level },
        { material_type: initialValues.material_type },
      );
    }
    return options;
  };

  /**
   * 请求领取任务或者结束任务的方法，是结束还是领取依靠 isMainPanel 来判断
   * @param value 请求任务或者结束任务的参数
   */
  const handleBtnTask = (value: any) => {
    const options = saveSearchParams(value);
    if (!options) {
      return false;
    }
    setFormValue(options);
    subTypeRef.current = getSubType(options);
    if (isMainPanel) {
      Modal.confirm({
        title: '是否结束审核？',
        onOk() {
          if (Object.values(value).every(e => e)) {
            finishTask();
          } else {
            finishTask(() => finishTaskGoBack());
          }
        },
      });
    } else {
      setInitFormModel(toggleFormDisabled(true, true));
      handleNewTaskAtPages(true, getTaskOptions(options));
    }
  };

  /**
   * 领取任务之后，结束审核 先调接口，然后在回调函数里改状态
   */
  const finishTask = (callback?: () => void, action: string = 'exit') => {
    // console.log('这里结束回收任务了')
    handleFinishTask({
      material_type: initialValues.material_type,
      action,
      dataIds: reviewDataInfo?.map(item => item?.data_id),
    })
      .then(res => {
        const { desc, errorno } = res;
        if (errorno === 0) {
          message.success('提交成功');
          resetPanel(callback);
        } else {
          message.error(`提交失败：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  /**
   * 提交完数据之后，重置面板
   */
  const resetPanel = (callback?: () => void) => {
    togglePanelStatus(false, false);
    setInitFormModel(toggleFormDisabled(false, false));
    setVisiblePrompt(false);
    setReviewDataInfo([]);
    cleanSessionStorageData();
    callback && callback();
  };

  /**
   * 切换日志弹窗
   */
  const toggleModalCallBack = (status: boolean) => {
    if (!status) {
      setLogVisible(false);
    } else {
      setLogVisible(status);
    }
  };

  /**
   * 倒计时结束，回收任务
   */
  const countDownFinish = () => {
    finishTask(() => {
      Modal.confirm({
        title: '倒计时结束，任务已自动回收，点击确认领取下一批新任务！',
        cancelText: '结束审核',
        onOk() {
          handleNewTaskAtPages(true, getTaskOptions(formValue));
        },
      });
    }, 'timeover');
  };

  useEffect(() => {
    /**
     * 梳理一下这块逻辑
     * 有docid说明是从列表页跳过来的，所以需要带着docid获取任务的同时也要处理下拉菜单的初始化、联动、拼接数量以及禁用
     * 没有docid则是正常菜单页面进来，只需要做 处理下拉菜单的初始化、联动、拼接数量以及禁用
     */
    const DATA_ID = sessionStorage.data_id;
    if (DATA_ID) {
      setInitFormModel(initFormSchema(initialValues.material_type, basicFormRef?.current, true));
      Promise.all([setBasicFormModel(true), handleNewTaskAtPages(true, getTaskOptions())]);
    } else {
      setInitFormModel(initFormSchema(initialValues.material_type, basicFormRef?.current, false));
      Promise.all([fetchReviewCounts()]);
    }
    return () => cleanSessionStorageData();
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

  // 这里设置需要监听一下用户点了刷新之后，清除掉data_id，否则页面会走到已经领取任务的状态
  useEffect(() => {
    const refreshing = () => cleanSessionStorageData();
    window.addEventListener('unload', refreshing);
    return () => {
      window.removeEventListener('unload', refreshing);
    };
  }, []);

  // 子业务类型 需要跨越 react 生命周期存储数据
  const subTypeRef = React.useRef({
    // 图文安审
    articleDailyTopic: false, // 图文 日报主题
    articleDailyPush: false, // 图文 日报推送
    zenLyMaterial: false, // 图文 啫喱素材
    zenly: false, // 图文 啫喱图文多审
    groupPictures: false, // 图文 啫喱群照片墙

    // 分类标注
    nianHuaArticle: false, // 图文分类标注 年华
    nianHuaVideo: false, // 视频分类标注 年华

    // 用户行为
    userActionMessage: false, // 用户行为 私信
    userActionUser: false, // 用户行为 用户
    userActionGroupChat: false, // 用户行为 群聊举报
    // userActionStoryImage: false, // 用户行为 story 图文举报
    // userActionStoryVideo: false, // 用户行为 story 视频举报
  });

  // 子业务类型 图文 日报主题 | 日报推送 | 啫喱多审核
  // 不同的 panel 以及 数据处理
  const getSubType = (formValue: any) => {
    const materialType = formValue && Array.isArray(formValue.material_type) && formValue.material_type[0];
    // const businessType = formValue && Array.isArray(formValue.business_type) && formValue.business_type[0];
    const businessUnitType = formValue && Array.isArray(formValue.business_unit_type) && formValue.business_unit_type[0];
    // 图文安审 日报主题 | 日报推送 | 啫喱多审核
    const isContentTypeArticle = materialType === ContentType['article'];
    const isDailyTopic = isContentTypeArticle && businessUnitType === SubBusinessType['dailyTopic'];
    const isDailyPush = isContentTypeArticle && businessUnitType === SubBusinessType['dailyPush'];
    const isZenLyMaterial = isContentTypeArticle && businessUnitType === SubBusinessType['zenLyMaterial'];
    const isZenly = isContentTypeArticle && businessUnitType === SubBusinessType['zenly'];
    const isGroupPictures = isContentTypeArticle && businessUnitType === SubBusinessType['groupPictures'];

    // 分类标注
    // 图文分类标注
    const isNianHuaArticleMark = materialType === ContentType['articleTags'];
    const isNianHuaArticle = isNianHuaArticleMark && businessUnitType === SubBusinessType['nianHuaArticle'];
    // 视频分类标注
    const isNianHuaVideoMark = materialType === ContentType['videoTags'];
    const isNianHuaVideo = isNianHuaVideoMark && businessUnitType === SubBusinessType['nianHuaVideo'];

    // 用户行为
    const isUserAction = materialType === ContentType['userAction'];
    const isMessage = isUserAction && businessUnitType === SubBusinessType['message'];
    const isUser = isUserAction && businessUnitType === SubBusinessType['user'];
    const isGroupChat = isUserAction && businessUnitType === SubBusinessType['groupChat'];

    // story 举报
    // const isStoryImage = isContentTypeArticle && businessUnitType === SubBusinessType['storyImage'];
    // const isContentTypeVideo = materialType === ContentType['video'];
    // const isStoryVideo = isContentTypeVideo && businessUnitType === SubBusinessType['storyVideo'];

    return {
      // 图文
      articleDailyTopic: isDailyTopic, // 图文 日报主题
      articleDailyPush: isDailyPush, // 图文 日报推送
      zenLyMaterial: isZenLyMaterial, // 图文 啫喱素材
      zenly: isZenly, // 啫喱图文
      groupPictures: isGroupPictures, // 啫喱群照片墙

      // 分类标注
      nianHuaArticle: isNianHuaArticle, // 图文分类标注 年华
      nianHuaVideo: isNianHuaVideo, // 视频分类标注 年华

      // 用户行为
      userActionUser: isUser, // 用户行为 用户
      userActionMessage: isMessage, // 用户行为 私信
      userActionGroupChat: isGroupChat, // 用户行为 群聊举报
      // userActionStoryImage: isStoryImage, // 用户行为 story图文举报
      // userActionStoryVideo: isStoryVideo, // 用户行为 story视频举报
    };
  };

  /**
   * 根据页面类型不同派发不同组件
   */
  const getPanelKey = () => {
    // 通过上一级页面获取的参数来确定要展示什么面板
    let key = formValue && Array.isArray(formValue.material_type) && formValue.material_type[0];

    // 子业务不同 panel
    const { articleDailyTopic, articleDailyPush, zenLyMaterial, nianHuaArticle, nianHuaVideo, zenly, groupPictures } = subTypeRef.current;
    const { isHis, isArticleDailyTopic, isArticleDailyPush, isZenLyMaterial, isNianHuaArticle, isNianHuaVideo } = sessionStorage;

    // story 举报
    // const { userActionStoryImage, userActionStoryVideo } = subTypeRef.current;
    const { isStoryImage, isStoryVideo } = sessionStorage;

    const isFromHistory = isHis === 'true';

    // 日报主题 | 日报推送 | 啫喱素材 从历史列表编辑进入审核
    const isArticle = contentType === 'article';
    const isArticleHistory = isArticle && isFromHistory;
    if (articleDailyTopic || (isArticleHistory && isArticleDailyTopic === 'true')) {
      key = SubBusinessType['dailyTopic'];
    } else if (articleDailyPush || (isArticleHistory && isArticleDailyPush === 'true')) {
      key = SubBusinessType['dailyPush'];
    } else if (zenLyMaterial || (isArticleHistory && isZenLyMaterial === 'true')) {
      key = SubBusinessType['zenLyMaterial'];
    } else if (isStoryImage === 'true') {
      key = SubBusinessType['storyImage'];
    }
    if (isStoryVideo === 'true') {
      key = SubBusinessType['storyVideo'];
    }

    // 年华 图文分类标注 | 视频分类标注
    // 分类标注
    const isArticleTags = contentType === 'articleTags';
    // 视频分类标注
    const isVideoTags = contentType === 'videoTags';
    const isNianHuaHistory = (isArticleTags || isVideoTags) && isFromHistory;
    // 目前 图文 | 视频 分类标注 年华模板用的同一个 如果有需要可以在此区分
    if (nianHuaArticle || nianHuaVideo || (isNianHuaHistory && (isNianHuaArticle === 'true' || isNianHuaVideo === 'true'))) {
      key = SubBusinessType['nianHuaArticle'];
    }

    // 啫喱多审
    if (zenly || groupPictures) {
      key = SubBusinessType['zenly'];
    }
    return key;
  };

  // 用户行为 模板 - 私信 | 用户 | 群聊举报 | story 图文 | story 视频
  const MyUserActionPanel = () => {
    let key: string | number = 'default';

    // 子业务不同 panel
    const { userActionMessage, userActionUser, userActionGroupChat } = subTypeRef.current;
    const { isHis, isUserActionMessage, isUserActionUser, isUserActionGroupChat } = sessionStorage;
    const isFromHistory = isHis === 'true';

    // 私信
    const isMessage = userActionMessage || (isFromHistory && isUserActionMessage === 'true');
    // 用户
    const isUser = userActionUser || (isFromHistory && isUserActionUser === 'true');
    // 群聊举报
    const isGroupChat = userActionGroupChat || (isFromHistory && isUserActionGroupChat === 'true');

    if (isMessage) {
      key = SubBusinessType['message'];
    } else if (isUser) {
      key = SubBusinessType['user'];
    } else if (isGroupChat) {
      key = SubBusinessType['groupChat'];
    }

    // UserActionPanel 功能属性
    const userActionPanelProps = {
      type: key,
      isPreview,
      isEdit,
      data: reviewDataInfo[0],
      reloadCallBack: () => resetPanel(reloadIsBackOrNextTask),
    };

    return reviewDataInfo.length ? <UserActionPanel {...userActionPanelProps} /> : null;
  };

  // // 图文/视频 日报主题 | 日报推送 | 啫喱素材 | 啫喱图文、群空间照片多审
  // const MyArticleVideoPanel = () => {
  //   let key: string | number = 'default';

  //   // 子业务不同 panel
  //   const { articleDailyTopic, articleDailyPush, zenLyMaterial, zenly, groupPictures } = subTypeRef.current;
  //   const { isHis, isArticleDailyTopic, isArticleDailyPush, isZenLyMaterial } = sessionStorage;

  //   const isFromHistory = isHis === 'true';

  //   // 日报主题 | 日报推送 | 啫喱素材 从历史列表编辑进入审核
  //   const isArticle = contentType === 'article';
  //   const isArticleHistory = isArticle && isFromHistory;
  //   if (articleDailyTopic || (isArticleHistory && isArticleDailyTopic === 'true')) {
  //     key = SubBusinessType['dailyTopic'];
  //   } else if (articleDailyPush || (isArticleHistory && isArticleDailyPush === 'true')) {
  //     key = SubBusinessType['dailyPush'];
  //   } else if (zenLyMaterial || (isArticleHistory && isZenLyMaterial === 'true')) {
  //     key = SubBusinessType['zenLyMaterial'];
  //   }

  //   // 啫喱多审
  //   if (zenly || groupPictures) {
  //     key = SubBusinessType['zenly'];
  //   }

  //   // 编辑侧滑 drawer 功能属性
  //   const drawerProps = {
  //     isPreview,
  //     isEdit,
  //   };

  //   const articleVideoPanelProps = {
  //     type: key,
  //     isPreview,
  //     isEdit,
  //   };

  //   const defaultProps = {
  //     logModalCallBack: (visible: boolean) => toggleModalCallBack(visible),
  //     reviewArticleInfo: reviewDataInfo[0],
  //     reloadCallBack: () => resetPanel(reloadIsBackOrNextTask),
  //     templateName: reviewDataInfo[0].template,
  //     isInspection: false,
  //   };

  //   return reviewDataInfo.length ? <ArticleVideoPanel type={key} {...drawerProps} /> : null;
  // };

  /**
   * 根据页面类型不同派发不同组件
   */
  const getPanel = () => {
    const key = getPanelKey();

    // 编辑侧滑 drawer 功能属性
    const drawerProps = {
      isPreview,
      isEdit,
    };

    const { template = '', business_unit_type } = reviewDataInfo[0] ?? {};
    let templateName = template;
    // console.log(`business_unit_type: ${business_unit_type}, storyVideo: ${SubBusinessType['storyVideo']}`);
    const isAuditStoryPanel = business_unit_type === SubBusinessType['storyImage'] || business_unit_type === SubBusinessType['storyVideo'];
    const isHistoryStoryPanel = key === SubBusinessType['storyImage'] || key === SubBusinessType['storyVideo'];
    if (isAuditStoryPanel || isHistoryStoryPanel) {
      templateName = 'StoryPanel';
    }

    const ArticleVideo = () => {
      return reviewDataInfo.length ? (
        <MediaContentMainPanel
          {...drawerProps}
          logModalCallBack={visible => toggleModalCallBack(visible)}
          reviewArticleInfo={reviewDataInfo[0]}
          reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
          templateName={templateName}
          isInspection={false}
        />
      ) : null;
    };

    const panelMap = () => {
      const panel = {
        [ContentType['userprofile']]: () => (
          <UserprofilePanel
            isModal={false}
            taskList={reviewDataInfo}
            reloadCallBack={() => resetPanel(() => handleNewTaskAtPages(true, getTaskOptions(formValue)))}
          />
        ),
        [ContentType['comment']]: () => {
          return reviewDataInfo.length ? (
            <CommentPanel
              tagOptions={{
                business_type: formValue?.business_type,
                business_unit_type: formValue?.business_unit_type,
                material_type: formValue?.material_type,
              }}
              commentInfo={reviewDataInfo}
              reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
            />
          ) : null;
        },
        [SubBusinessType['dailyTopic']]: () => {
          return reviewDataInfo.length ? (
            <DailyTopicPanel topicInfo={reviewDataInfo} reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)} />
          ) : null;
        },
        [SubBusinessType['dailyPush']]: () => {
          return reviewDataInfo.length ? (
            <DailyPushPanel data={reviewDataInfo[0]} reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)} isPreview={isPreview} />
          ) : null;
        },
        [SubBusinessType['zenLyMaterial']]: () => {
          return reviewDataInfo.length ? (
            <MaterialPanel
              tagOptions={{
                business_type: formValue?.business_type,
                business_unit_type: formValue?.business_unit_type,
                material_type: formValue?.material_type,
              }}
              commentInfo={reviewDataInfo}
              reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
            />
          ) : null;
        },
        [SubBusinessType['nianHuaArticle']]: () => {
          return reviewDataInfo.length ? (
            <NianHuaMarkPanel
              logModalCallBack={visible => toggleModalCallBack(visible)}
              reviewArticleInfo={reviewDataInfo[0]}
              reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
              templateName={templateName || 'NianHuaMarkPanel'}
              isPreview={isPreview}
            />
          ) : null;
        },
        [ContentType['userAction']]: () => <MyUserActionPanel />,
        [ContentType['student']]: () => {
          return reviewDataInfo.length ? (
            <StudentPanel {...drawerProps} data={reviewDataInfo[0]} reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)} />
          ) : null;
        },
        [SubBusinessType['zenly']]: () => {
          return reviewDataInfo.length ? (
            <PicturesWall
              tagOptions={{
                business_type: formValue?.business_type,
                business_unit_type: formValue?.business_unit_type,
                material_type: formValue?.material_type,
              }}
              data={reviewDataInfo}
              reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
            />
          ) : null;
        },
        [ContentType['inspection']]: () => {
          return reviewDataInfo.length ? (
            <MediaContentMainPanel
              {...drawerProps}
              logModalCallBack={visible => toggleModalCallBack(visible)}
              reviewArticleInfo={reviewDataInfo[0]}
              reloadCallBack={() => resetPanel(reloadIsBackOrNextTask)}
              templateName={templateName}
              isInspection={true}
            />
          ) : null;
        },
        DEFAULT: () => ArticleVideo(),
      };
      return panel[key] ? panel[key]() : panel['DEFAULT']();
    };
    return panelMap();
  };

  return (
    <div className="audit-panel main-content">
      {!isPreview && (
        <Card bordered={false}>
          <div className="form-x">
            <BasicForm
              layout="inline"
              ref={basicFormRef}
              formDataModel={initFormModel}
              initialValues={setInitialValues() || {}}
              onSearch={v => run(v)}
              loading={fetchTaskLoading}
            />
            <div style={{ justifyContent: 'flex-end' }}>
              {toggleCountDown ? (
                <Countdown
                  prefix={<Iconfont name="icondaojishi" />}
                  className="statistic"
                  value={deadline}
                  onFinish={countDownFinish}
                  format="mm:ss"
                  valueStyle={{ color: 'red' }}
                />
              ) : null}
            </div>
          </div>
        </Card>
      )}
      {isMainPanel ? (
        getPanel()
      ) : (
        <>
          <Card bordered={false}>
            <Spin spinning={fetchTaskLoading} wrapperClassName="task-loading">
              <TodayReviewPanel count={todayReviewCount} />
            </Spin>
          </Card>
        </>
      )}
      {contentType === 'article' || contentType === 'video' || contentType === 'articleQuality' || contentType === 'videoQuality' ? (
        <ReviewLogModal
          visible={logVisible}
          onCancelCallBack={v => toggleModalCallBack(v)}
          taskId={reviewDataInfo.length > 0 && reviewDataInfo[0].material.data_id}
        />
      ) : null}
      <PromptModal
        promptVisible={visiblePrompt}
        promptDataLen={reviewDataInfo.length}
        callback={pathname => {
          setVisiblePrompt(false);
          finishTask(() => {
            setEmptyTask();
            router.push(pathname);
          });
        }}
      />
    </div>
  );
};

export default connect(({ commonLogic }: ConnectState) => ({
  commonLogic,
}))(TaskReviewPanel);
