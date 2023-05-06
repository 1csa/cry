import React, { useState, useEffect } from 'react';

import { TreeSelect } from 'antd';

import Modal, { ModalType } from '@/components/Dumb/CustomModal';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import { managerMenu } from '@/services/systemManagement';

// const { SHOW_PARENT } = TreeSelect;

type treeItemProps = {
  title: string;
  value: string | number;
  key: string | number;
  children?: Array<treeItemProps>;
};

type unitTypeProps = {
  modalProps: ModalType;
  initValue: string[]; // tree select 组件初始选中
  title: string;
  flag: number; //  业务： 缺省--1 | 业务-0 | 分区-1
};

const Add: React.FC<unitTypeProps> = ({ modalProps, initValue, title, flag }) => {
  const [treeData, setData] = useState<any[]>([]);

  // 格式化 treeData 需要的数据
  const formatData = (treeData: any) => {
    const newTreeData = treeData.map((item: any) => {
      const { id, name, roleMenuDTOList } = item;

      let children: Array<treeItemProps> = [];
      if (Array.isArray(roleMenuDTOList)) {
        children = formatData(roleMenuDTOList);
      }

      // key value 数据做格式转换因为 id 冲突(存在相同id数据)
      // key value 数据格式会影响弹窗关闭时需要的数据
      const treeItem = {
        key: `${id}-${name}`,
        value: `${id}-${name}`,
        title: name,
        children,
      };
      return treeItem;
    });
    return newTreeData;
  };

  // 获取数据
  const query = async () => {
    const { errorno, data } = await requestAsyncRes(() => managerMenu());
    if (errorno === 0) {
      // 过滤数据 业务 | 分区
      const list =
        flag === 1
          ? data
          : Array.isArray(data)
          ? data.map((item: any) => {
              item.roleMenuDTOList.forEach((_item: any) => {
                delete _item.roleMenuDTOList;
              });
              return item;
            })
          : [];

      const treeData = formatData(list);
      setData(treeData);
    }
  };

  useEffect(() => {
    query();
  }, []);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const onTreeChange = (selectedIds: number[]) => {
    setSelectedIds(selectedIds);
  };

  const tProps = {
    treeData,
    // value: this.state.value,
    onChange: onTreeChange,
    treeCheckable: true,
    // showCheckedStrategy: SHOW_PARENT,
    treeDefaultExpandAll: true,
    // placeholder: '请选择选项',
    style: {
      width: 500,
    },
  };

  const handleOk = () => {
    const { onOk } = modalProps;
    const ids = selectedIds.map((item: any) => {
      const [id] = item.split('-');
      return Number(id);
    });
    typeof onOk === 'function' && onOk(ids);
  };

  return (
    <Modal visible destroyOnClose width={400} {...modalProps} title={`新增${title}权限`} okText="新增" onOk={handleOk}>
      <div style={{ textAlign: 'center' }}>
        选择{title}：
        <TreeSelect {...tProps} style={{ width: 250 }} defaultValue={initValue} />
      </div>
    </Modal>
  );
};

export default Add;
