/**
 * 啫喱多审 审核操作组件
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useKeyPress } from 'ahooks';
import produce from 'immer';

import { Button, message, Input } from 'antd';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';

import { BtnGroupTypes, ButtonType, ToInitButtonGroupType } from '@/types';

import './index.less';

enum OperationTagType {
  reject = 'reject',
  pass = 'pass',
}

type BUTTON_TYPE = {
  [K: string]: ButtonType;
};

export type ButtonAllNotRequireType = Partial<BtnGroupTypes>;

type ButtonAllType = Array<ButtonAllNotRequireType>;

const OTHERS = ['other', 'rej_others', 'pas_ntfy_others'];
const BUTTON_TYPES: BUTTON_TYPE = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
};

const PANEL_TYPES: { ARTICLE: string } = {
  ARTICLE: 'article', // 图文
};

// 高敏一区A、B、C\马甲号领导人区 不需要快捷键并且需要10s之后才能开始提交审核结果
const notUseKeyPressList = [5000, 5001, 5628];

interface ZenLyOperationPanelProps {
  data: any; // 待审内容数据 all
  tagDataSource: any; // 审核标签数据
  addTagCallback: (result: any) => void; // 审核结果回调
}

const ZenLyOperationPanel: React.FC<ZenLyOperationPanelProps> = ({ tagDataSource, data, addTagCallback }) => {
  const type: string = 'article';

  // panel 类型
  const articlePanel = type === 'article';

  // 曝光图文审核按钮组
  const [exposureArticlePassAll, setExposureArticlePassAll] = useState<ButtonAllType>(articlePanel ? tagDataSource?.pass?.default ?? [] : []);
  const [exposureArticleReject, setExposureArticleReject] = useState<ButtonAllType>(articlePanel ? tagDataSource?.reject?.default ?? [] : []);

  // 通过type来获取pass的数据
  const passDataByType = {
    [PANEL_TYPES.ARTICLE]: exposureArticlePassAll,
  };

  // 通过type来获取reject的数据
  const rejectDataByType = {
    [PANEL_TYPES.ARTICLE]: exposureArticleReject,
  };

  /**
   * 是否选中了拒绝的某一个标签🏷️项
   * return  是否选中的boolean
   */
  const isSelectedRejectItem = () => {
    const rejectItem = rejectDataByType[type]?.flat(Infinity).find((ele: ButtonAllNotRequireType) => ele.danger);
    if (rejectItem) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 设置是否需要互相禁用按钮
   */
  const isDisabledSubmitButton = () => {
    // 这里图文和视频的拒绝集合，只需要判断initRejectData[type]中有没有选择的danger属性就可以知道是通过还是拒绝
    const initRejectData = {
      [PANEL_TYPES.ARTICLE]: exposureArticleReject,
    };
    // 只要选中一个，就是拒绝 不通过
    const notPass = initRejectData[type]?.some((item: ButtonAllNotRequireType) => item?.danger);
    return {
      reject: notPass,
      pass: !notPass,
    };
  };

  // console.log(JSON.stringify(exposureArticlePassAll), JSON.stringify(exposureArticleReject));

  // 打标 状态更新监测 其他问题 按钮因为需要填写内容 需特殊处理
  // 状态更新监测, exposureArticlePassAll, exposureArticleReject;
  useEffect(() => {
    dataCallback();
  }, [JSON.stringify(exposureArticlePassAll), JSON.stringify(exposureArticleReject)]);

  // 选择其他输入内容确定
  const handelOtherConfirm = () => {
    const rejectFlattenData = rejectDataByType[type]?.flat(Infinity);
    const selectedSourceEle = rejectFlattenData.filter((item: ButtonAllNotRequireType) => item.danger);

    if (selectedSourceEle[0]?.desc?.length === 0) {
      message.error('请输入拒绝理由，否则不可以选择此标签！');
    } else {
      dataCallback(true);
    }
  };

  // 打标回调 向上传递数据
  const dataCallback = (ignoreOther: boolean = false) => {
    const rejectFlattenData = rejectDataByType[type]?.flat(Infinity);
    let selectedSourceEle: Array<ToInitButtonGroupType> = [];
    const rejectStatus = isSelectedRejectItem();

    // 审核 驳回
    if (rejectStatus) {
      selectedSourceEle = rejectFlattenData.filter((item: ButtonAllNotRequireType) => item.danger);
    } else {
      selectedSourceEle = passDataByType[type]?.flat(Infinity).filter((item: ButtonAllNotRequireType) => item.type === BUTTON_TYPES.PRIMARY);
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

    const result = submitTaskParamsInAuditOperation(
      data,
      isDisabledSubmitButton().pass ? 3001 : 3002,
      isDisabledSubmitButton().pass ? 'pass' : 'not-pass',
      selectedAfterFilterKey || [],
    );
    // // 是否关闭 popover 弹窗内容
    // const closePopover = !!selectedAfterFilterKey.length;

    // 其他问题 按钮特殊处理 return
    // @ts-ignore
    if (!ignoreOther && rejectStatus && selectedAfterFilterKey?.length && OTHERS.includes(selectedAfterFilterKey[0].code)) return;
    addTagCallback(result);
  };

  /**
   * 确认当前领取的任务是否需要禁用快捷键
   * @param event 键盘事件
   */
  const useOrforbidenKeyPress = (event: KeyboardEvent, keyCodeFilterArr: ButtonAllNotRequireType[]) => {
    const {
      material: { part_zone },
    } = data;
    if (!notUseKeyPressList.includes(part_zone)) {
      // 获取当前快捷键对应的数据元素以及索引用于切换标签按钮的状态
      const item = keyCodeFilterArr.find((ele: ButtonAllNotRequireType) => ele?.keyname?.toLowerCase() === event?.code.toLowerCase())!;
      const index = keyCodeFilterArr.findIndex((ele: ButtonAllNotRequireType) => ele?.keyname?.toLowerCase() === event?.code.toLowerCase());
      handleButtonStatusChange(item, index, OperationTagType.pass, 'common');
    } else {
      message.warning('当前分区任务禁止使用快捷键！');
    }
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
        // 切换按钮类型
        if (draft[index]?.type === BUTTON_TYPES.PRIMARY) {
          draft[index].type = BUTTON_TYPES.DEFAULT;
        } else {
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
      if (tagType === OperationTagType.reject) {
        const result = updateExposureArticleSourceData(item, index, tagType, exposureArticleReject);
        setExposureArticleReject(result);
      } else {
        const result = updateExposureArticleSourceData(item, index, tagType, exposureArticlePassAll);
        setExposureArticlePassAll(result);
      }
    }
  };

  /**
   * 捕捉审核 驳回 “其他” 输入框事件
   * @param event
   */
  const handleRejectOthersChange = (event: any) => {
    // 准备好需要更新的对象以及方法
    let shouldUpdateInfoObj = {
      [PANEL_TYPES.ARTICLE]: (data: ButtonAllType) => {
        return {
          sourceData: exposureArticleReject,
          updateFn: setExposureArticleReject(data),
        };
      },
    };
    const { value } = event.target;
    // console.log(value);
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

    // 这里需要处理有数据和无数据的情况
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
              <React.Fragment key={idx}>
                <div className="trisection-zenly" key={idx}>
                  <Button
                    className={`btn-dis ${tagType}`}
                    disabled={item.disabled}
                    onClick={() => handleButtonStatusChange(item, idx, tagType, videoType)}
                    type={item.type}
                    danger={item.danger}
                    data-id={item.code}
                  >
                    <span style={{ padding: '0px 14px', marginRight: 10 }}>{item.label}</span>
                    <span className="key-code">{item.keyname}</span>
                  </Button>
                </div>
                {item.hasInput && item.danger && (
                  <Input.Group compact>
                    <Input placeholder="请输入拒绝理由" value={item.desc} onChange={handleRejectOthersChange} maxLength={10} style={{ width: 150 }} />
                    <Button type="primary" onClick={handelOtherConfirm}>
                      确定
                    </Button>
                  </Input.Group>
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
    };
    return distributeComponents[type]();
  };

  return (
    <div className="card operation">
      <h3>审核操作</h3>
      <div className="btn-group">{exposureOpe(type)}</div>
    </div>
  );
};

export default ZenLyOperationPanel;
