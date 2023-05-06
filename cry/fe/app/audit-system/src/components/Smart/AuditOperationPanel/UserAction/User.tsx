import React, { useState, useEffect } from 'react';
import { useDebounceFn } from 'ahooks';

import { Button, Input, message } from 'antd';

import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import BtnGroup from './BtnGroup';
import handleTaskSubmit from '../handleTaskSubmit';
import { uerActionTypeDegreeOptions, userActionModuleOptions } from '@/data/constants';

import { UserActionProps } from './index';

const UserAction: React.FC<Omit<UserActionProps, 'type'>> = ({ data, reloadCallBack }) => {
  const { material } = data;

  const [otherInputVisible, setOtherInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  // 违规类型
  const [types, setTypes] = useState(uerActionTypeDegreeOptions);
  // 违规程度
  const [degrees, setDegrees] = useState<any>([]);
  // 账号被盗 是否被选中
  const [accountSelected, setAccountSelected] = useState<boolean>(false);
  // 更新违规类型 选择 | 非选择 按钮状态 & 违规程度模块
  const updateTypes = (currentIndex: number) => {
    types.forEach((item, index) => {
      if (currentIndex !== index) {
        item.status = 0;
      } else {
        const { status = 0, code } = item;
        if (status === 2) return;
        item.status = status === 0 ? 1 : 0;
        const checked = item.status === 1;

        // 其他输入框
        const otherInputVisible = checked && code === 'other';
        setOtherInputVisible(otherInputVisible);

        // 更新违规程度模块
        const degreeOptions = checked ? item.degree ?? [] : [];
        setDegrees(degreeOptions);
      }
      item.degree?.forEach(_item => {
        _item.status = 0;
      });
    });
    // 账号被盗 违规模块只保留 账号 按钮
    const selected = types.find((item: any) => item.status === 1)?.code === 'account_stolen';
    setAccountSelected(selected);
    setTypes([...types]);
  };

  // 账号被盗选中 | 不选中 影响违规模块内容
  useEffect(() => {
    const newModules = accountSelected ? modules.filter(item => item.code === 'account') : [...userActionModuleOptions];
    setModules(newModules);
  }, [accountSelected]);

  // 更新违规程度
  const updateDegrees = (currentIndex: number) => {
    // @ts-ignore
    degrees?.forEach((item, index) => {
      if (currentIndex !== index) {
        item.status = 0;
      } else {
        item.status = item.status === 0 ? 1 : 0;
      }
    });
    setDegrees([...degrees]);
  };

  // 违规模块
  const [modules, setModules] = useState(userActionModuleOptions);
  // 更新违规程度
  const updateModules = (currentIndex: number) => {
    modules.forEach((item, index) => {
      if (currentIndex !== index) {
        item.status = 0;
      } else {
        item.status = item.status === 0 ? 1 : 0;
      }
    });
    setModules([...modules]);
  };

  const { run } = useDebounceFn(status => submitAudit(status), {
    wait: 300,
  });

  // 重置按钮所有按钮状态
  const resetBntStatus = () => {
    types.forEach(item => {
      item.status = 0;
      item?.degree?.forEach(_item => {
        _item.status = 0;
      });
    });
    modules.forEach(item => {
      item.status = 0;
    });
    setTypes([...types]);
    setDegrees([]);
    setModules([...modules]);
    setOtherInputVisible(false);
    setInputValue('');
  };

  const reloadCallBackProxy = () => {
    resetBntStatus();
    reloadCallBack();
  };

  // 提交 | 无效反馈
  const submitAudit = (status: boolean) => {
    const type = types.find(item => item.status === 1);
    // @ts-ignore
    const degree = degrees.find(item => item.status === 1);
    const module = modules.find(item => item.status === 1);
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
      if (type) {
        const { code, label } = type;
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
        });
      } else {
        message.warning('请选择违规类型');
        return;
      }
      if (degrees.length > 0) {
        if (degree) {
          const { code, label } = degree;
          selected.push({
            ...selectedItemDefault,
            code,
            label,
          });
        } else {
          message.warning('请选择违规程度');
          return;
        }
      }
      if (module) {
        const { code, label } = module;
        selected.push({
          ...selectedItemDefault,
          code,
          label,
        });
      } else {
        message.warning('请选择违规模块');
        return;
      }
    }
    handleTaskSubmit(
      [submitTaskParamsInAuditOperation(material, status ? 3001 : 3002, status ? 'pass' : 'not-pass', selected)],
      false,
      reloadCallBackProxy,
    );
  };

  const [submitBtnStatus, setSbmitBtnStatus] = useState(false);
  useEffect(() => {
    const typeSelected = types?.some(item => item.status === 1);
    // @ts-ignores
    const degreeSelected = degrees?.some(item => item.status === 1);
    const moduleSelected = modules?.some(item => item.status === 1);
    setSbmitBtnStatus(!typeSelected && !degreeSelected && !moduleSelected);
  }, [types, modules, degrees]);

  // 初始化
  useEffect(() => {
    const result = data[`result_l${data.audit_level}`];
    if (result) {
      // 有状态 初始化
      try {
        const { labels } = JSON.parse(result);
        types.forEach((item: any) => {
          item.status = 0;
          labels.forEach((label: any) => {
            if (item.code === label.code) {
              item.status = 1;

              item.degree.forEach((_item: any) => {
                _item.status = 0;
                labels.forEach((label: any) => {
                  if (_item.code === label.code) {
                    _item.status = 1;
                  }
                });
              });
              setDegrees([...item.degree]);
            }
          });
        });
        setTypes([...types]);

        modules.forEach((item: any) => {
          item.status = 0;
          labels.forEach((label: any) => {
            if (item.code === label.code) {
              item.status = 1;
              if (label.code === 'account') {
                setAccountSelected(true);
              }
            }
          });
        });
        setModules([...modules]);

        const otherIndex = labels.findIndex((item: any) => item.code === 'other');
        if (otherIndex > -1) {
          const { desc } = labels[otherIndex];
          setOtherInputVisible(true);
          setInputValue(desc);
        } else {
          setOtherInputVisible(false);
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
      <h3>违规类型</h3>
      <div className="btns-wrapper">
        <BtnGroup btnsData={types} getIndex={updateTypes} />
        {otherInputVisible && <Input placeholder="请输入理由" value={inputValue} onChange={event => setInputValue(event.target.value)} />}
      </div>

      {degrees?.length > 0 && (
        <>
          <h3>违规程度</h3>
          <div className="btns-wrapper">
            <BtnGroup btnsData={degrees} getIndex={updateDegrees} />
          </div>
        </>
      )}

      <h3>违规模块</h3>
      <div className="btns-wrapper">
        <BtnGroup btnsData={modules} getIndex={updateModules} />
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

export default UserAction;
