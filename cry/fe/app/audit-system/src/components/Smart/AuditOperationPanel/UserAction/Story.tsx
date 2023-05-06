import React, { useState, useEffect } from 'react';
import { useDebounceFn } from 'ahooks';

import { Button, Input, message } from 'antd';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import BtnGroup from './BtnGroup';
import handleTaskSubmit from '../handleTaskSubmit';
import { groupChatReportModuleOptions, degreeOptions } from '@/data/constants';

import { UserActionProps } from './index';

const StoryAction: React.FC<Omit<UserActionProps, 'type'>> = ({ data, reloadCallBack }) => {
  const { run } = useDebounceFn(status => submitAudit(status), {
    wait: 300,
  });

  const resetDegreeData = () => {
    degrees.forEach(item => {
      item.status = 0;
    });
    setDegrees([...degrees]);
  };

  const resetBntStatus = () => {
    modules.forEach(item => {
      item.status = 0;
    });
    setModules([...modules]);
    setModuleInputVisible(false);
    setInputValue('');
    resetDegreeData();
  };

  const reloadCallBackProxy = () => {
    resetBntStatus();
    reloadCallBack();
  };

  const submitAudit = (status: boolean) => {
    const module = modules.find(item => item.status === 1);
    const degree = degrees.find(item => item.status === 1);
    const selectedItemDefault = {
      code: '',
      label: '',
      desc: '',
      keyname: '',
      keycode: '',
      group: '',
    };
    const selected = [];
    if (status) {
      if (module) {
        const { code, label } = module;
        let desc = '';
        if (code === 'other') {
          if (inputValue.length === 0) {
            message.warning('其他理由输入不可以为空！请仔细确认');
            return;
          }
          desc = inputValue;
        }
        selected.push({
          ...selectedItemDefault,
          desc,
          code,
          label,
          type: 'reason',
        });
      } else {
        message.warning('请选择违规模块');
        return;
      }
      if (degree) {
        const { code, label } = degree;
        selected.push({
          ...selectedItemDefault,
          code,
          label,
          type: 'level',
        });
      } else {
        message.warning('请选择违规程度');
        return;
      }
    }

    const { material } = data;
    const requestData = submitTaskParamsInAuditOperation(material, status ? 3001 : 3002, status ? 'pass' : 'not-pass', selected);

    handleTaskSubmit([requestData], false, reloadCallBackProxy);
  };

  const [moduleInputVisible, setModuleInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [modules, setModules] = useState(groupChatReportModuleOptions);
  const updateModules = (index: number) => {
    resetDegreeData();
    modules.forEach((item, i) => {
      if (i !== index) {
        item.status = 0;
      } else {
        item.status = item.status === 0 ? 1 : 0;
        setDegrees(degreeOptions.filter(item => item.code !== 'moderate'));
        // if (item.status === 1 && item.code === 'erotic') {
        //   setDegrees([...degreeOptions]);
        // } else {
        //   setDegrees(degreeOptions.filter(item => item.code !== 'moderate'));
        // }
        if (item.status === 1 && item.code === 'other') {
          setModuleInputVisible(true);
        } else {
          setModuleInputVisible(false);
        }
      }
    });
    setModules([...modules]);
  };

  const [degrees, setDegrees] = useState([...degreeOptions]);
  const updateDegrees = (index: number) => {
    degrees.forEach((item, i) => {
      if (i !== index) {
        item.status = 0;
      } else {
        item.status = item.status === 0 ? 1 : 0;
      }
    });
    setDegrees([...degrees]);
  };

  const [submitBtnStatus, setSubmitBtnStatus] = useState(false);
  useEffect(() => {
    const moduleSelected = modules.findIndex(item => item.status === 1) > -1;
    const degreeSelected = degrees.findIndex(item => item.status === 1) > -1;
    setSubmitBtnStatus(!moduleSelected && !degreeSelected);
  }, [modules, degrees]);

  useEffect(() => {
    // const result = data[`result_l${data.audit_level}`];
    const result = data.result_lx;
    if (result) {
      // 有状态 初始化
      try {
        const { labels } = JSON.parse(result);
        let exitModerate = false; // 色情低俗才存在 中度 违规
        modules.forEach((item: any) => {
          item.status = 0;
          labels.forEach((label: any) => {
            if (item.code === label.code) {
              item.status = 1;
              exitModerate = label.code === 'erotic';
            }
          });
        });
        const degrees = [...degreeOptions];
        degrees.forEach((item: any) => {
          item.status = 0;
          labels.forEach((label: any) => {
            if (item.code === label.code) {
              item.status = 1;
            }
          });
        });
        setModules([...modules]);
        // 脏数据处理
        setDegrees(exitModerate ? [...degrees] : [...degrees].filter(item => item.code !== 'moderate'));
        const otherIndex = labels.findIndex((item: any) => item.code === 'other');
        if (otherIndex > -1) {
          const { desc } = labels[otherIndex];
          setModuleInputVisible(true);
          setInputValue(desc);
        } else {
          setModuleInputVisible(false);
          setInputValue('');
        }
      } catch (error) {
        resetBntStatus();
        console.log(error);
      }
    } else {
      // 无状态 初始化
      resetBntStatus();
    }
  }, []);

  return (
    <div className="card action-wrapper">
      <h3>违规模块</h3>
      <div className="btns-wrapper">
        <BtnGroup btnsData={modules} getIndex={updateModules} />
        {moduleInputVisible && <Input placeholder="请输入理由" value={inputValue} onChange={event => setInputValue(event.target.value)} />}
      </div>

      <h3>违规程度</h3>
      <div className="btns-wrapper">
        <BtnGroup btnsData={degrees} getIndex={updateDegrees} />
      </div>

      <div className="btn-action">
        <Button type="primary" disabled={submitBtnStatus} onClick={() => run(true)}>
          提交
        </Button>
        <Button type="primary" disabled={!submitBtnStatus} onClick={() => run(false)} style={{ marginLeft: 20 }}>
          无效反馈
        </Button>
      </div>
    </div>
  );
};

export default StoryAction;
