import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Popconfirm, Select, Table, Tag } from 'antd';
import { getFilterRules, addFilterRules, updateFilterRules, daleteFilterRules ,getFormidQuery} from '@/services/filterRules';

// import DeleteModal from './modal/deleteModal';
import AddModal from './modal/addModal';
import DetailModal from './modal/detailModal';
import Search from '@/components/Search';
import ScaleModal from "./modal/scaleModal";
import MetaModal from "./modal/metaModal";
import  {Columns}  from './modal/tableColumns';
import { SearchFromId, SearchContentType } from '@/config/list.config';
import moment from 'moment';
const { Option } = Select;

const FilterRules = (props: any) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [addvisible, setAddVisible] = useState<boolean>(false);
  //判断是否是添加框和编辑框
  const [isaddModal, setIsAddModal] = useState<boolean>(false);
  const [updateValue, setUpdateValue] = useState<any>({});
  const [filterRulesList, setFilterRulesList] = useState<any>([]);
  const [fromIDList, setFromIDList] = useState<any>([])
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(50);

  const { getFieldDecorator, validateFieldsAndScroll } = props.form;
  const columns: any = [
    ...Columns,
    {
      title: 'kv前置/召回比例',
      dataIndex: 'kvPreFilterRatio',
      key: 'kvPreFilterRatio',
      align: 'center',
      width: 100,
      fixed: 'right',
      render(text: any, row: any) {
        return (
           <ScaleModal row={row}></ScaleModal>
        )
      },
    },
    {
      title: 'knn前置/召回比例',
      dataIndex: 'knnPreFilterRatio',
      key: 'knnPreFilterRatio',
      align: 'center',
      width: 100,
      fixed: 'right',
      render(text: any, row: any) {
        return `${row.knnPreFilterRatio} / ${row.knnRecallFilterRatio}`
      },
    },
    {
      title: 'cb/aio/blender比例',
      dataIndex: 'onlineFilterRatio',
      key: 'onlineFilterRatio',
      align: 'center',
      width: 130,
      fixed: 'right',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 177,
      render: (text: string, row: any) => {
        return (
          <div key={text}>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={() => handClickUpdate(row)}>
              编辑
            </Tag>
            <Popconfirm title="您确定删除吗?" onConfirm={() => handleDelete(row)} okText="确定" cancelText="取消">
              <Tag color="#108ee9" style={{ cursor: 'pointer' }}>
                删除
              </Tag>
            </Popconfirm>

            <DetailModal row={row}></DetailModal>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getFilterRulesList();
  }, []);

  const getFilterRulesList = async () => {
    let data = {
        appIdGroup: 'oppobrowser',
        scene: 'strict',
        dataType:'news',
        fromId:'',
        opsRuleId:''
    };
    setLoading(true);
    const res: any = await getFilterRules(data);
    if ((res.success = true)) {
     
      setLoading(false);
      setFilterRulesList(res.data);
    }
  };
  const handleClick = async (row:any)=>{
    
  };
  const handleDelete = async (row: any) => {
    setLoading(true);
    const { primaryId } = row;
    const res: any = await daleteFilterRules({ params: { primaryId } });
    if ((res.success = true)) {
      message.success('删除成功');
      handClickBuild();
    }
  };
  const handClickBuild = async () => {
    setLoading(true);
    validateFieldsAndScroll(async (err: any, values: any) => {
      let data ={
          appIdGroup: values.appIdGroup,
          scene: values.scene,
          dataType:values.dataType,
          fromId:values.fromId,
          opsRuleId:values.opsToolRuleId
      }
      const res: any = await getFilterRules(data);
      setLoading(false);
      if ((res.success = true)) {
        message.success('请求成功');
        setFilterRulesList(res.data);
      }
    });
  };
  const handClickAddClose = () => {
    setAddVisible(false);
    setUpdateValue({});
  };
  const handClickAdd = () => {
    setAddVisible(true);
    setIsAddModal(true);
  };
  const handClickUpdate = (data: any) => {
    setAddVisible(true);
    setIsAddModal(false);
    setUpdateValue({ ...data });
  };
  //添加
  const addModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res = await addFilterRules({
          ...values,
          // username: username?.split('@')[0],
          // owners: values.owners.split(','),
        });
        if (res?.success === true) {
          message.success('创建成功');
          setAddVisible(flag);
          handClickBuild();
        }
      }
    });
  };
  //修改
  const editModal = (flag: boolean, validateFieldsAndScroll: any) => {
    validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        let res = await updateFilterRules({
          ...values,
        });
        if (res?.success === true) {
          message.success('修改成功');
          setAddVisible(flag);
          handClickBuild();
        }
      }
    });
  };
  //获取fromId选项数据
  const handleFromID = async()=>{
    const res:any = await getFormidQuery()
    if (res.succes =true) {
       setFromIDList(res.data)
    }
  }
  return (
    <>
      <Card bordered={false}>
        <Form layout="inline" >
          <Search form={props.form}></Search>
          <Form.Item label="数据类型" style={{ marginLeft: 8 }}>
            {getFieldDecorator('dataType', {
              initialValue: "news",
            })(
              <Select style={{ width: 120 }} allowClear={true}>
                {SearchContentType.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="fromId" style={{ marginLeft: 8 }}>
            {getFieldDecorator('fromId', {
              initialValue: '',
            })(
              <Select style={{ width: 175 }} onFocus={handleFromID} allowClear={true}>
                {fromIDList.map((item:any) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
           <Form.Item label="运营工具规则id" style={{ marginLeft: 8 }}>
            {getFieldDecorator('opsToolRuleId', {
              initialValue: '',
            })(<Input  style={{ width: 100 }}></Input>)}
          </Form.Item>
          <Button style={{ marginTop: 4 }} type="primary" icon="search" onClick={handClickBuild}>
            查询
          </Button>
          {/* 添加弹出框 */}
          <AddModal
            visible={addvisible}
            isAddModal={isaddModal}
            row={updateValue}
            closeCallback={handClickAddClose}
            addModal={addModal}
            editModal={editModal}
          ></AddModal>
          <Button style={{ marginTop: 4, marginLeft: 20 }} type="primary" onClick={handClickAdd}>
            创建
          </Button>
          <MetaModal propsForm={props.form}></MetaModal>
        </Form>
        <Table
          loading={loading}
          style={{ marginTop: 10 }}
          columns={columns}
          scroll={{ x: 1800 }}
          dataSource={filterRulesList}
          rowKey={(columns: any) => columns.primaryId}
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => setPage(page),
            onShowSizeChange: (current, pageSize) => {
              setPage(1);
              setPageSize(pageSize);
            },
            showTotal: total => `共 ${total} 条`,
          }}
        />
        
       
      </Card>
    </>
  );
};
export default Form.create()(FilterRules);
