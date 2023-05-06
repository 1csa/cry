/**
 * 负反馈提交按钮组 包括视频和图文的
 */
import React, { useState, useEffect } from 'react';
import { useDebounceFn } from 'ahooks';
import { Button, message, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import { negFeedbackUserBtnGroup } from '@/data/constants';
import handleTaskSubmit from './handleTaskSubmit';
import { BtnGroupTypes, ToInitButtonGroupType } from '@/types';
import { isJSON } from '@/utils/dev_helper';

import './index.less';

interface IFOPProps {
  material: any;
  isVideo: boolean;
  reloadCallBack: () => void;
  userReviewResult: string;
  isInspection?: boolean; // 是否质检业务 默认 false
}

const FeedbackOperationPanel: React.FC<IFOPProps> = ({ material, reloadCallBack, isVideo, userReviewResult, isInspection = false }) => {
  const [negButtonGroup, setNegButtonGroup] = useState<Array<BtnGroupTypes>>(negFeedbackUserBtnGroup);

  /**
   * 负反馈的操作按钮组 包括视频和图文
   */
  const feedbackOpe = () => {
    return negButtonGroup.map((ele: BtnGroupTypes, index: number) => {
      return (
        <React.Fragment key={index}>
          <div>
            <Button name={`审核操作-${ele.name}`} type={ele.type} disabled={ele.disabled} danger={ele.danger} onClick={() => handleClick(index)}>
              {ele.name}
            </Button>
          </div>

          {ele.type === 'primary' && Array.isArray(ele.subLabels) && <BtnGroups labels={ele.subLabels} />}
        </React.Fragment>
      );
    });
  };

  // 时效性
  const BtnGroups: React.FC<{ labels: Array<{ label: string; value: string | number }> }> = ({ labels }) => {
    return (
      <div className="mt10">
        <h3>时效性</h3>
        <Radio.Group name="radio-group" buttonStyle="solid" value={timeliness} onChange={event => timelinessChange(event)}>
          {labels?.map(item => (
            <Radio.Button key={item.value} value={item.value} className="radio-button">
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    );
  };

  const [timeliness, setTimeLiness] = useState('');
  const timelinessChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setTimeLiness(value);
  };

  // 点击按钮
  const handleClick = (index: number) => {
    negButtonGroup.forEach((item: BtnGroupTypes, idx: number) => {
      if (index === idx) {
        item.type = 'primary';
        item.danger = item.code === 3002;
      } else {
        item.type = 'default';
        item.danger = false;
      }
    });
    setNegButtonGroup([...negButtonGroup]);
  };

  /**
   * 将提交函数放在防抖中
   */
  const { run } = useDebounceFn(() => handleSubmitTask(), {
    wait: 300,
  });

  const [loading, setLoading] = useState(false);

  // 获取交互选中的人审标签数据
  const getUserResult = () => {
    const result: any = {
      manual_status: 3001,
      desc: '',
      selected: [],
    };

    const index = negButtonGroup.findIndex((item: any) => {
      return item.type === 'primary';
    });

    if (index === -1) {
      // message.error('请选择标签！');
      return result;
    }

    const { code, label: desc, name, subLabels = [] } = negButtonGroup[index];
    result.manual_status = code;
    result.desc = desc;

    const selectedAfterFilterKey: Array<ToInitButtonGroupType> = [
      {
        code: desc,
        label: name,
        desc: '',
        keyname: '',
        keycode: '',
        group: '',
        // @ts-ignore
        type: 'action',
      },
    ];
    result.selected = selectedAfterFilterKey;

    // 无效反馈
    const isTimeLiness = desc === 'pass';
    if (isTimeLiness) {
      if (timeliness === '') {
        // message.error('请选择时效性标签！');
        return result;
      } else {
        // @ts-ignore
        const { label = '' } = subLabels.find((labelItem: any) => labelItem.value === timeliness);
        selectedAfterFilterKey.push({
          code: timeliness,
          label,
          desc: '',
          keyname: '',
          keycode: '',
          group: '',
          // @ts-ignore
          type: 'timeliness',
        });
      }
    }

    result.selected = selectedAfterFilterKey;
    return result;
  };

  /**
   * 提交结论
   */
  const handleSubmitTask = () => {
    const { manual_status, desc, selected } = getUserResult();
    if (selected.length === 0) {
      message.error('请选择标签！');
      return;
    } else {
      if (desc === 'pass' && selected.length === 1) {
        message.error('请选择时效性标签！');
        return;
      }
    }
    setLoading(true);
    const requestData = submitTaskParamsInAuditOperation(material, manual_status, desc, selected);
    // TODO: 质检业务 "checkorResult":"approve 无异议 adjust 重新审核"
    if (isInspection) {
      // @ts-ignore
      requestData.checkorResult = changeStatus ? 'adjust' : 'approve';
    }
    handleTaskSubmit([requestData], false, reloadCallBack, failCallback, failCallback);
  };

  // 请求异常回调
  const failCallback = () => {
    setLoading(false);
  };

  // 重置所有状态
  const reset = () => {
    failCallback();
    setTimeLiness('');
    handleClick(-1);
  };

  useEffect(() => {
    reset();
    const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult) : {};
    const { desc, labels = [] } = userResult;
    const index = negFeedbackUserBtnGroup.findIndex((item: any) => item.label === desc);
    if (index > -1) {
      handleClick(index);
    }

    if (desc === 'pass') {
      const timeliness = labels.find((item: any) => item.code !== 'pass')?.code ?? '';
      setTimeLiness(timeliness);
    }
  }, []);

  // 质检业务 标签状态是否修改
  const [changeStatus, setChangeStatus] = useState(!isInspection);
  // 质检业务
  useEffect(() => {
    if (isInspection) {
      const userResult = isJSON(userReviewResult) ? JSON.parse(userReviewResult)?.labels : [];
      const originData = JSON.stringify(userResult);
      const { selected = [] } = getUserResult();
      const newData = JSON.stringify(selected);
      setChangeStatus(originData !== newData);
    }
  }, [negButtonGroup]);

  return (
    <div className={isVideo ? 'card feedback operation-max-3' : 'card feedback operation'}>
      <h3>审核操作</h3>
      <div className="btn-group">{feedbackOpe()}</div>

      <div className="sub-btn-group">
        {!changeStatus ? (
          <Button
            name="质检-结果无异"
            type="primary"
            loading={loading}
            onClick={run}
            disabled={negButtonGroup.every((item: any) => !(item.type === 'primary'))}
            className="ant-btn-success"
          >
            结果无异
          </Button>
        ) : (
          <Button
            name="负反馈-提交"
            type="primary"
            loading={loading}
            onClick={run}
            disabled={negButtonGroup.every((item: any) => !(item.type === 'primary'))}
          >
            提交
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeedbackOperationPanel;
