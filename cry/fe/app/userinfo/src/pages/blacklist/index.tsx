import React, { memo, useState, useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import { Input, Button, message, Card } from 'antd';

import { Blackinfo } from '@/config/blacklist/blacklist.d';
import { queryBlack, changeStatus } from '@/services';
import { checkPhone } from '@/utils/dev_helper';
import './index.less';

const BlackList: React.FC = () => {
  const [phone, setPhone] = useState<string>('');
  const [blackinfo, setBlackinfo] = useState<Blackinfo>();

  const phoneRef = useRef('');

  useLayoutEffect(() => {
    phoneRef.current = phone;
  }, [phone]);

  const handleQuery = useCallback(async () => {
    let currentPhone = phoneRef.current;

    if (!currentPhone || currentPhone.trim().length === 0) {
      message.error('请输入手机号');
      return;
    }
    if (checkPhone(currentPhone.trim()) === false) {
      message.error('手机号格式有误');
      return;
    }

    let res = await queryBlack(currentPhone);
    if (res && res.status === 'success') {
      setBlackinfo(res.result);
    } else {
      message.error(res.result);
    }
  }, [phoneRef]);

  const handleChangeStatus = useCallback(async () => {
    if (!blackinfo) {
      return;
    }

    const currentState = parseInt(blackinfo.state);
    const currentPhone = phoneRef.current;

    if (currentPhone.length === 0) {
      message.error('输入有误，请检查后再');
      return;
    }

    let res = await changeStatus(currentPhone, currentState);

    if (res && res.status === 'success') {
      setBlackinfo({ ...blackinfo, state: currentState === 1 ? '0' : '1' });
      message.success('修改成功');
    }
  }, [blackinfo, phoneRef]);

  return (
    <>
      <div className="black">
        <Card title="用户黑名单查询" bordered={false}>
          <div className="blacklist">
            <Input
              className="blacklist-input"
              placeholder="请输入用户手机号"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onPressEnter={handleQuery}
              allowClear={true}
            />
            <Button className="blacklist-button" type="primary" onClick={handleQuery}>
              查询
            </Button>
          </div>
          {blackinfo && (
            <div className="blackinfo">
              <div className="blackinfo-infoitem">
                <label>状态:</label>
                <span>{Number(blackinfo.state) === 1 ? '已加入黑名单' : '未加入黑名单'}</span>
                <Button type="danger" size="small" onClick={handleChangeStatus}>
                  {parseInt(blackinfo.state) === 1 ? '解除黑名单' : '加入黑名单'}
                </Button>
              </div>
              <div className="blackinfo-infoitem">
                <label>操作人:</label>
                <span>{blackinfo.operator}</span>
              </div>
              <div className="blackinfo-infoitem">
                <label>封禁时间:</label>
                <span>{blackinfo.update_time || blackinfo.create_time || '-:-:-'}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default memo(BlackList);
