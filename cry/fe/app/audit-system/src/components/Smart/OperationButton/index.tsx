/**
 * 这个组件是按照接口来交互的 接口配置的单选还是多选还是什么的
 */
import React, { useState } from 'react';
import produce from 'immer';

import { Tag, Input } from 'antd';

import { BtnGroupTypes } from '@/types';

import './index.less';

const { CheckableTag } = Tag;

export type tagTypes = 'business_type' | 'business_unit_type' | 'material_type';
export type resultTags = 'cancelCheckbox' | 'cancelRadio' | 'notCancelRadio';

export type AuditLabel = {
  groupCn: string;
  colorStyle: string;
  inputType: string;
  cancelable: boolean;
  labels: Partial<BtnGroupTypes>[];
};

export type ResultTags = Record<resultTags, string[]>;

export type InitTagsType<T> = {
  desc: string;
  labels: T;
  status: number;
};

interface IExposureLabelPanel {
  isVideo: boolean;
  handleUserTag: (result: { [K: string]: AuditLabel[] }) => void; // 回传选中的标签数据
  auditLabels: AuditLabel[];
  disabled: boolean;
  initInfo: {
    tag: InitTagsType<Partial<BtnGroupTypes>[]>;
    result: ResultTags;
  };
}

const OperationButton: React.FC<IExposureLabelPanel> = ({ auditLabels, isVideo, handleUserTag, disabled, initInfo }) => {
  // 单选可以取消的标签
  const [selectedCancelRadioTags, setSelectedCancelRadioTags] = useState<string[]>(initInfo?.result?.cancelRadio);
  // 多选可以取消的标签
  const [selectedCancelCheckboxTags, setSelectedCancelCheckboxTags] = useState<string[]>(initInfo?.result?.cancelCheckbox);
  // 单选无法取消的标签
  const [selectedNotCancelRadioTags, setSelectedNotCancelRadioTags] = useState<string[]>(initInfo?.result?.notCancelRadio);

  // 获取单选结果数据
  const getRadioResult = (tag: string[]) => {
    let result: AuditLabel[] = [];
    auditLabels?.forEach(item => {
      const { labels, ...other } = item;
      result.push({ ...other, labels: item?.labels?.filter(ele => ele?.code === tag[0]) });
    });
    return result;
  };

  // 模拟可以取消的单选
  const handleUseCancelRadioTagChange = (tag: string, checked: boolean, index: number) => {
    const nextSelectedTags = checked ? (tag ? [tag] : []) : initInfo?.result?.cancelRadio?.filter((t: string) => t !== tag);
    setSelectedCancelRadioTags(nextSelectedTags);
    // console.log('tag', tag, nextSelectedTags);
    let result: AuditLabel[] = getRadioResult(nextSelectedTags);
    handleUserTag && handleUserTag({ cancelRadio: [result[index]] });
  };

  // 可以取消的多选
  const handleUseCancelCheckboxTagChange = (tag: string, checked: boolean, index: number) => {
    const nextSelectedTags = checked
      ? tag
        ? [...(initInfo?.result?.cancelCheckbox || []), tag]
        : []
      : initInfo?.result?.cancelCheckbox?.filter((t: string) => t !== tag);

    // 先获取父级的一些数据，因为变的只是labels
    let outerData: Omit<AuditLabel, 'labels'>[] = [];
    auditLabels?.forEach(ele => {
      const { labels, ...other } = ele;
      ele?.labels?.forEach(item => {
        if (item?.code === tag) {
          outerData.push(other);
        }
      });
    });

    // 每次多选变动都单独筛选labels
    let labels: Partial<BtnGroupTypes>[] = [];
    nextSelectedTags?.forEach(item => {
      auditLabels![index]?.labels.forEach(ele => {
        if (ele.code === item) {
          labels = [...labels, ele];
        }
      });
    });

    // 将两次的数据组合起来
    let result: AuditLabel[] = [{ ...outerData[0], labels }];
    handleUserTag && handleUserTag({ cancelCheckbox: result });
    setSelectedCancelCheckboxTags(nextSelectedTags);
  };

  // 单选 不可以取消
  const handleNotCancelRadio = (tag: string, index: number) => {
    let result: AuditLabel[] = getRadioResult([tag]);
    handleUserTag && handleUserTag({ notCancelRadio: [result[index]] });
    setSelectedNotCancelRadioTags([tag]);
  };

  // 其他 选项 input 修改监听
  const handleInputChange = (tag: string, checked: boolean, index: number, value: string) => {
    const nextSelectedTags = checked ? (tag ? [tag] : []) : initInfo?.result?.cancelRadio?.filter((t: string) => t !== tag);
    setSelectedCancelRadioTags(nextSelectedTags);
    let result: AuditLabel[] = getRadioResult(nextSelectedTags);
    const newState = produce(result, draft => {
      draft[index].labels[0].desc = value;
    });
    handleUserTag && handleUserTag({ cancelRadio: [newState[index]] });
  };

  return (
    <>
      {Array.isArray(auditLabels) &&
        auditLabels.map((item: AuditLabel, idx) => {
          return (
            <div key={idx} className={`common-btn exposure mb10 ${item.colorStyle}-color`}>
              <h4 className="gray-color">{item.groupCn}</h4>
              <div className={isVideo ? 'trisection-video' : 'trisection-default'} key={idx}>
                {item.labels.map((ele, index) => {
                  return (
                    <span key={`${ele}-${index}`} className={`tags ${item.labels.length > 4 ? 'mb10' : ''}`}>
                      {/* 单选且能取消 */}
                      {item.inputType === 'radio' && item.cancelable && (
                        <>
                          <CheckableTag
                            className={`${disabled ? 'disabled-tag' : ''}`}
                            checked={initInfo?.result?.cancelRadio?.includes(`${ele.code}`) || false}
                            onChange={checked => handleUseCancelRadioTagChange(`${ele.code}`, checked, idx)}
                          >
                            {ele.label}
                          </CheckableTag>
                          {/* 啫喱素材 其他按钮逻辑 else */}
                          {ele.code === 'else' && initInfo?.result?.cancelRadio?.includes(`${ele.code}`) ? (
                            <Input
                              disabled={disabled}
                              defaultValue={ele.desc}
                              maxLength={10}
                              placeholder="请输入拒绝理由"
                              onChange={({ target: { value } }: any) => handleInputChange(`${ele.code}`, true, idx, value)}
                            />
                          ) : null}
                        </>
                      )}
                      {/* 多选且能取消 */}
                      {item.inputType === 'checkbox' && item.cancelable && (
                        <CheckableTag
                          className={`${disabled ? 'disabled-tag' : ''}`}
                          checked={initInfo?.result?.cancelCheckbox?.includes(`${ele.code}`) || false}
                          onChange={checked => handleUseCancelCheckboxTagChange(`${ele.code}`, checked, idx)}
                        >
                          {ele.label}
                        </CheckableTag>
                      )}
                      {/* 单选且无法取消 */}
                      {item.inputType === 'radio' && !item.cancelable && (
                        <CheckableTag
                          className={`${disabled ? 'disabled-tag' : ''}`}
                          checked={initInfo?.result?.notCancelRadio?.includes(`${ele.code}`) || false}
                          onChange={() => handleNotCancelRadio(`${ele.code}`, idx)}
                        >
                          {ele.label}
                        </CheckableTag>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default OperationButton;
