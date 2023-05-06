import React, { useState, useEffect } from 'react';

import { Card, Button, Modal, message } from 'antd';

import BasicForm from '@/components/Smart/BasicForm';
import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import fetchAsyncRes from '@/components/BusinessLogic/fetchAsyncRes';
import requestAsyncRes from '@/components/BusinessLogic/requestAsyncRes';
import formModel from './viewmodel/formModel';
import getColumns from './viewmodel/tableColumns';
import modalFormModel from './viewmodel/modalFormModel';
import ZoneTypeModal from '@/components/Modal/staff/zoneType';
// import SystemModal from '@/components/Modal/staff/system';

import { staffList, staffAdd, staffStatus, staffBatchStatus /*, managerPermissionSystemUpdate */ } from '@/services/systemManagement';

const Staff = () => {
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    size: 20,
  });

  // table 表格 loading
  const [tableLoading, setTableLoading] = useState(false);

  // 列表数据
  const [dataSource, setDataSource] = useState<any[]>([]);

  // table 表格接口请求
  const query = async (params: any) => {
    setTableLoading(true);
    // const { size: pageSize } = pagination;
    const [err, data = [], pag = {}] = await fetchAsyncRes(() => staffList({ ...params }));
    setTableLoading(false);
    if (err) {
      message.error(`请求失败，原因：${err}`);
      return false;
    } else {
      // @ts-ignore
      setDataSource(data);
      setPagination(pag);
      setSelectedRowKeys([]);
    }
  };

  useEffect(() => {
    const { size: pageSize } = pagination;
    query({ pageNumber: 1, pageSize });
  }, []);

  const [queryParams, setQueryParams] = useState<Object>({});

  // 查询
  const handleSubmit = (values: any) => {
    setQueryParams(values);
    const { size: pageSize } = pagination;
    query({ ...values, pageNumber: 1, pageSize });
  };

  // 手动更新数据 dataSource
  const updateList = (ids: number[], status: 0 | 1) => {
    const data = dataSource.map(item => {
      const updateCurrent = ids.includes(item.pandoraId);
      if (!updateCurrent) return item;
      item.isEnabled = status;
      return item;
    });
    setDataSource(data);
  };

  // 启用 | 禁用 状态切换
  const handleStatus = (pandoraId: number, isEnabled: 0 | 1, name: string) => {
    const flag = isEnabled === 1 ? '启' : '禁';
    Modal.confirm({
      title: `${flag}用账号`,
      // icon: <ExclamationCircleOutlined />,
      content: `将${flag}用 ${name} 的审核员账号权限，请确认`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          const response = await requestAsyncRes(() => staffStatus({ pandoraId, isEnabled }));
          if (response.errorno !== 0) {
            reject();
            return;
          }
          updateList([pandoraId], isEnabled);
          resolve('');
        });
      },
    });
  };

  // 批量 - 启用 | 禁用 状态切换
  const handleBatchStatus = (isEnabled: 0 | 1) => {
    // const ids: any[] = selectedIds ? selectedIds.split(',') : [];
    const ids: any[] = selectedRowKeys ?? [];
    const length = ids.length;
    if (length === 0) {
      message.error('请选择用户！');
      return;
    }
    const flag = isEnabled === 1 ? '启' : '禁';
    Modal.confirm({
      title: `${flag}用账号`,
      // icon: <ExclamationCircleOutlined />,
      content: `将批量${flag}用选中的 ${length} 个审核员账号权限，请确认`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          const response = await requestAsyncRes(() => staffBatchStatus({ ids, isEnabled }));
          if (response.errorno !== 0) {
            reject();
            return;
          }
          // const pandoraIds = ids.map(id => id));
          updateList(selectedRowKeys, isEnabled);
          resolve('');
        });
      },
    });
  };

  // 列表 columns
  const columns = getColumns({
    title: '操作',
    render: (record: any) => {
      const { pandoraId, id, name, isOperatorManager } = record;
      return (
        <>
          {record.isEnabled === 0 ? (
            <Button type="link" onClick={() => handleStatus(pandoraId, 1, name)}>
              启用
            </Button>
          ) : (
            <Button type="link" danger onClick={() => handleStatus(pandoraId, 0, name)}>
              禁用
            </Button>
          )}
          {/* <Button type="link" onClick={() => systemModalToggle(id, isOperatorManager ? 1 : 0)}>
            系统管理员
          </Button> */}
          <Button type="link" onClick={() => zoneTypeModalToggle(pandoraId, 'unit_type')}>
            业务管理员
          </Button>
          <Button type="link" onClick={() => zoneTypeModalToggle(pandoraId, 'part_zone')}>
            分区管理员
          </Button>
        </>
      );
    },
  });

  // 列表 pageNumber | pageSize 切换
  const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
    query({ ...queryParams, pageNumber: page, pageSize: size });
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  // const [selectedIds, setSelectedIds] = useState('');
  // 批量状态更新
  const handleRowSelectionCallbackFn = (selected: any, selectedRows: any) => {
    // console.log(selected, selectedRows);
    const keys = selected?.split(',')?.map((item: any) => Number(item)) ?? [];
    setSelectedRowKeys(keys);
    // setSelectedIds(selected);
  };

  // 弹窗
  const [addVisible, setAddVisible] = useState(false);

  // 弹窗 开关切换
  const toggleVisible = () => {
    setAddVisible(!addVisible);
  };

  // 弹窗 确定
  const handleOk = async (values: any) => {
    const { isEnabled, isOutsource } = values;
    const data = {
      ...values,
      isEnabled: isEnabled ? 1 : 0,
      isOutsource: isOutsource ? 0 : 1,
    };
    const response = await requestAsyncRes(() => staffAdd(data));
    if (response.errorno !== 0) return;
    toggleVisible();
    const { size: pageSize } = pagination;
    query({ queryParams, pageNumber: 1, pageSize });
  };

  // 弹窗 关闭
  const handleCancel = () => {
    toggleVisible();
  };

  // 分区 | 子业务 modal ==== begin
  // @ts-ignore
  const [type, setType] = useState<'part_zone' | 'unit_type'>('');
  const [pandoraId, setPandoraId] = useState<string>('');
  const [zoneTypeModalVisible, setZoneTypeModalVisible] = useState(false);
  const zoneTypeModalToggle = (pandoraId = '', type: 'part_zone' | 'unit_type') => {
    setZoneTypeModalVisible(!zoneTypeModalVisible);
    setType(type);
    setPandoraId(pandoraId);
  };
  // const zoneTypeOk = () => {
  //   zoneTypeModalToggle();
  // };
  const zoneTypeModalProps = {
    // @ts-ignore
    onCancel: () => zoneTypeModalToggle('', ''),
    // onOk: zoneTypeOk,
  };
  // 分区 | 子业务 modal ==== end

  // // 系统 modal ==== begin
  // const [systemModalVisible, setSystemModalVisible] = useState(false);
  // const [id, setId] = useState<string>('');
  // const [initStatus, setInitStatus] = useState<0 | 1>(0);
  // const systemModalToggle = (id = '', initStatus = 0) => {
  //   setSystemModalVisible(!systemModalVisible);
  //   setId(id);
  //   // @ts-ignore
  //   setInitStatus(initStatus);
  // };
  // const systemOk = async (status: any) => {
  //   const { errorno } = await requestAsyncRes(() =>
  //     managerPermissionSystemUpdate({
  //       operatorId: id,
  //       type: status,
  //     }),
  //   );
  //   if (errorno === 0) {
  //     message.success('系统权限更新成功！');
  //     systemModalToggle();
  //     const { current: pageNumber, size: pageSize } = pagination;
  //     query({ queryParams, pageNumber, pageSize });
  //   }
  // };
  // const systemModalProps = {
  //   onCancel: () => systemModalToggle('', 0),
  //   onOk: (status: any) => systemOk(status),
  // };
  // // 分区 modal ==== end

  return (
    <div className="main-content">
      <Card bordered={false}>
        <BasicForm initialValues={{}} layout="inline" formDataModel={formModel} onSearch={handleSubmit} loading={tableLoading} />
        <Button type="primary" className="mr10" onClick={() => handleBatchStatus(1)}>
          批量启用
        </Button>
        <Button className="mr10" onClick={() => handleBatchStatus(0)}>
          批量禁用
        </Button>
        <Button type="primary" className="mr10" onClick={() => toggleVisible()}>
          新增
        </Button>
      </Card>
      <Card bordered={false}>
        <CustomizeTable
          columns={columns}
          data={dataSource}
          rowKey="pandoraId"
          pagination={pagination}
          handleChange={handlePageChange}
          rowSelection
          selectedRowKeys={selectedRowKeys}
          handleRowSelectionCallback={handleRowSelectionCallbackFn}
          loading={tableLoading}
        />
      </Card>

      <Modal
        visible={addVisible}
        title="新增审核员信息"
        centered
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        maskClosable={false}
        width={600}
        confirmLoading={true}
        wrapClassName="staff-add-modal"
      >
        <BasicForm
          initialValues={{
            isEnabled: true,
            isOutsource: true,
          }}
          layout="vertical"
          formDataModel={modalFormModel}
          onSearch={handleOk}
        />
      </Modal>

      {zoneTypeModalVisible && <ZoneTypeModal modalProps={zoneTypeModalProps} pandoraId={pandoraId} type={type} />}

      {/* {systemModalVisible && <SystemModal modalProps={systemModalProps} initStatus={initStatus} />} */}
    </div>
  );
};

export default Staff;
