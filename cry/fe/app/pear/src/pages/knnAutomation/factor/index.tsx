import React, { useEffect, useRef, useState } from "react";

import { Card, Form, Input, Button, Table, Popconfirm, Tooltip, Tag, message, Modal, Select, Col, Row } from 'antd';
import { getFactorQuery,addFactorQuery,deleteFactorQuery ,updateFactorQuery ,existFactor} from "@/services/knnAutomation";
const Factor = ({form}:any)=>{
  
  const [factorList, setFactorList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addvisible, setAddvisible] = useState<boolean>(false)
  const [indexTypeValue, setIndexTypeValue] = useState<string>('KNN')
  const [updateValue, setUpdateValue] = useState<any>({})
  const [isAddModal, setIsAddModal] = useState<any>('')
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(30);
  const {getFieldDecorator,validateFieldsAndScroll,validateFields,setFieldsValue} = form
  const fileInputEl: any = useRef(null);
  const { TextArea } = Input;
  const FormItemLayout = {
     labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
  }
  const levelList = [
    {
      value:'核心',
      key:5
    },
    {
      value:'重要',
      key:4
    },
    {
      value:'中等',
      key:3
    },
    {
      value:'低',
      key:2
    },
    {
      value:'测试',
      key:1
    },
  ]
  const columns:any =[
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      key: 'index',
    },
     {
      title: '索引类型',
      dataIndex: 'indexType',
      key: 'indexType',
      align: 'center',
    },
    {
      title: 'factor',
      dataIndex: 'factor',
      key: 'factor',
      align: 'center',
    },
    {
      title: '重要等级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      render:(text:any)=>{
       return levelList.map(item=>{
          if(item.key===text){
            return item.value
          }
        })
      }
      
    },
    {
      title: '负责人',
      dataIndex: 'owners',
      key: 'owners',
      align: 'center',
      render:(text:any)=>{
        return text.toString()
      }
    },
     {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width:200,
    },
    {
      title: '操作',
      align:'center',
       render: (text: string, row: any) => {
        return (
          <div key={text}>
            <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={()=>handleUpdate(row)}>
                更新
              </Tag>
            <Popconfirm title="您确定删除吗?" onConfirm={() => handleDelete(row)} okText="确定" cancelText="取消">
              <Tag color="#108ee9" style={{ cursor: 'pointer' }}>
                删除
              </Tag>
            </Popconfirm>
            
          </div>
        );
      },
    },
  ]
  useEffect(() => {
    getFactorList()
  }, [])
  
  const getFactorList = async()=>{
    const res:any = await getFactorQuery({params:{
    factor:'',
    username:localStorage.getItem('user')?.split('@')[0],
    indexType:'KNN',
    }})
    if (res.success = true) {
       let newData = res.data.map((item, index) => {
        item.key = index + Math.random()
        item.index = index + 1
        return item
      })
      setFactorList(newData)
    }
  }
  const handleAdd = (e)=>{
     e.preventDefault();
    setAddvisible(true)
  }
  const handleClose = ()=>{
     setAddvisible(false)
     setIsAddModal('')
  }
  const handleOk=(e:any)=>{
      e.preventDefault();
     validateFields(async (err: any, values: any) => {
      console.log(values);
      if(!err){
      let data ={
        indexType:values.indexType,
        factor:values.factors,
        level:values.level,
        description:values.description,
        owners:values.owner.toString().split(',')
      }
      if (isAddModal === 'update') {
         const res :any = await updateFactorQuery(data)
        if (res.success = true) {
          message.success('更新成功')
          handleBuild()
          handleClose()
         
        }
      }else{
        const res :any = await addFactorQuery(data)
        if (res.success = true) {
          message.success('添加成功')
          handleBuild()
           handleClose()
        }
      }
      }
     
     
     })
  }
  const handleDelete= async(row:any)=>{
   const res : any = await deleteFactorQuery({params:{
    factor:row.factor
   }})
   if (res.success = true) {
    message.success('删除成功')
    handleBuild()
   }
  }
  const handleBuild = async()=>{
    validateFields(async (err: any, values: any) => {
      //  if (!err) {
       const res:any = await getFactorQuery({params:{
          factor:values.factor,
          username:values.owners,
          indexType:values.indexTypes
          }})
          if (res.success = true) {
            let newData = res.data.map((item, index) => {
              item.key = index + Math.random()
              item.index = index + 1
              return item
            })
            setFactorList(newData)
          }
      // }
    
     })
  }
  const handleUpdate =async (row:any) => {
    console.log(row);
    
    setAddvisible(true)
    setUpdateValue(row)
    setIsAddModal("update")
  }
  const handFactor = async () => {
    let res: any = await existFactor({ params: { factor: fileInputEl.current.input.value, indexType:indexTypeValue} });
    if (res.success === true) {
      if (res.data) {
        message.error('factor已存在');
        setTimeout(() => {
          setFieldsValue({ factors: '' });
        }, 1000);
      } else {
        message.success('当前该factor可以使用');
      }
    }
  };
  return(
    <>
    <Card bordered={false}>
      <Form layout="inline">
        <Form.Item label='索引类型'>
            {getFieldDecorator('indexTypes', {
              initialValue: 'KNN',
            })(
               <Select style={{ width: 175 }} >
                  <Option value='KNN' key="KNN">
                    KNN
                  </Option>
                   <Option value='KV' key="KV">
                    KV
                  </Option>
              </Select>,
            )}
        </Form.Item>
        <Form.Item label="factor" style={{ marginLeft: 8 }}>
              {getFieldDecorator('factor', {
                initialValue: '',
              })(
                <Input allowClear={true}></Input>
              )}
        </Form.Item>
          <Form.Item label="负责人" style={{ marginLeft: 8 }}>
              {getFieldDecorator('owners', {
                initialValue: localStorage.getItem('user')?.split('@')[0],
              })(
                <Input allowClear={true}></Input>
              )}
        </Form.Item>
        <Button type="primary" style={{marginTop:3}} onClick={handleBuild}>搜索</Button>
        <Button type="primary" style={{marginTop:3,marginLeft:20}} onClick={handleAdd}>新增</Button>
      </Form>
      <Row>
        <Col span={21} push={1}>
        <Table
        loading={loading}
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={factorList}
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
      </Col>
      </Row>
    </Card>
    <Modal visible={addvisible} onCancel={handleClose} onOk={handleOk} title={isAddModal === 'update'?'更新factor':'新增factor'} destroyOnClose={true}>
      <Form {...FormItemLayout}>
         <Form.Item label='索引类型'>
            {getFieldDecorator('indexType', {
              initialValue: isAddModal === 'update'? updateValue.indexType:"KNN",
              rules:[{ required: true,message: 'indexType不能为空!',}]
            })(
               <Select style={{ width: 175 }} disabled={isAddModal === 'update'?true:false} onChange={(e:string)=>{setIndexTypeValue(e);
               }}>
                  <Option value='KNN' key="KNN">
                    KNN
                  </Option>
                  <Option value='KV' key="KV">
                    KV
                  </Option>
              </Select>,
            )}
        </Form.Item>
        <Form.Item label='factor'>
            {getFieldDecorator('factors', {
              initialValue: isAddModal === 'update'? updateValue.factor:"",
              rules:[{ required: true,message: 'factor不能为空!',}]
            })(
              <Input onBlur={handFactor} ref={fileInputEl} disabled={isAddModal === 'update'?true:false}></Input>
            )}
        </Form.Item>
        <Form.Item label='重要等级'>
           {getFieldDecorator('level', {
              initialValue: isAddModal === 'update'? updateValue.level:5,
              rules:[{ required: true,message: '重要等级不能为空!',}]
            })(
              <Select style={{ width: 175 }} >
                {levelList.map((item:any) => (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>,
            )}
        </Form.Item>
        <Form.Item label='负责人'>
           {getFieldDecorator('owner', {
              initialValue: isAddModal === 'update'? updateValue.owners:[],
              rules:[{ required: true,message: '负责人不能为空！',}]
            })(
              <TextArea rows={2} placeholder='多个负责人用英文逗号隔开'/>
            )}
        </Form.Item>
        <Form.Item label='描述'>
           {getFieldDecorator('description', {
              initialValue: isAddModal === 'update'? updateValue.description:[],
              rules:[{ required: true,message: '描述不能为空！',}]
            })(
              <TextArea rows={2} placeholder='请输入描述的内容'/>
            )}
        </Form.Item>
      </Form>
    </Modal>
     
    </>
  )
}

export default Form.create()(Factor)