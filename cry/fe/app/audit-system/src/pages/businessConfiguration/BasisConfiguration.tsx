/**
 * 本页面级组件是使用用那种 上边查询 中间有操作按钮 下边是表格 表格有编辑等
 */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
// import Link from 'umi/link';
import { Card, Button, Modal, message, Input } from 'antd';

import CustomizeTable, { IPagination, PageChangeFnType } from '@/components/Smart/BasicTable/CustomizeTable';
import BasicForm, { IHandler } from '@/components/Smart/BasicForm';
import fetchAsyncRes from '@/components/BusinessLogic/fetchAsyncRes';
import { BaseFormModelType, TableItemType, ApiResponseProps } from '@/types';

import './common.less';

interface IBasisConfiguration {
  initFormModel: Array<BaseFormModelType>; // 初始化正页表单内容
  columns: Array<TableItemType>; // 初始化正页表格
  initModalModel: (p?: boolean) => Array<BaseFormModelType>; // 初始化弹窗的表单
  fetchMainListFn: (params?: any) => Promise<ApiResponseProps>; // 主列表
  addConfFn: (params: any) => Promise<ApiResponseProps>;
  updateConfFn: (params: any) => Promise<ApiResponseProps>;
  deleteTagFn?: (params: any) => Promise<ApiResponseProps>;
  initModalFormValues: Object;
  tableRowKey?: string;
}

export interface IBCHandler {
  handleItemEdit: (rowItem: any, updateForm?: BaseFormModelType[]) => void;
  handleDeleteTagGroupButton: (rowItem: any) => void;
  handleResetForm?: (name: string) => void;
}

const BasisConfiguration = React.forwardRef<IBCHandler, IBasisConfiguration>(
  (
    { initFormModel, initModalModel, columns, fetchMainListFn, addConfFn, updateConfFn, deleteTagFn, initModalFormValues, tableRowKey = 'id' },
    ref,
  ) => {
    const [groupIdK, groupIdV] = location.search.substring(1).split('=');

    const getUrlParams = () => (groupIdK ? { [groupIdK]: groupIdV } : {});
    const basicFormRef = useRef<IHandler>(null);
    const pageSize = 20;

    let [isVisible, setIsVisible] = useState<boolean>(false); // 控制新增和修改的弹窗
    let [isShowDelModal, setIsShowDelModal] = useState<boolean>(false); // 删除的弹窗
    let [isEdit, setIsEdit] = useState<boolean>(false); // 是否编辑状态
    let [modalFormInitialValues, setModalFormInitialValues] = useState<Object>(initModalFormValues); // 新增或编辑 弹窗表单
    let [modalFormModel, setModalFormModel] = useState<Array<BaseFormModelType>>(initModalModel()); // 重新设置弹窗
    let [pagination, setPagination] = useState<IPagination>({
      size: pageSize,
    });
    let [confirmModalInput, setConfirmModalInput] = useState<string>(''); // 确认删除的时候输入的数据
    let [rowData, setRowData] = useState<any>({}); // 存储表单行数据

    let [queryParams, setQueryParams] = useState<Object>(getUrlParams());

    let [tableData, setTableData] = useState<Array<any>>([]);

    useImperativeHandle(ref, () => ({
      handleItemEdit,
      handleDeleteTagGroupButton,
      handleResetForm,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const fetchTableData = async (params?: any) => {
      setLoading(true);
      const [err, data = [], pag = {}] = await fetchAsyncRes(() => fetchMainListFn({ pageNumber: 1, pageSize, ...params, ...getUrlParams() }));
      setLoading(false);
      if (err) {
        message.error(`请求失败，原因：${err}`);
        return false;
      } else {
        setPagination(pag);
        setTableData(data as any[]);
      }
    };

    const addUpdateData = async (value: any) => {
      let params: any = {};
      const { businessId, businessUnitId } = rowData;
      if (isEdit) {
        // 编辑
        Object.assign(params, value, {
          businessId,
          businessUnitId,
        });

        Reflect.deleteProperty(params, 'businessName');
        if (!location.pathname.includes('businessConfiguration/subConfiguration')) {
          Reflect.deleteProperty(params, 'businessUnitName');
        }
      } else {
        params = value;
      }

      const [err] = await fetchAsyncRes(() => (isEdit ? updateConfFn({ id: rowData.id, ...params }) : addConfFn({ ...getUrlParams(), ...params })));

      if (err) {
        message.error(`请求失败，原因：${err}`);
        return false;
      } else {
        message.success(`${isEdit ? '更新' : '添加'}成功！`);
        toggleModalStatus(false, false);
        fetchTableData(queryParams);
      }
    };

    const deleteData = async (params: any) => {
      const [err] = deleteTagFn ? await fetchAsyncRes(() => deleteTagFn(params)) : ['删除方法不存在'];

      if (err) {
        message.error(`请求失败，原因：${err}`);
        return false;
      } else {
        message.success(`删除成功！`);
        setIsShowDelModal(false);
        fetchTableData(queryParams);
      }
    };

    const toggleModalStatus = (v: boolean, e: boolean) => {
      // 关闭之后需要把初始化的数据变为空
      !v && setModalFormInitialValues({});
      setIsVisible(v);
      setIsEdit(e);
    };

    // 编辑按钮 第二个参数 是从父组件接受的 更新弹窗表单的参数
    const handleItemEdit = (rowItem: any, updateForm?: BaseFormModelType[]) => {
      updateForm && setModalFormModel(updateForm);
      setModalFormInitialValues(rowItem);
      setRowData(rowItem);
      toggleModalStatus(true, true);
    };

    // 删除按钮
    const handleDeleteTagGroupButton = (rowItem: any) => {
      setIsShowDelModal(true);
      setRowData(rowItem);
    };

    // 确认删除
    const handleDelOk = () => {
      deleteData({ id: rowData.id });
    };

    // 点击查询
    const handleBasicFormSearch = (value: any) => {
      setQueryParams(value);
      fetchTableData(value);
    };

    // 页码改变
    const handlePageChange = (page: PageChangeFnType[0], size?: PageChangeFnType[1]) => {
      // console.log(`页码page: ${page}，偏移量size: ${size}`);
      fetchTableData({ pageNumber: page, pageSize: size, ...queryParams });
    };

    // 编辑和新增
    const handleModalFormSearch = (value: any) => {
      value.businessUnitId = value.businessUnitId ? +value.businessUnitId : undefined;
      addUpdateData(value);
    };

    // 设置清除选中的联动数据
    const handleResetForm = (name: string) => {
      basicFormRef?.current?.cleanCasItem(name);
    };

    useEffect(() => {
      fetchTableData();
    }, []);

    return (
      <div className="main-content bus-conf">
        <Card bordered={false}>
          <BasicForm
            ref={basicFormRef}
            initialValues={{}}
            layout="inline"
            formDataModel={initFormModel}
            onSearch={handleBasicFormSearch}
            loading={loading}
          />
        </Card>
        <Card bordered={false}>
          <div className="op-btn-group mb20">
            <Button
              type="primary"
              name="新增"
              onClick={() => {
                setModalFormInitialValues(initModalFormValues);
                setModalFormModel(initModalModel(false));
                toggleModalStatus(true, false);
              }}
            >
              新增
            </Button>
            {/* <Button name="操作日志">
              <Link to="/systemManagement/operationLog">操作日志</Link>
            </Button> */}
          </div>
          <CustomizeTable
            columns={columns}
            data={tableData}
            rowKey={tableRowKey}
            pagination={pagination}
            handleChange={handlePageChange}
            loading={loading}
          />
        </Card>
        <Modal
          title={isEdit ? '编辑' : '新增'}
          visible={isVisible}
          footer={null}
          onCancel={() => toggleModalStatus(false, false)}
          destroyOnClose={true}
          maskClosable={false}
        >
          <BasicForm initialValues={modalFormInitialValues} layout="vertical" formDataModel={modalFormModel} onSearch={handleModalFormSearch} />
        </Modal>
        {deleteTagFn ? (
          <Modal
            title={'确认删除'}
            visible={isShowDelModal}
            onCancel={() => setIsShowDelModal(false)}
            onOk={handleDelOk}
            destroyOnClose={true}
            maskClosable={false}
            okButtonProps={{ disabled: confirmModalInput !== rowData?.name }}
          >
            <>
              <p>
                您确定要删除当前标签吗？
                <br />
                请输入标签名
                <span
                  style={{
                    color: 'rgba(255, 0, 0, .3)',
                    fontSize: '20px',
                    margin: '0 10px 0 10px',
                    fontWeight: 'bold',
                  }}
                >
                  {rowData?.name}
                </span>
                确认删除！
              </p>
              <Input
                placeholder="请输入标签确认"
                onChange={e => {
                  setConfirmModalInput(e.target.value);
                }}
              />
            </>
          </Modal>
        ) : null}
      </div>
    );
  },
);
export default BasisConfiguration;
