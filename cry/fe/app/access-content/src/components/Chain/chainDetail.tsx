import React, {useEffect, useState, useRef} from 'react';
import {Dispatch} from '@/models/connect';
import {ChainItemProp} from '@/config/app';
import {Input, Button, Form, Icon, Collapse, Modal, Popover} from 'antd';
import ChainItem from './chainItem';
import { connect } from 'dva';
import './index.less';
interface chainItem {
    chain_id: number | string
    chain: string
    childData?: chainItem[] | undefined | null
    pid: number | string
}
interface addItemProp {
    source_id: number
    pid: number
    chain: string
}
interface IProps {
    source_id: number
    dispatch: Dispatch
    oData?: chainItem[]
}
const Search = Input.Search;
const ChainDetial: React.ForwardRefRenderFunction<{}, IProps> = ({source_id, dispatch}) => {
    const [chainDetailList, setchainDetailList] = useState<chainItem[]>([]);
    const [popVisible, setpopVisible] = useState<boolean>(false);
    const [searchLoading, setsearchLoading] = useState<boolean>(false);
    const [searchValue, setserachValue] = useState<string>('');
    const [modalVisible, setmodalVisible] = useState<boolean>(false);
    const [modalValue, setmodalValue] = useState<string>('');
    const [modalAddId, setmodalAddId] = useState<number | string>(0);
    const [modalEditPid ,setmodalEditPid] = useState<number | string>(0);
    const [modalLoading, setmodalLoading] = useState<boolean>(false);
    const [modalTitle, setmodalTitle] = useState<string>('新增子链路节点');
    const [modalType, setmodalType] = useState<string>('add');
    const addSearch = useRef<any>();
    const popAddElement = (
        <Search placeholder="请输入链路节点" ref={addSearch} value={searchValue} onChange={event => setserachValue(event.target.value)} onSearch={() => addNewChain()} enterButton="ok" loading={searchLoading} />
    )
    const getChainData = async () => {
        let allChainData;
        const res = await dispatch({
            type: 'Chain/getChainListGroup',
            payload: {
                source_id
            }
        });
        let data = res ?. data;
        if (data) {
            Object.keys(data).forEach((item: number | string) => {
                data[item].map((itemSmall: any) => itemSmall.opid = item);
            })
            let resdata = data[0];
            allChainData = resdata && resdata.map((item: any) => {
                function loopData(item: any) {
                    let allChainDataItem = {};
                    allChainDataItem['chain_id'] = item['pid'];
                    allChainDataItem['chain'] = item['chain'];
                    allChainDataItem['pid'] = item['opid'];
                    allChainDataItem['childData'] = data[item['pid']] ? data[item['pid']].map((itemSmall: any) => loopData(itemSmall)) : [];
                    return allChainDataItem;
                }
                return loopData(item);
            })
        } else {
            allChainData = [];
        }
        setchainDetailList(allChainData);
    }
    const addNewChain = async () => {
        let param: addItemProp;
        if (modalVisible) {
            param = {
                chain: modalValue,
                source_id,
                pid: ~~modalAddId
            }
            setmodalLoading(true);
        } else {
            param = {
                chain: searchValue,
                source_id,
                pid: 0
            }
            setsearchLoading(true);
        }
        const res = await dispatch({
            type: 'Chain/createChain',
            payload: {...param}
        });
        setsearchLoading(false);
        setmodalLoading(false);
        if (res.code === 0) {
            getChainData();
            setserachValue('');
            setmodalValue('');
        } else {
            Modal.error({
                title: '错误',
                content: JSON.stringify(res.message)
            });
            return;
        }
        setpopVisible(false);
        setmodalVisible(false);
    }
    const updateChain = async () => {
        let param = {
            chain_id: ~~modalAddId,
            source_id,
            chain: modalValue,
            pid: modalEditPid
        }
        setmodalLoading(true);
        const res = await dispatch({
            type: 'Chain/updateChain',
            payload: {...param}
        });
        setmodalLoading(false);
        if (res.code === 0) {
            getChainData();
            setmodalValue('');
        } else {
            Modal.error({
                title: '错误',
                content: JSON.stringify(res.message)
            });
            return;
        }
        setmodalVisible(false);
    }
    const switchAddModal = (data: chainItem, type: string) => {
        setmodalType(type);
        if (type == 'add') {
            setmodalTitle('新增子链路节点');
        } else {
            setmodalTitle('修改链路节点');
            setmodalValue(data.chain);
        }
        setmodalVisible(!modalVisible);
        setmodalAddId(data.chain_id);
        setmodalEditPid(data.pid);
    }
    const deleteCurChain = (data: chainItem) => {
        Modal.confirm({
            title: '确定要删除链路吗？',
            content: data.chain,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                dispatch({
                    type: 'Chain/deleteChain',
                    payload: {
                        chain_id: ~~data.chain_id
                    }
                }).then((result: any) => {
                    if (result.code === 0) {
                        getChainData();
                    }
                }).catch((err: any) => {
                    Modal.error({
                        title: '错误',
                        content: err
                    })
                });
            },
            onCancel: () => {}
        });
    }
    const modalAddOk = () => {
        if (!modalValue) {
            Modal.error({
                title: '错误',
                content: '链路未填写'
            });
            return;
        }
        if (modalType == 'add') {
            addNewChain();
        } else {
            updateChain();
        }
    }
    useEffect(() => {
        getChainData();
    }, []);
    return (<>
        <ChainItem
            chainDetailList={chainDetailList}
            switchAddModal={(data: chainItem, type: string) => switchAddModal(data, type)}
            deleteCurChain={(data: chainItem) => deleteCurChain(data)}
            >
        </ChainItem>
        <Popover
            trigger="click"
            content={popAddElement}
            visible={popVisible}
            onVisibleChange={() => setpopVisible(!popVisible)}>
            <Button type="primary" icon="plus">同级</Button>
        </Popover>
        <Modal
            title={modalTitle}
            destroyOnClose
            visible={modalVisible}
            confirmLoading={modalLoading}
            okText="确定"
            cancelText="取消"
            onOk={modalAddOk}
            onCancel={() => setmodalVisible(!modalVisible)}>
            <Input value={modalValue} onChange={event => setmodalValue(event.target.value)} />
        </Modal>
    </>)
}
export default connect()(ChainDetial);