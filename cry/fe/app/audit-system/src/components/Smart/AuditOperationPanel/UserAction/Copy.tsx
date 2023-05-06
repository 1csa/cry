import React, { useState } from 'react';

import { Button } from 'antd';

import BtnGroup from '@/components/Smart/AuditOperationPanel/UserAction/BtnGroup';

import { userAction } from '@/data/constants';

interface UserActionProps {
  data: any; // message 数据 { material: { reasons, reportTime, messages, suspect, report } }
  reloadCallBack: () => void;
}

const UserAction: React.FC<UserActionProps> = ({ data: sss, reloadCallBack }) => {
  const [data, updateData] = useState(userAction.groupChatReport);

  const getIndex = (current: number, parent?: number) => {
    console.info(`current: ${current}, parent: ${parent}`);

    // 更新父级数据
    if (typeof parent === 'undefined') {
    } else {
      // 更新子级数据
      console.info(data[parent]);
    }
  };

  return (
    <div className="card action-wrapper">
      {Array.isArray(data)
        ? data.map((item: any, index: number) => {
            const { children = [] } = item.options.find((ele: any) => ele.status === 1) ?? {};
            return (
              <React.Fragment key={item.title}>
                <h3>{item.title}</h3>
                <div className="btns-wrapper">
                  <BtnGroup btnsData={item.options} getIndex={(i: number) => getIndex(i)} />
                </div>

                {children?.length ? (
                  <>
                    {children.map((iItem: any) => {
                      return (
                        <React.Fragment key={iItem.title}>
                          <h3>{iItem.title}</h3>
                          <div className="btns-wrapper">
                            <BtnGroup btnsData={iItem.options} getIndex={(i: number) => getIndex(i, index)} />
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : null}
              </React.Fragment>
            );
          })
        : null}

      <div className="btn-action">
        <Button type="primary">提交</Button>
        <Button type="primary" style={{ marginLeft: 20 }}>
          无效反馈
        </Button>
      </div>
    </div>
  );
};

export default UserAction;
