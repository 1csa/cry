/**
 * 质量标注 图文/视频
 */
import React, { useState, useEffect } from 'react';
// import { useSelector } from 'dva';
import { useDebounceFn } from 'ahooks';
import { Card, Radio, Checkbox, Button } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
// import { parseUserReviewResult } from '@/components/BusinessLogic/parseReshowData';
import handleTaskSubmit from './handleTaskSubmit';

import { QUALITYPANEL, QUALITYPANELCHECKBOX, ARTICLEATTRS, allList } from '@/data/articleQuality';
// import { CommonLogicState, ConnectState } from '@/models/connect';

import { isJSON } from '@/utils/dev_helper';

import './index.less';

type RenderTags = (title: string, tags: typeof QUALITYPANEL, level: number, current: string) => {};

type RenderTagsParams = Parameters<RenderTags>;
interface IQualityPanel {
  isVideo: boolean;
  // accountLv: number;
  material: any;
  userReviewResult: string; // 人审结果
  reloadCallBack: () => void;
  isInspection?: boolean; // 是否质检业务 默认 false
}

const QualityPanel: React.FC<IQualityPanel> = ({ isVideo /*, accountLv */, reloadCallBack, material, userReviewResult, isInspection = false }) => {
  // const commonLogic = useSelector<ConnectState, CommonLogicState>(state => state.commonLogic);
  // const data_id = sessionStorage?.data_id;
  // const initResult = useMemo(() => parseUserReviewResult(commonLogic), [data_id]);

  // // 打标 质量
  // const [currentQualitySelected, setCurrentQualitySelected] = useState<string>(initResult?.quality || 'highQuality');
  // // 打标 属性
  // const [currentArticleAttrSelected, setCurrentArticleAttrSelected] = useState<string>(initResult?.timeliness || '');
  // const [checkBoxReasonValue, setCheckBoxReasonValue] = useState<CheckboxValueType[]>(initResult?.reason || []);

  // 打标 质量
  const [currentQualitySelected, setCurrentQualitySelected] = useState<string>('highQuality');
  // 打标 属性
  const [currentArticleAttrSelected, setCurrentArticleAttrSelected] = useState<string>('');
  const [checkBoxReasonValue, setCheckBoxReasonValue] = useState<CheckboxValueType[]>([]);
  const [checkBoxReasonTextValue, setCheckBoxReasonTextValue] = useState<CheckboxValueType[]>([]);
  const { run } = useDebounceFn(() => handleSubmit(), {
    wait: 500,
  });

  /**
   * 切换质量模块 清除数据 已经更新数据
   * @param event
   * @param level
   */
  const handleQualityTagChange = (event: RadioChangeEvent, level: RenderTagsParams[2]) => {
    const { value } = event?.target;
    if (level === 1 && currentQualitySelected !== value) {
      setCheckBoxReasonValue([]);
      setCheckBoxReasonTextValue([]);
      setCurrentArticleAttrSelected('');
    }
    level === 1 && setCurrentQualitySelected(value);
    level === 2 && setCurrentArticleAttrSelected(value);
  };

  // checkbox change
  const handleCheckBoxChange = (checkedValue: CheckboxValueType[]) => {
    setCheckBoxReasonValue(checkedValue);
  };

  // 计算评分
  const calculateScores = () => {
    // const accountLvLow = [1, 2, 3, 4];
    // const accountLvHigh = [5, 6];
    // const cas = {
    //   highQuality: () => {
    //     // 优质原因≥2个 || 优质原因=1个且账号等级为5、6级   5🌟好评
    //     if (checkBoxReasonValue.length >= 2 || (checkBoxReasonValue.length === 1 && accountLvHigh.includes(accountLv))) {
    //       return 5;
    //       // 优质原因=1且账号等级1、2、3、4级   4🌟好评
    //     } else if (checkBoxReasonValue.length === 1 && accountLvLow.includes(accountLv)) {
    //       return 4;
    //     }
    //     // 无质量标签  3🌟好评
    //     return 3;
    //   },
    //   light: 2,
    //   severe: 1,
    //   moderate: 0,
    // };
    // return typeof cas[currentQualitySelected] === 'function' ? cas[currentQualitySelected]() : cas[currentQualitySelected];
    const cas = {
      highQuality: 3,
      light: 2,
      severe: 1,
      moderate: 0,
    };
    return cas[currentQualitySelected];
  };

  // 打标 提交
  const handleSubmit = () => {
    // 优质的时候 文章属性必填项
    // 剩下的时候原因是必填项
    const opts = {
      quality: currentQualitySelected,
      timeliness: currentArticleAttrSelected,
      reasonText: checkBoxReasonTextValue,
      reason: checkBoxReasonValue,
    };
    // 审核参数
    const requestData = submitTaskParamsInAuditOperation(material, 3001, 'pass', [{ ...opts, ...{ score: calculateScores() } }]);

    // TODO: 质检业务 "checkorResult":"approve 无异议 adjust 重新审核"
    if (isInspection) {
      // @ts-ignore
      requestData.checkorResult = changeStatus ? 'adjust' : 'approve';
    }
    handleTaskSubmit([requestData], false, reloadCallBack);
  };

  /**
   * 基础的渲染组件 渲染标题的单选
   * @param title
   * @param tags 单选的内容
   * @param level 1 代表质量 2 代表属性
   * @param current 当前的数据
   * @returns JSX
   */
  const baseRender = (title: RenderTagsParams[0], tags: RenderTagsParams[1], level: RenderTagsParams[2], current: RenderTagsParams[3]) => {
    return (
      <>
        <h3>{title}</h3>
        <Radio.Group name="radiogroup" buttonStyle="solid" onChange={event => handleQualityTagChange(event, level)} value={current}>
          {tags?.map((item, index: number) => (
            <Radio.Button key={item.value + index} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </>
    );
  };

  /**
   * 初始化按钮是否选中状态 对历史数据打过的标签 回显数据
   */
  const initButtonStatus = () => {
    const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult) : {};
    const { labels: [{ quality = 'highQuality', timeliness = '', reason = [], reasonText = [], score = 0 }] = [{}] } = userResult;
    setCurrentQualitySelected(quality);
    setCurrentArticleAttrSelected(timeliness);
    setCheckBoxReasonValue(reason);
    setCheckBoxReasonTextValue(reasonText);
  };

  useEffect(() => {
    initButtonStatus();
  }, []);

  // 提交按钮状态
  const submitBtnDisabled =
    currentQualitySelected === 'highQuality' ? !currentArticleAttrSelected || !currentQualitySelected : checkBoxReasonValue.length === 0;

  // 质检业务 标签状态是否修改
  const [changeStatus, setChangeStatus] = useState(!isInspection);
  // 质检业务
  useEffect(() => {
    //为了拿到质检标签
    const arrcheckBoxReasonText = allList.filter(item => {
      return checkBoxReasonValue.indexOf(item.value) > -1;
    });
    let arr: any = [];
    arrcheckBoxReasonText.forEach(item => {
      arr.push(item.label);
      setCheckBoxReasonTextValue(arr);
    });
    //
    if (isInspection) {
      const opts = {
        quality: currentQualitySelected,
        timeliness: currentArticleAttrSelected,
        reason: checkBoxReasonValue,
        //这个字段是为了拿到质检的文字
        reasonText: checkBoxReasonTextValue,
        score: calculateScores(),
      };
      const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult)?.labels[0] : {};
      const originData = JSON.stringify(userResult);
      const newData = JSON.stringify(opts);
      setChangeStatus(originData !== newData);
    }
  }, [currentQualitySelected, currentArticleAttrSelected, checkBoxReasonValue]);

  return (
    <div className={`operation ${isVideo ? 'quality-panel-video' : 'quality-panel'}`}>
      <Card>
        {baseRender('文章质量', QUALITYPANEL, 1, currentQualitySelected)}
        <div className="content-type">
          {QUALITYPANELCHECKBOX(isVideo)?.has(currentQualitySelected) && (
            <Checkbox.Group
              style={{ marginBottom: 20 }}
              options={QUALITYPANELCHECKBOX(isVideo)?.get(currentQualitySelected) || []}
              onChange={handleCheckBoxChange}
              value={checkBoxReasonValue}
            />
          )}
          {Array.isArray(ARTICLEATTRS[currentQualitySelected]) && ARTICLEATTRS[currentQualitySelected]?.length > 0 && (
            <>{baseRender('时效性', ARTICLEATTRS[currentQualitySelected], 2, currentArticleAttrSelected)}</>
          )}
        </div>
        <div className="center">
          {!changeStatus ? (
            <Button type="primary" disabled={submitBtnDisabled} onClick={run} className="ant-btn-success">
              结果无异
            </Button>
          ) : (
            <Button type="primary" disabled={submitBtnDisabled} onClick={run}>
              提交
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(QualityPanel);
