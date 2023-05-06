import React, {ReactNode, useEffect, useState, useRef} from 'react';
import {Dispatch} from '@/models/connect';

import {Button, Col, Form, Input, Row, Table, Modal, Popover, Drawer} from 'antd';
import ChainDetail from '@/components/Chain/chainDetail';
import SourceDetail from '@/components/Chain/sourceDetail';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';

const FormItem = Form.Item;
const {Search} = Input;
interface crowChainProp {
    source_id: number
    source_label: string
    source_name: string
    source_sign: string
    chain_count: number
}
interface modalSourceEditConfig {
    source_id: string | number
    source_sign: string | number
    source_label: string | number
}


interface SourceProp {
    dispatch: Dispatch
}
const Source: React.FC<SourceProp> = ({dispatch}) => {
    const sourcedetailRef = useRef<any>();
    const [SourceList, setSourceList] = useState<crowChainProp[]>([]);
    const [addSource, setaddSource] = useState<string>();
    const [editSourceId, seteditSourceId] = useState<string | number>(0);
    const [chainEditVisible, setchainEditVisible] = useState<boolean>(false);
    const [sourceEditVisible, setsourceEditVisible] = useState<boolean>(false);
    const [sourceName, setsourceName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modalConfirmLoading, setmodalConfirmLoading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<crowChainProp[]>([]);
    const columns: ColumnProps<crowChainProp>[] = [
        {
            key: 'source_id',
            title: '序号',
            dataIndex: 'source_id',
            align: 'center',
            width: 100
        },
        {
            key: 'source_label',
            title: '站点',
            dataIndex: 'source_label',
            align: 'center'
        },
        {
            key: 'chain_count',
            title: '链路数量',
            dataIndex: 'chain_count',
            width: 100,
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'Action',
            key: 'Action',
            align: 'center',
            width: '140',
            render: (text: string, record: crowChainProp) => {
                let editBtn = <Button type="link" onClick={() => editChain(record)}>编辑</Button>;
                let deleteBtn = <Button type="link" onClick={() => deleteSourceEvent(record)}>删除</Button>
                return (
                    <>
                        {editBtn}
                        {deleteBtn}
                    </>
                )
            }
        }
    ];
    const filterSourceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setsourceName(e.target.value.trim());
    }
    const addSourceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
    }
    const resetForm = () => {
        setsourceName('');
        getList();
    }
    // 创建任务API
    const createSourceEvent = async (values: modalSourceEditConfig) => {
        setmodalConfirmLoading(true);
        let res = await dispatch({
            type: 'Chain/createSource',
            payload: {...values}
        })
        if (res.code === 0) {
            getList();
            setsourceEditVisible(!sourceEditVisible);
        }
        setmodalConfirmLoading(false);
    }
    // 删除任务API
    const deleteSourceEvent = (rowData: crowChainProp) => {
        Modal.confirm({
            title: '确认删除站点及链路吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                dispatch({
                    type: 'Chain/deleteSource',
                    payload: {
                        source_id: ~~rowData.source_id
                    }
                }).then((result: any) => {
                    if (result.code === 0) {
                        getList();
                    } else {
                        Modal.error({
                            title: '错误',
                            content: result.message
                        })
                    }
                }).catch((err: string) => {
                    Modal.error({
                        title: '错误',
                        content: err
                    })
                });
            },
            onCancel: () => {

            }
        })
    }
    const getList = async (source_name?: string) => {
        setLoading(true);
        dispatch({
            type: 'Chain/getSourceList',
            payload: {source_name}
        }).then((result: any) => {
            setLoading(false);
            if (result.code === 0) {
                setdataSource([...result.data]);
            } else {
                Modal.error({
                    title: '错误',
                    content: result.message
                })
            }
        }).catch((err: string) => {
            setLoading(false);
            Modal.error({
                title: '错误',
                content: err
            })
        });
    }
    // 编辑
    const editChain = (rowData: crowChainProp) => {
        seteditSourceId(rowData.source_id);
        setchainEditVisible(!chainEditVisible);
    }
    // 编辑来源
    const sourceEditOk = () => {
        sourcedetailRef.current.validateFields(async (errors: any, values: modalSourceEditConfig) => {
            if (errors) {
                return;
            }
            await createSourceEvent(values);
        })
    }
    useEffect(() => {
        getList();
    }, [])
    return (
        <>
            <div className="main-content">
                <Row>
                    <Col span={20}>
                        <Form layout="inline">
                            <Col span={4}>
                                <FormItem><Button type="primary" onClick={() => setsourceEditVisible(!sourceEditVisible)}>新建站点</Button></FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="站点名称">
                                    <Input onChange={filterSourceNameChange} value={sourceName} />
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" style={{marginRight: '20px'}} onClick={() => getList(sourceName)}>搜索</Button>
                                    <Button type="primary" onClick={resetForm}>重置</Button>
                                </FormItem>
                            </Col>
                        </Form>
                    </Col>
                </Row>
                <div style={{width: '600px'}}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        rowKey="source_id"
                        loading={loading}
                    ></Table>
                </div>
                <Drawer
                    title="头条链路编辑"
                    placement="right"
                    width="80%"
                    visible={chainEditVisible}
                    onClose={() => setchainEditVisible(!chainEditVisible)}
                    destroyOnClose>
                        <ChainDetail source_id={~~editSourceId} />
                </Drawer>
                <Modal
                    title="新建、修改站点"
                    visible={sourceEditVisible}
                    confirmLoading={modalConfirmLoading}
                    okText="确定"
                    cancelText="取消"
                    onOk={sourceEditOk}
                    onCancel={() => setsourceEditVisible(!sourceEditVisible)}
                    >
                    <SourceDetail ref={sourcedetailRef} />
                </Modal>
            </div>
        </>
    )
}
export default connect()(Source);