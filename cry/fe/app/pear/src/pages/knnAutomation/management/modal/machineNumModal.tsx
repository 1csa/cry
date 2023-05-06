import React, { useEffect, useState } from 'react';

import { Modal, Form, Tooltip, Icon, message, Tag } from 'antd';

import { fetchMachineNum } from '@/services/knnAutomation';
interface machineNumModalProps {
  text: any;
  row: any;
  form: any;
}
const MachineNumModal: React.FC<machineNumModalProps> = ({ form, row, text }) => {
  const [isvisible, setIsvisible] = useState<boolean>(false);
  const [machineNum, setMachineNum] = useState<any>([]);

  const handleOk = () => {
    setIsvisible(false);
  };
  const handleCancel = () => {
    setIsvisible(false);
  };
  const getMachineNum = async (row: any) => {
    let data = {
      type: row.type,
    };
    const res = await fetchMachineNum(data);
    if (res.success == true) {
      setMachineNum(res.data);
      message.success('请求成功');
    } else {
      message.error('请求失败');
    }
  };
  const handleMachine = () => {
    if (row.machineNum === 0) {
      message.warning('机器数量为零不能查看！！！！');
    } else {
      setIsvisible(true);
      getMachineNum(row);
    }
  };
  const bgColor = (color: any, text: any) => {
    //  const tags = {
    //    error: () => <Tag color="#c00">{text}</Tag>,
    //    warning: () => <Tag color="rgb(228, 139, 22)">{text}</Tag>,
    //    default: () => <Tag color="green">{text}</Tag>,
    //  };
    if (color === 'green') {
      return (
        <Tag color="green" className="machineNumDatial">
          {text}
        </Tag>
      );
    } else if (color === 'red') {
      return (
        <Tag color="red" className="machineNumDatial">
          {text}
        </Tag>
      );
    } else {
      return (
        <Tag color="orange" className="machineNumDatial">
          {text}
        </Tag>
      );
    }
    // return tags[status] ? tags[status]() : tags.default();
  };
  const MachineTitle = () => {
    return (
      <>
        {'机器配置'}
        <Tooltip placement="top" title={'绿色-性能可良好/橙色-性能较差/红色-性能很差'}>
          <Icon type="question-circle-o" />
        </Tooltip>
      </>
    );
  };
  return (
    <>
      <a onClick={() => handleMachine()}>{text}</a>
      <Modal title={<MachineTitle></MachineTitle>} visible={isvisible} onOk={handleOk} onCancel={handleCancel}>
        {machineNum.map((item: any) =>
          // <Tag>{item?.split('@')[1]}</Tag>
          bgColor(item?.split(':')[1], item?.split(':')[0]),
        )}
      </Modal>
    </>
  );
};

export default Form.create()(MachineNumModal);
