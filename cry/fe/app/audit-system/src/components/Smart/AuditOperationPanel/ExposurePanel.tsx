/**
 * 图文 视频 曝光审核操作组件
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useKeyPress, useDebounceFn } from 'ahooks';
import produce from 'immer';
import { Button, message, Input, Statistic, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import { BtnGroupTypes, ButtonType, ToInitButtonGroupType } from '@/types';
import { isJSON } from '@/utils/dev_helper';
import handleTaskSubmit from './handleTaskSubmit';

import './index.less';

const { Countdown } = Statistic;
const { confirm } = Modal;

enum OperationTagType {
  reject = 'reject',
  pass = 'pass',
}

type BUTTON_TYPE = {
  [K: string]: ButtonType;
};

export type ButtonAllNotRequireType = Partial<BtnGroupTypes>;

type ButtonAllType = Array<ButtonAllNotRequireType>;

type CusNewState = {
  label: string;
  value: ButtonAllType;
};

const OTHERS = ['other', 'rej_others', 'pas_ntfy_others'];
const BUTTON_TYPES: BUTTON_TYPE = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
};

const PANEL_TYPES: { ARTICLE: string; VIDEO: string; LIVE: string } = {
  ARTICLE: 'article', // 图文
  VIDEO: 'video', // 视频
  LIVE: 'live', // 生活圈
};

// 高敏一区A、B、C\马甲号领导人区 不需要快捷键并且需要10s之后才能开始提交审核结果
const notUseKeyPressList = [5000, 5001, 5628];

interface IAOPProps {
  material: any;
  reloadCallBack: () => void;
  isVideo: boolean; // 视频 | 图文
  tagDataSource: any; // 标签数据
  userReviewResult: string; // 人审结果
  btnCountPerRow?: boolean;
  btnGroupStatus?: boolean; // 通过 | 拒绝 按钮组状态  是否全部可点击，兼容之前内容 默认值 false
  panel?: string; // video-视频 | article-图文 | live-生活圈
  isInspection?: boolean; // 是否质检业务 默认 false
}

const ArticleOperationPanel: React.FC<IAOPProps> = ({
  isVideo,
  tagDataSource,
  material,
  reloadCallBack,
  userReviewResult,
  btnCountPerRow,
  btnGroupStatus = false,
  panel = PANEL_TYPES.ARTICLE,
  isInspection = false,
}) => {
  // // 审核驳回 - "其他"按钮附带的输入框 的ref
  // const otherInputRef = useRef(null);
  // // 审核通过 - 其他
  // const passOtherInputRef = useRef(null);

  const {
    media: { selfVisibleFlag = false },
  } = material;

  // const type: string = isVideo ? PANEL_TYPES.VIDEO : PANEL_TYPES.ARTICLE;
  const type: string = panel;

  // panel 类型
  const articlePanel = type === PANEL_TYPES.ARTICLE; // 图文
  const videoPanel = type === PANEL_TYPES.VIDEO; // 视频
  const livePanel = type === PANEL_TYPES.LIVE; // 生活圈

  // 曝光图文审核按钮组 isVideo = false
  const [exposureArticlePassAll, setExposureArticlePassAll] = useState<ButtonAllType>(articlePanel ? tagDataSource.pass.default ?? [] : []);
  const [exposureArticleReject, setExposureArticleReject] = useState<ButtonAllType>(articlePanel ? tagDataSource.reject.default ?? [] : []);

  // 曝光审核视频数据 isVideo = true
  const [exposureVideoRejectVideo, setExposureVideoRejectVideo] = useState<ButtonAllType>(videoPanel ? tagDataSource.reject.video ?? [] : []);
  const [exposureVideoRejectTitle, setExposureVideoRejectTitle] = useState<ButtonAllType>(videoPanel ? tagDataSource.reject.title ?? [] : []);
  const [exposureVideoRejectPoster, setExposureVideoRejectPoster] = useState<ButtonAllType>(videoPanel ? tagDataSource.reject.poster ?? [] : []);
  const [exposureVideoRejectSumary, setExposureVideoRejectSumary] = useState<ButtonAllType>(videoPanel ? tagDataSource.reject.summary ?? [] : []);
  const [exposureVideoRejectOthers, setExposureVideoRejectOthers] = useState<ButtonAllType>(videoPanel ? tagDataSource.reject.other ?? [] : []);

  // 视频拒绝的所有
  const videoRejectAll = [
    exposureVideoRejectVideo,
    exposureVideoRejectTitle,
    exposureVideoRejectPoster,
    exposureVideoRejectSumary,
    exposureVideoRejectOthers,
  ];
  const [exposureVideoRejectAll, setExposureVideoRejectAll] = useState<Array<any>>(videoRejectAll);
  // 视频的通过 通用
  const [exposureVideoPassCommon, setExposureVideoPassCommon] = useState<ButtonAllType>(videoPanel ? tagDataSource.pass.common ?? [] : []);
  const [exposureVideoPassQuality, setExposureVideoPassQuality] = useState<ButtonAllType>(videoPanel ? tagDataSource.pass.quality ?? [] : []);
  const [exposureVideoPassTimeliness, setExposureVideoPassTimeliness] = useState<ButtonAllType>(
    videoPanel ? tagDataSource.pass.timeliness ?? [] : [],
  );

  // 生活圈安审按钮组
  const [exposureLiveCircleRejectAll, setExposureLiveCircleRejectAll] = useState<ButtonAllType>(livePanel ? tagDataSource.reject.default : []);
  const [exposureLiveCirclePassMobile, setExposureLiveCirclePassMobile] = useState<ButtonAllType>(livePanel ? tagDataSource.pass.mobile_column : []);
  const [exposureLiveCirclePassNotify, setExposureLiveCirclePassNotify] = useState<ButtonAllType>(livePanel ? tagDataSource.pass.notify : []);
  const [exposureLiveCirclePassOffline, setExposureLiveCirclePassOffline] = useState<ButtonAllType>(livePanel ? tagDataSource.pass.offline : []);
  const [exposureLiveCirclePassNoNotify, setExposureLiveCirclePassNoNotify] = useState<ButtonAllType>(
    livePanel ? tagDataSource.pass.without_notify : [],
  );
  // 生活圈通过的所有
  const liveCirclePassAll = [
    exposureLiveCirclePassMobile,
    exposureLiveCirclePassNotify,
    exposureLiveCirclePassOffline,
    exposureLiveCirclePassNoNotify,
  ];
  const [exposureLiveCirclePassAll, setExposureLiveCirclePassAll] = useState<Array<any>>(liveCirclePassAll);

  // 是否禁用提交按钮
  const [isInitDisabledSubmitButton, setIsInitDisabledSubmitButton] = useState<boolean>(false);
  // 倒计时时间设置
  const [countDownTime, setCountDownTime] = useState<number>(0);

  // 通过type来获取pass的数据
  const passDataByType = {
    [PANEL_TYPES.VIDEO]: [exposureVideoPassQuality, exposureVideoPassTimeliness, exposureVideoPassCommon].filter(e => e ?? []),
    [PANEL_TYPES.ARTICLE]: exposureArticlePassAll,
    [PANEL_TYPES.LIVE]: exposureLiveCirclePassAll,
  };

  // 通过type来获取reject的数据
  const rejectDataByType = {
    [PANEL_TYPES.VIDEO]: exposureVideoRejectAll,
    [PANEL_TYPES.ARTICLE]: exposureArticleReject,
    [PANEL_TYPES.LIVE]: exposureLiveCircleRejectAll.filter(e => e ?? []),
  };

  /**
   * 确认当前领取的任务是否需要禁用快捷键
   * @param event 键盘事件
   */
  const useOrforbidenKeyPress = (event: KeyboardEvent, keyCodeFilterArr: ButtonAllNotRequireType[]) => {
    const { part_zone } = material;
    if (!notUseKeyPressList.includes(part_zone)) {
      // 获取当前快捷键对应的数据元素以及索引用于切换标签按钮的状态
      const item = keyCodeFilterArr.find((ele: ButtonAllNotRequireType) => ele?.keyname?.toLowerCase() === event?.code.toLowerCase())!;
      const index = keyCodeFilterArr.findIndex((ele: ButtonAllNotRequireType) => ele?.keyname?.toLowerCase() === event?.code.toLowerCase());
      handleButtonStatusChange(item, index, OperationTagType.pass, 'common');
    } else {
      message.warning('当前分区任务禁止使用快捷键！');
    }
  };

  /**
   * 确定是否需要在高敏区 禁用按钮10s
   */
  const isDisabledSubmitButtonByPartZones = () => {
    const { part_zone } = material;
    // 不在高敏区不禁用
    if (!notUseKeyPressList.includes(part_zone)) {
      setIsInitDisabledSubmitButton(false);
    } else {
      setCountDownTime(Date.now() + 1000 * 5);
      setIsInitDisabledSubmitButton(true);
    }
  };

  /**
   * 提交按钮中的倒计时组件 倒计时到了之后打开禁用按钮
   */
  const countDownInSubmitButton = () => {
    const onFinish = () => {
      setIsInitDisabledSubmitButton(false);
    };
    return (
      <>
        {isInitDisabledSubmitButton ? (
          <>
            <span>（</span>
            <Countdown value={countDownTime} format="ss" onFinish={onFinish} valueStyle={{ color: 'red', fontSize: '14px' }} />
            <span>）</span>
          </>
        ) : null}
      </>
    );
  };

  const finallyKeyCodeArr = useMemo(() => {
    let keyCodeArr: ButtonAllNotRequireType[] = [];
    // 这里过滤有快捷键的数据
    // @ts-ignore
    passDataByType[type]?.forEach((item: ButtonAllNotRequireType[]) => {
      Array.isArray(item) &&
        item?.forEach((ele: ButtonAllNotRequireType) => {
          if (ele?.group === 'common') {
            keyCodeArr.push(ele);
          }
        });
    });
    const obj = {
      [PANEL_TYPES.VIDEO]: keyCodeArr,
      [PANEL_TYPES.ARTICLE]: passDataByType[type],
    };

    return obj[type];
  }, [type]);

  /**
   * 监听 曝光审核 图文 通过快捷键处理 监听键码需用数字
   */
  useKeyPress(
    // @ts-ignore
    finallyKeyCodeArr?.map((element: ButtonAllNotRequireType) => Number(element.keycode)),
    event => {
      // @ts-ignore
      useOrforbidenKeyPress(event, finallyKeyCodeArr);
    },
  );

  /**
   * 曝光图文和视频 快捷键 提交标签按钮
   */
  useKeyPress('ctrl.enter', () => {
    if (!isInitDisabledSubmitButton) {
      run();
    }
  });

  /**
   * 初始化按钮是否选中状态 对历史数据打过的标签 回显数据
   */
  const initButtonStatus = () => {
    const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult) : {};
    // 历史数据打过标签
    if (userResult?.labels && userResult?.labels?.length) {
      // 图文通过和驳回都是单独的一组，视频包含很多组，需要调方法处理
      const statusObj = {
        // 驳回 视频+图文
        3002: () => {
          const resultItem = userResult.labels[0];
          const findIndex = rejectDataByType[type]?.flat(Infinity).findIndex((ele: any) => ele.code === resultItem.code);
          const item = rejectDataByType[type]?.flat(Infinity).find((ele: any) => {
            if (ele.code === resultItem.code) {
              // 如果是其他的话 用新的用户输入的数据替换掉之前旧的数据
              if (OTHERS.includes(resultItem.code)) {
                ele.desc = resultItem.desc;
                return ele;
              }
              return ele;
            }
          });
          if (type === PANEL_TYPES.VIDEO || type === PANEL_TYPES.LIVE) {
            updateExposureVideoSourceData(item, findIndex, '');
          } else if (type === PANEL_TYPES.ARTICLE) {
            const data = redButtonRadio(item, findIndex, rejectDataByType[type]);
            setExposureArticleReject(data);
          }
        },
        // 通过 视频+图文
        3001: () => {
          if (type === PANEL_TYPES.VIDEO || type === PANEL_TYPES.LIVE) {
            userResult.labels.forEach((ele: ButtonAllNotRequireType) => {
              const { source, update } = setVideoPassSourceToUpdate()[ele.group!];
              const item = source()?.find((items: any) => items.code === ele.code);
              const idx = source()?.findIndex((items: any) => items.code === ele.code);
              // @ts-ignore
              if (OTHERS.includes(ele.code)) {
                item.desc = ele.desc;
              }
              // 非common 非多选
              if (ele.group! !== 'common') {
                updateExposureVideoSourceData(item, idx, ele.group!);
              } else {
                // 多选按钮
                const indexArr = userResult.labels
                  .filter((value: ButtonAllNotRequireType) => value.group === 'common')
                  .map((ele: ButtonAllNotRequireType) => {
                    return source().findIndex((items: any) => items.code === ele.code);
                  });
                const data = blueButtonCheckbox(indexArr, source());
                update(data);
              }
            });
          } else if (type === PANEL_TYPES.ARTICLE) {
            // 多选按钮。
            const indexArr = userResult.labels.map((ele: ButtonAllNotRequireType) => {
              // @ts-ignore
              return passDataByType[type].findIndex((items: ToInitButtonGroupType) => items.code === ele.code);
            });
            // @ts-ignore
            const data = blueButtonCheckbox(indexArr, passDataByType[type]);
            setExposureArticlePassAll(data);
          }
        },
      };
      statusObj[userResult.status]();
      // TODO: btn data init complete listener
      isInspection && setInitFlag(true);
    }
  };

  /**
   * 是否选中了拒绝的某一个标签🏷️项
   * return  是否选中的boolean
   */
  const isSelectedRejectItem = () => {
    /**
     * 逻辑解析 非此即彼 没选驳回那就是通过
     */
    const rejectItem = rejectDataByType[type]?.flat(Infinity).find((ele: ButtonAllNotRequireType) => ele.danger);

    if (rejectItem) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 点击按钮之后需要选择 当前按钮让其失去焦点
   * @param code 当前按钮标签的code
   */
  const blurActiveAfterClickButtonTag = (code: number | string) => {
    // 否则 在按钮点击之后将对应的元素失去焦点 解决ctrl+enter快解决冲突问题
    const ele: HTMLLIElement | null = document.querySelector(`[data-id="${code}"]`);
    ele?.blur();
  };

  /**
   * 切换选中和未选中按钮的状态
   * @param draft 当前需要执行的数组
   * @param type 按钮类型
   * @param danger 按钮是否变红
   * @param disabled 是否禁用按钮
   */
  const toggleRadioButtonStatus = (item: ButtonAllNotRequireType, draft: ButtonAllType, type: ButtonType, danger: boolean, disabled: boolean) => {
    draft.forEach((ele: ButtonAllNotRequireType) => {
      // 重新选择之后，全部都清掉状态
      ele.type = BUTTON_TYPES.DEFAULT;
      ele.danger = false;
      // ele.desc = '';
      // @ts-ignore
      if (!OTHERS.includes(item?.code)) {
        ele.hasInput = false;
      }
      blurActiveAfterClickButtonTag(item?.code!);
      if (item?.code === ele?.code) {
        ele.type = type;
        ele.danger = danger;
        // 如果点击的是"其他"按钮 每次都初始化other的自定义数据
        // @ts-ignore
        if (OTHERS.includes(item.code)) {
          ele.hasInput = !ele.hasInput;
          ele.desc = item.desc || '';
          if (ele.hasInput) {
            // setTimeout(() => {
            //   // @ts-ignore
            //   otherInputRef.current?.focus();
            // }, 300);
          } else {
            // @ts-ignore
            blurActiveAfterClickButtonTag(item?.code);
          }
        } else {
          blurActiveAfterClickButtonTag(item?.code!);
        }
      } else {
        // ele.disabled = disabled;
      }
    });
  };

  /**
   * 清除通过选中的标签的状态 在点击了拒绝中的任何一项的时候
   */
  const cleanPassTagStatus = (exposurePassData: ButtonAllType) => {
    // 选择了驳回标签 清除已有的通过的标签。
    if (!Array.isArray(exposurePassData)) return [];
    return produce(exposurePassData, (draft: ButtonAllType) => {
      draft.forEach((item: ButtonAllNotRequireType) => {
        item.type = BUTTON_TYPES.DEFAULT;
        item.disabled = false;
        item.hasInput = false;
      });
    });
  };

  /**
   * 选择了通过标签 清除已有的驳回的标签。
   */
  const cleanRejectTagStatus = (exposureRejectData: ButtonAllType) => {
    return produce(exposureRejectData, (draft: ButtonAllType) => {
      draft.forEach((item: ButtonAllNotRequireType) => {
        item.type = BUTTON_TYPES.DEFAULT;
        item.danger = false;
        item.disabled = false;
        // 清掉内容并且初始化文本数据
        if (Reflect.has(item, 'hasInput')) {
          item.hasInput = false;
          item.desc = '';
        }
      });
    });
  };

  /**
   * 设置是否需要互相禁用按钮
   */
  const isDisabledSubmitButton = () => {
    // 这里图文和视频的拒绝集合，只需要判断initRejectData[type]中有没有选择的danger属性就可以知道是通过还是拒绝
    const initRejectData = {
      [PANEL_TYPES.VIDEO]: exposureVideoRejectAll?.flat(Infinity),
      [PANEL_TYPES.ARTICLE]: exposureArticleReject,
      [PANEL_TYPES.LIVE]: exposureLiveCircleRejectAll,
    };
    // TODO: item 出现 undefined 情况，需要排查！！！
    // 只要选中一个，就是拒绝 不通过
    const notPass = initRejectData[type]?.some((item: ButtonAllNotRequireType) => item?.danger);
    return {
      reject: notPass,
      pass: !notPass,
    };
  };

  const tagIsArray = (data: any) => (Array.isArray(data) ? (data.length ? data : []) : []);

  /**
   * 这里因为数据结构的原因，需要在点击切换按钮的时候做一些调整
   * 更新当前组的里的对应被点击的这个按钮的状态，剩下的所有的 ******===******注意 是所有 都被禁止掉
   */
  const setVideoRejectSourceToUpdate = () => {
    return {
      // 视频
      video: {
        source: () => tagIsArray(exposureVideoRejectVideo),
        update: (data: any) => setExposureVideoRejectVideo(data),
      },
      title: {
        source: () => tagIsArray(exposureVideoRejectTitle),
        update: (data: any) => setExposureVideoRejectTitle(data),
      },
      poster: {
        source: () => tagIsArray(exposureVideoRejectPoster),
        update: (data: any) => setExposureVideoRejectPoster(data),
      },
      summary: {
        source: () => tagIsArray(exposureVideoRejectSumary),
        update: (data: any) => setExposureVideoRejectSumary(data),
      },
      other: {
        source: () => tagIsArray(exposureVideoRejectOthers),
        update: (data: any) => setExposureVideoRejectOthers(data),
      },

      // 图文-生活圈
      default: {
        source: () => tagIsArray(exposureLiveCircleRejectAll),
        update: (data: any) => setExposureLiveCircleRejectAll(data),
      },
    };
  };

  /**
   * 设置更新 视频 | 生活圈 通过的数据
   */
  const setVideoPassSourceToUpdate = () => {
    return {
      // 视频
      common: {
        source: () => tagIsArray(exposureVideoPassCommon),
        update: (data: any[]) => setExposureVideoPassCommon(data),
      },
      quality: {
        source: () => tagIsArray(exposureVideoPassQuality),
        update: (data: any[]) => setExposureVideoPassQuality(data),
      },
      timeliness: {
        source: () => tagIsArray(exposureVideoPassTimeliness),
        update: (data: any[]) => setExposureVideoPassTimeliness(data || []),
      },

      // 生活圈
      mobile_column: {
        source: () => tagIsArray(exposureLiveCirclePassMobile),
        update: (data: any[]) => setExposureLiveCirclePassMobile(data || []),
      },
      notify: {
        source: () => tagIsArray(exposureLiveCirclePassNotify),
        update: (data: any[]) => setExposureLiveCirclePassNotify(data || []),
      },
      without_notify: {
        source: () => tagIsArray(exposureLiveCirclePassNoNotify),
        update: (data: any[]) => setExposureLiveCirclePassNoNotify(data || []),
      },
      offline: {
        source: () => tagIsArray(exposureLiveCirclePassOffline),
        update: (data: any[]) => setExposureLiveCirclePassOffline(data || []),
      },
    };
  };

  /**
   * 更新视频中的操作标签组
   */
  const updateExposureVideoSourceData = (item: ButtonAllNotRequireType, index: number, videoType: string) => {
    /**
     * 这里分批更新比较合适 首先更新当前的这一个组中的数据
     * 接下来打入数组，扁平化处理判断 剩余的未更新的要怎么操作
     */
    const updateKey = ['video', 'title', 'poster', 'summary', 'other', 'default'];

    // 临时中转存储数据 最后将此set到exposureVideoRejectAll
    let exposureVideoRejectAllForNow: ButtonAllType = [];
    let newState: CusNewState[] = [];

    // 处理通过的情况
    if (videoType) {
      // common是多选可以复用文章的通用通过 视频其他的通过需要单独处理
      if (videoType === 'common') {
        setVideoPassSourceToUpdate()[videoType].update(blueButtonCheckbox(index, setVideoPassSourceToUpdate()[videoType].source(), item));
      } else {
        const newPassState = blueButtonRadio(videoType, index);
        setVideoPassSourceToUpdate()[videoType].update(newPassState);
      }

      // 清除驳回 挨个清除 然后还需要处理all all在嘴歪头处理
      updateKey.forEach((eleKey: string) => {
        // 挨个清除
        const newRejectState = cleanRejectTagStatus(setVideoRejectSourceToUpdate()[eleKey].source());
        exposureVideoRejectAllForNow.push(newRejectState as ButtonAllNotRequireType);
        // 更新
        setVideoRejectSourceToUpdate()[eleKey].update(newRejectState);
      });
    }
    // 处理拒绝的情况
    else {
      // 遍历 将每一个标题组的数据都处理，处理的是点击按钮的 danger 和别的按钮的 disabled
      updateKey.forEach((eleKey: string) => {
        const newRejectState: ButtonAllType = redButtonRadio(item, index, setVideoRejectSourceToUpdate()[eleKey].source());
        // 将所有数据按照格式存入，在取消和选中的时候 遍历来更新
        newState.push({
          label: eleKey,
          value: newRejectState,
        });
        exposureVideoRejectAllForNow.push(newRejectState as ButtonAllNotRequireType);
      });
      // 如果没有一个被选择就代表的是取消当前的选中
      if (exposureVideoRejectAllForNow?.flat(Infinity).every(ele => !ele.danger)) {
        console.log('取消更新');
        newState.forEach(item => {
          const newRejectState = cleanRejectTagStatus(item.value);
          setVideoRejectSourceToUpdate()[item.label].update(newRejectState);
        });
        exposureVideoRejectAllForNow = [];
      } else {
        console.log('选中');
        newState.forEach(item => setVideoRejectSourceToUpdate()[item.label].update(item.value));
      }
      // 清除通过的工作
      ['common', 'quality', 'timeliness', 'offline', 'notify', 'without_notify', 'mobile_column'].forEach(item => {
        setVideoPassSourceToUpdate()[item].update(cleanPassTagStatus(setVideoPassSourceToUpdate()[item].source()));
      });
    }
    // 这里更新数据是为了切换提交按钮的状态 setIsDisabledSubmitButton中用
    setExposureVideoRejectAll(exposureVideoRejectAllForNow);
  };

  /**
   * 蓝色按钮单选 切换当前按钮类型 切换其他按钮禁止状态
   * @param videoType
   * @param index
   */
  const blueButtonRadio = (videoType: string, index: number) => {
    const { source } = setVideoPassSourceToUpdate()[videoType];
    if (source().length) {
      return produce(setVideoPassSourceToUpdate()[videoType].source(), (draft: ButtonAllType) => {
        // 每次点击之前都先清除掉上次选中的东西
        draft.forEach((ele, idx) => {
          if (idx !== index) {
            ele.type = BUTTON_TYPES.DEFAULT;
            ele.hasInput = false;
          }
        });
        const { type, code } = draft[index] ?? {};
        // @ts-ignore
        const isPassOtherButton = videoType === 'notify' && OTHERS.includes(code);
        // 切换按钮类型 当前的按钮 切换类型 其余的按钮在按钮的类型是 default 的时候不需要dis 在按钮状态是pri的时候需要禁用别的按钮
        if (type === BUTTON_TYPES.DEFAULT) {
          draft[index].type = BUTTON_TYPES.PRIMARY;
          isPassOtherButton && (draft[index].hasInput = true);
        } else {
          draft[index].type = BUTTON_TYPES.DEFAULT;
          isPassOtherButton && (draft[index].hasInput = false);
        }
      });
    }
  };

  /**
   * 红色按钮单选 选中当前 禁止其他 审核和回显的时候都用了
   * @param item
   * @param index
   * @param sourceUpdateData
   */
  const redButtonRadio = (item: ButtonAllNotRequireType, index: number, sourceUpdateData: ButtonAllType) => {
    const newRejectState = produce(sourceUpdateData, (draft: ButtonAllType) => {
      // 点击之前判断当前的按钮是否已经处于被点了的状态 依据就是danger属性
      // 如果不存在，则设置当前的按钮类型以及danger属性 别的按钮禁用
      if (!draft[index]?.danger) {
        toggleRadioButtonStatus(item, draft, BUTTON_TYPES.PRIMARY, true, false);
      } else {
        // 如果被点击了，取消当前的类型以及danger 取消别的按钮的禁用
        toggleRadioButtonStatus(item, draft, BUTTON_TYPES.DEFAULT, false, false);
      }
    });

    // 图文的清除暂时放在这里
    if (type === PANEL_TYPES.ARTICLE) {
      // 选择了驳回标签 清除已有的通过的标签。
      setExposureArticlePassAll(cleanPassTagStatus(exposureArticlePassAll));
    }

    return newRejectState;
  };

  // 图文视频 自见按钮切换选中时 提示
  const showConfirm = (index: number, sourceUpdateData: ButtonAllType) => {
    confirm({
      title: '该doc为自见白名单内容，是否要继续修改为自见状态？',
      icon: <ExclamationCircleOutlined />,
      // content: '',
      cancelText: '否',
      okText: '是',
      onOk() {
        const newPassState = produce(sourceUpdateData, (draft: ButtonAllType) => {
          if (draft[index]?.type === BUTTON_TYPES.PRIMARY) {
            draft[index].type = BUTTON_TYPES.DEFAULT;
          } else {
            draft[index].type = BUTTON_TYPES.PRIMARY;
          }
        });
        if (articlePanel) {
          setExposureArticlePassAll(newPassState);
        }
        if (videoPanel) {
          setVideoPassSourceToUpdate().common.update(newPassState);
        }
      },
      onCancel() {},
    });
  };

  /**
   * 蓝色多选按钮
   * @param item
   * @param index
   * @param sourceUpdateData
   */
  const blueButtonCheckbox = (index: number | number[], sourceUpdateData: ButtonAllType, item?: ButtonAllNotRequireType) => {
    // 利用按钮PRIMARY的属性控制是否选中了当前按钮
    const newPassState = produce(sourceUpdateData, (draft: ButtonAllType) => {
      // 回显用 可能有多选的情况
      if (Array.isArray(index)) {
        const newIndex = index.filter(e => e >= 0);
        newIndex.forEach(idx => {
          draft[idx].type = BUTTON_TYPES.PRIMARY;
        });
      } else {
        if (draft[index]?.type === BUTTON_TYPES.PRIMARY) {
          draft[index].type = BUTTON_TYPES.DEFAULT;
        } else {
          // 自见
          if (selfVisibleFlag && draft[index].code === 'selfvisible') {
            showConfirm(index, sourceUpdateData);
            return;
          }
          draft[index].type = BUTTON_TYPES.PRIMARY;
        }
      }
    });
    // 图文的清除暂时放在这里
    if (type === PANEL_TYPES.ARTICLE) {
      setExposureArticleReject(cleanRejectTagStatus(exposureArticleReject));
    }
    blurActiveAfterClickButtonTag(item?.code!);

    return newPassState;
  };

  /**
   * 更新图文审核按钮组
   * @param item 当前项
   * @param index
   * @param tagType 标签类型 图文是拒绝还是通过 视频有很多的类型
   */
  const updateExposureArticleSourceData = (item: ButtonAllNotRequireType, index: number, tagType: string, sourceUpdateData: ButtonAllType) => {
    const newStateObj = {
      // 图文驳回
      [OperationTagType.reject]: () => redButtonRadio(item, index, sourceUpdateData),
      // 图文通过
      [OperationTagType.pass]: () => blueButtonCheckbox(index, sourceUpdateData, item),
    };
    return newStateObj[tagType]();
  };

  /**
   * 点击按钮切换当前按钮和别的按钮的交互状态
   * @param item 当前项
   * @param index 当前标签位于的index
   * @param tagType 标签类型 图文是拒绝还是通过 视频有很多的类型
   */
  const handleButtonStatusChange = (item: ButtonAllNotRequireType, index: number, tagType: string, videoType?: string) => {
    if (type === PANEL_TYPES.ARTICLE) {
      tagType === OperationTagType.reject
        ? setExposureArticleReject(updateExposureArticleSourceData(item, index, tagType, exposureArticleReject))
        : setExposureArticlePassAll(updateExposureArticleSourceData(item, index, tagType, exposureArticlePassAll));
    } else if (type === PANEL_TYPES.VIDEO || type === PANEL_TYPES.LIVE) {
      tagType === OperationTagType.reject ? updateExposureVideoSourceData(item, index, '') : updateExposureVideoSourceData(item, index, videoType!);
    }
  };

  /**
   * 判断选择的"其他"项 并且"其他"附带的输入框的数据是否为空值
   * return 选中的是others 并且 输入框有值 才是 false 否则是true
   */
  const OthersInputValueIsEmpty = (rejectFalttenData: ButtonAllNotRequireType[]) => {
    // 寻找others这一个项
    // @ts-ignore
    const item = rejectFalttenData.find((ele: ButtonAllNotRequireType) => OTHERS.includes(ele.code));
    // 判断如果当前点的是others 并且 文本框输入有值
    if (!(item?.hasInput && item?.desc)) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * 捕捉审核 通过 “其他” 输入框事件
   * @param event
   */
  const handlePassOthersChange = (event: any) => {
    let shouldUpdateInfoObj = {
      [PANEL_TYPES.LIVE]: (data: ButtonAllType) => {
        return {
          sourceData: exposureLiveCirclePassNotify,
          updateFn: setExposureLiveCirclePassNotify(data),
        };
      },
    };
    const { value } = event.target;
    // @ts-ignore
    const newState = produce(shouldUpdateInfoObj[type]().sourceData, (draft: ButtonAllType) => {
      // 为当前“其他”项设置自定义数据以及设置按钮类型
      draft.forEach((ele: any) => {
        if (OTHERS.includes(ele.code)) {
          ele.desc = value;
          // ele.type = BUTTON_TYPES.PRIMARY;
          if (value === '') {
            ele.hasInput = false;
            ele.type = BUTTON_TYPES.DEFAULT;
          }
        }
      });
    });
    shouldUpdateInfoObj[type](newState).updateFn;
  };

  /**
   * 捕捉审核 驳回 “其他” 输入框事件
   * @param event
   */
  const handleRejectOthersChange = (event: any) => {
    // 准备好需要更新的对象以及方法
    let shouldUpdateInfoObj = {
      [PANEL_TYPES.VIDEO]: (data: ButtonAllType) => {
        return {
          sourceData: exposureVideoRejectOthers,
          updateFn: setExposureVideoRejectOthers(data),
        };
      },
      [PANEL_TYPES.ARTICLE]: (data: ButtonAllType) => {
        return {
          sourceData: exposureArticleReject,
          updateFn: setExposureArticleReject(data),
        };
      },
      [PANEL_TYPES.LIVE]: (data: ButtonAllType) => {
        return {
          sourceData: exposureLiveCircleRejectAll,
          updateFn: setExposureLiveCircleRejectAll(data),
        };
      },
    };
    const { value } = event.target;
    // @ts-ignore
    const newState = produce(shouldUpdateInfoObj[type]().sourceData, (draft: ButtonAllType) => {
      // 为当前“其他”项设置自定义数据以及设置按钮类型
      draft.forEach((ele: any) => {
        if (OTHERS.includes(ele.code)) {
          ele.desc = value;
          ele.danger = true;
          ele.type = BUTTON_TYPES.PRIMARY;
        }
      });
    });
    shouldUpdateInfoObj[type](newState).updateFn;
    // // 这里需要处理有数据和无数据的情况
    // if (value) {
    //   // @ts-ignore
    //   const newState = produce(shouldUpdateInfoObj[type]().sourceData, (draft: ButtonAllType) => {
    //     // 为当前“其他”项设置自定义数据以及设置按钮类型
    //     draft.forEach((ele: any) => {
    //       if (OTHERS.includes(ele.code)) {
    //         ele.desc = value;
    //         ele.danger = true;
    //         ele.type = BUTTON_TYPES.PRIMARY;
    //       }
    //     });
    //   });
    //   shouldUpdateInfoObj[type](newState).updateFn;
    // } else {
    //   // 无数据的时候需要将拒绝按钮的所有状态都清除
    //   // 如何清除？就选择“其他” 相当于再点一次“其他”
    //   // @ts-ignore
    //   const item = shouldUpdateInfoObj[type]().sourceData.find((ele: ButtonAllNotRequireType) => OTHERS.includes(ele.code))!;
    //   // @ts-ignore
    //   const index = shouldUpdateInfoObj[type]().sourceData.findIndex((ele: ButtonAllNotRequireType) => OTHERS.includes(ele.code));
    //   handleButtonStatusChange(item, index, OperationTagType.reject);
    // }
  };

  /**
   * 返回一组可以点击的按钮组
   * @param btnData 原始数据用于初始化渲染按钮内容
   * @param title
   * @param tagType
   */
  const returnBtnGroup = (btnData: Array<any>, title: string, tagType: string, videoType?: string) => {
    return Array.isArray(btnData) && btnData.length > 0 ? (
      <div className="common-btn">
        <h3 className="gray-color">{title}</h3>
        <div className="tag-group">
          {btnData.map((item, idx) => {
            return (
              <React.Fragment key={idx + item.code}>
                <div className={btnCountPerRow ? 'trisection-two' : isVideo ? 'trisection-video' : 'trisection-default'} key={idx + item.code}>
                  <Button
                    className={`btn-dis ${tagType}`}
                    disabled={item.disabled}
                    onClick={() => handleButtonStatusChange(item, idx, tagType, videoType)}
                    type={item.type}
                    danger={item.danger}
                    data-id={item.code}
                  >
                    <span className="label-text">{item.label}</span>
                    <span className="key-code">{item.keyname}</span>
                  </Button>
                </div>
                {item.hasInput && item.danger && (
                  <div className={btnCountPerRow ? 'trisection-two' : isVideo ? 'trisection-video' : 'trisection-default'} key={idx + item.code}>
                    <Input.Group compact>
                      <Input
                        placeholder="请输入拒绝理由"
                        value={item.desc}
                        onChange={handleRejectOthersChange}
                        maxLength={10}
                        style={{ width: 150, margin: '0 10px 10px 0' }}
                        // ref={otherInputRef}
                      />
                    </Input.Group>
                  </div>
                )}
                {item.hasInput && !item.danger && (
                  <div className={btnCountPerRow ? 'trisection-two' : isVideo ? 'trisection-video' : 'trisection-default'} key={idx + item.code}>
                    <Input.Group>
                      <Input
                        placeholder="请输入通过理由"
                        value={item.desc}
                        onChange={handlePassOthersChange}
                        style={{ width: 150, margin: '0 10px 10px 0' }}
                        // ref={passOtherInputRef}
                      />
                    </Input.Group>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    ) : null;
  };

  /**
   * 曝光审核的操作按钮组
   * @param type 这type的作用是用于区分 曝光审核的 图文和视频 因为模版不同
   */
  const exposureOpe = (type: string) => {
    const distributeComponents = {
      [PANEL_TYPES.ARTICLE]: () => (
        <div className="ope-btn-group">
          {returnBtnGroup(exposureArticleReject, '驳回', OperationTagType.reject)}
          {returnBtnGroup(exposureArticlePassAll, '通过', OperationTagType.pass)}
        </div>
      ),
      [PANEL_TYPES.VIDEO]: () => (
        <div className="ope-btn-group">
          {returnBtnGroup(exposureVideoRejectVideo, '驳回 - 视频', OperationTagType.reject)}
          {returnBtnGroup(exposureVideoRejectTitle, '驳回 - 标题', OperationTagType.reject)}
          {returnBtnGroup(exposureVideoRejectPoster, '驳回 - 封面', OperationTagType.reject)}
          {returnBtnGroup(exposureVideoRejectSumary, '驳回 - 简介', OperationTagType.reject)}
          {returnBtnGroup(exposureVideoRejectOthers, '驳回 - 其他', OperationTagType.reject)}
          {returnBtnGroup(exposureVideoPassCommon, '通过 - 通用', OperationTagType.pass, 'common')}
          {returnBtnGroup(exposureVideoPassQuality, '通过 - 视频质量', OperationTagType.pass, 'quality')}
          {returnBtnGroup(exposureVideoPassTimeliness, '通过 - 时效性', OperationTagType.pass, 'timeliness')}
        </div>
      ),
      [PANEL_TYPES.LIVE]: () => (
        <div className="ope-btn-group">
          {returnBtnGroup(exposureLiveCircleRejectAll, '驳回', OperationTagType.reject)}
          {returnBtnGroup(exposureLiveCirclePassOffline, '通过 - 下线', OperationTagType.pass, 'offline')}
          {returnBtnGroup(exposureLiveCirclePassNotify, '通过 - 通知', OperationTagType.pass, 'notify')}
          {returnBtnGroup(exposureLiveCirclePassNoNotify, '通过 - 不通知', OperationTagType.pass, 'without_notify')}
          {returnBtnGroup(exposureLiveCirclePassMobile, '通过 - 移动栏目', OperationTagType.pass, 'mobile_column')}
        </div>
      ),
    };
    return distributeComponents[type]();
  };

  /**
   * 将提交函数放在防抖中
   */
  const { run } = useDebounceFn(() => handleExposureSubmit(), {
    wait: 400,
  });
  /**
   * 提交按钮之前先判断 拒绝里的“其他”是不是被点击了并且有没有输入数据
   * 不满足这个条件直接提示
   * 否则正常提交
   */
  const handleExposureSubmit = () => {
    /**
     * 这里的逻辑应该是先去判断 现在有没有选择拒绝项目，再去看拒绝项目里有没有选择“其他”并且如果选了其他的话需要判断其他附带的输入框的数据是否为空
     */
    // 处理视频的兼容 ???
    if (type === PANEL_TYPES.VIDEO) {
      const flatVideoArr = rejectDataByType[type];
      const LEN = flatVideoArr.length;
      LEN ? flatVideoArr.splice(LEN - 2, 1, exposureVideoRejectOthers) : [];
      setExposureVideoRejectAll(flatVideoArr);
    }
    const rejectFalttenData = rejectDataByType[type]?.flat(Infinity);

    // 如果选择了“其他” 并且 输入的值为空 通过type晒出来的数据
    if (
      // @ts-ignore
      rejectFalttenData.find((item: ButtonAllNotRequireType) => OTHERS.includes(item.code) && item.danger) &&
      !OthersInputValueIsEmpty(rejectFalttenData)
    ) {
      message.warning('其他理由输入不可以为空！请仔细确认');
      return false;
    }
    let selectedSourceEle: Array<ToInitButtonGroupType> = [];

    if (isSelectedRejectItem()) {
      selectedSourceEle = rejectFalttenData.filter((item: ButtonAllNotRequireType) => item.danger);
    } else {
      if (type === PANEL_TYPES.VIDEO) {
        selectedSourceEle = [exposureVideoPassCommon, exposureVideoPassQuality, exposureVideoPassTimeliness]
          .filter(e => e.length)
          ?.flat(1)
          .filter((item: ButtonAllNotRequireType) => item.type === BUTTON_TYPES.PRIMARY);
      } else if (type === PANEL_TYPES.LIVE) {
        selectedSourceEle = [
          exposureLiveCirclePassMobile,
          exposureLiveCirclePassNotify,
          exposureLiveCirclePassOffline,
          exposureLiveCirclePassNoNotify,
        ]
          .filter(e => e.length)
          ?.flat(1)
          .filter((item: ButtonAllNotRequireType) => item.type === BUTTON_TYPES.PRIMARY);
      } else {
        // @ts-ignore
        selectedSourceEle = passDataByType[type]?.flat(Infinity).filter((item: ButtonAllNotRequireType) => item.type === BUTTON_TYPES.PRIMARY);
      }
    }

    const selectedAfterFilterKey: Array<ToInitButtonGroupType> = selectedSourceEle?.map((ele: ButtonAllNotRequireType) => {
      return {
        code: ele.code || '',
        label: ele.label || '',
        desc: ele.desc || '',
        keyname: ele.keyname || '',
        keycode: ele.keycode || '',
        group: ele.group || '',
      };
    });

    // 审核参数
    const requestData = submitTaskParamsInAuditOperation(
      material,
      isDisabledSubmitButton().pass ? 3001 : 3002,
      isDisabledSubmitButton().pass ? 'pass' : 'not-pass',
      selectedAfterFilterKey || [],
    );

    // TODO: 质检业务 "checkorResult":"approve 无异议 adjust 重新审核"
    if (isInspection) {
      // @ts-ignore
      requestData.checkorResult = changeStatus ? 'adjust' : 'approve';
    }

    handleTaskSubmit([requestData], false, reloadCallBack);
  };

  useEffect(() => {
    isDisabledSubmitButtonByPartZones();
    initButtonStatus();
  }, []);

  // 质检业务 btn data init complete listener 按钮数据初始化完成的监听
  const [initFlag, setInitFlag] = useState(false);
  // 质检业务
  const originBtnDataRef = useRef([]);
  useEffect(() => {
    // const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult) : {};
    // console.log(userResult);
    // const labels = userResult?.labels ?? [];
    const btnData = {
      [PANEL_TYPES.ARTICLE]: [...exposureArticleReject, ...exposureArticlePassAll].map((item: any) => {
        // const isOther = OTHERS.includes(item.code);
        // const hasInputStatus = isOther && labels.some((labelItem: any) => OTHERS.includes(labelItem.code));
        // console.log(item.code, hasInputStatus);
        return {
          ...item,
          // TODO: 按钮更新之后会有新增字段 hasInput , 质检业务需要做前后数据快照的对比 所以 hasInput 这个字段需要初期补上
          // @ts-ignore
          // hasInput: false, //hasInputStatus,
        };
      }),
      [PANEL_TYPES.VIDEO]: [
        ...exposureVideoRejectVideo,
        ...exposureVideoRejectTitle,
        ...exposureVideoRejectPoster,
        ...exposureVideoRejectSumary,
        ...exposureVideoRejectOthers,
        ...exposureVideoPassCommon,
        ...exposureVideoPassQuality,
        ...exposureVideoPassTimeliness,
      ].map((item: any) => {
        // const isOther = OTHERS.includes(item.code);
        // const hasInputStatus = isOther && labels.some((labelItem: any) => OTHERS.includes(labelItem.code));
        // console.log(item.code, hasInputStatus);
        return {
          ...item,
          // TODO: 按钮更新之后会有新增字段 hasInput , 质检业务需要做前后数据快照的对比 所以 hasInput 这个字段需要初期补上
          // @ts-ignore
          // hasInput: false, //hasInputStatus,
        };
      }),
    };
    // @ts-ignore
    originBtnDataRef.current = btnData[type] || [];
  }, [initFlag]);

  // 质检业务 标签状态是否修改
  const [changeStatus, setChangeStatus] = useState(!isInspection);
  // 质检业务 图文
  useEffect(() => {
    if (isInspection && articlePanel) {
      const originData = JSON.stringify([...originBtnDataRef.current].map(({ hasInput, ...other }: any) => other));
      const newData = JSON.stringify([...exposureArticleReject, ...exposureArticlePassAll].map(({ hasInput, ...other }: any) => other));
      setChangeStatus(originData !== newData);
    }
  }, [JSON.stringify([...exposureArticleReject, ...exposureArticlePassAll])]);

  // 质检业务 视频
  useEffect(() => {
    if (isInspection && videoPanel) {
      const originData = JSON.stringify([...originBtnDataRef.current].map(({ hasInput, ...other }: any) => other));
      const newData = JSON.stringify(
        [
          ...exposureVideoRejectVideo,
          ...exposureVideoRejectTitle,
          ...exposureVideoRejectPoster,
          ...exposureVideoRejectSumary,
          ...exposureVideoRejectOthers,
          ...exposureVideoPassCommon,
          ...exposureVideoPassQuality,
          ...exposureVideoPassTimeliness,
        ].map(({ hasInput, ...other }: any) => other),
      );
      setChangeStatus(originData !== newData);
    }
  }, [
    JSON.stringify([
      ...exposureVideoRejectVideo,
      ...exposureVideoRejectTitle,
      ...exposureVideoRejectPoster,
      ...exposureVideoRejectSumary,
      ...exposureVideoRejectOthers,
      ...exposureVideoPassCommon,
      ...exposureVideoPassQuality,
      ...exposureVideoPassTimeliness,
    ]),
  ]);

  return (
    <div className="card operation">
      <h3>审核操作</h3>
      <div className="btn-group">{exposureOpe(type)}</div>
      <div className="sub-btn-group">
        {!changeStatus ? (
          <Button name="质检-结果无异" size="large" type="primary" onClick={run} className="ant-btn-success">
            <div className="count-down-box">结果无异 {countDownInSubmitButton()}</div>
            <span>CRTL + ENTER</span>
          </Button>
        ) : (
          <>
            <Button
              name="曝光审核-驳回"
              size="large"
              type="primary"
              danger
              disabled={isInitDisabledSubmitButton || isDisabledSubmitButton().pass}
              onClick={run}
            >
              <div className="count-down-box">驳回 {countDownInSubmitButton()}</div>
              <span>CRTL + ENTER</span>
            </Button>
            <Button
              name="曝光审核-通过"
              size="large"
              type="primary"
              disabled={btnGroupStatus || isInitDisabledSubmitButton || isDisabledSubmitButton().reject}
              onClick={run}
            >
              <div className="count-down-box">通过 {countDownInSubmitButton()}</div>
              <span>CRTL + ENTER</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleOperationPanel;
